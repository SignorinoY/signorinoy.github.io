---
title: Spring MVC 入门指北（二）：Mybatis集成
tags: [spring, spring mvc, java, Mybatis]
date: 2018-10-04 22:45:18
permalink: spring-mvc-mybatis
---

本文在[Spring MVC 入门指北（一）：Hello World!](https://梓阳.com/post/spring-mvc-hello-world/)的基础上, 搭建了 SSM(Spring + Spring MVC+ Mybatis) 框架, 实现了集成 Mybatis 来进行数据库的连接, 并基于此完成了该服务的调用.

> MyBatis 是一款优秀的持久层框架,它支持定制化 SQL 、 存储过程以及高级映射. MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集. MyBatis 可以使用简单的 XML 或注解来配置和映射原生信息,将接口和 Java 的 POJOs(Plain Old Java Objects, 普通的 Java 对象)映射成数据库中的记录.

更多内容可参考[Mybatis 官方文档](http://www.mybatis.org/mybatis-3/zh/index.html)

而要在 Spring 中集成 MyBatis , 我们还需要用到 MyBatis-Spring .

> MyBatis-Spring 会帮助你将 MyBatis 代码无缝地整合到 Spring 中. 使用这个类库中的类, Spring 将会加载必要的 MyBatis 工厂类和 session 类. 这个类库也提供一个简单的方式来注入 MyBatis 数据映射器和 SqlSession 到业务层的 bean 中. 而且它也会处理事务, 翻译 MyBatis 的异常到 Spring 的 DataAccessException 异常(数据访问异常,译者注)中.最终,它并不会依赖于 MyBatis,Spring 或 MyBatis-Spring 来构建应用程序代码.

更多内容可参考[Mybatis Spring 官方文档](http://www.mybatis.org/spring/zh/)
<!-- more -->

## 开发环境

- Java: 11
- Intellij IDEA: 2018.2.4
- Tomcat: 9.0.12
- MySQL: 8.0.12

## 引入 Mybatis

使用 Maven 自动引入与 Mybatis 相关的 Jar 包, 修改 `pom.xml` 文件, 添加相关依赖如下：

```xml
<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>3.4.6</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis-spring -->
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis-spring</artifactId>
  <version>1.3.2</version>
</dependency>
```

## 配置Mybatis

要和 Spring 一起使用 MyBatis,你需要在 Spring 应用上下文中定义至少两样东西:一个 SqlSessionFactory 和至少一个数据映射器类.

### 初始配置

在 MyBatis-Spring 中,SqlSessionFactoryBean 是用于创建 SqlSessionFactory 的. 要配置这个工厂 bean, 放置下面的代码在 `Spring` 的 `XML` 配置文件（即： `spring-servlet-dispatcher.xml` ）中:

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <property name="dataSource" ref="dataSource" />
</bean>
```

我们希望将 Spring 配置分成多个 XML 文件, 尽管不是严格要求, 但是将 Spring 配置文件组织到多个文件中是很好的主意, 基于这样的理念,我们在 `resources` 目录下面新创建一个名为 `spring-mybatis.xml` 的文件, 将 MyBatis 与 Spring 集成的相关配置都放在 `spring-mybatis.xml` 这个文件中, 内容如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans-3.1.xsd">

</beans>
```

并在其中添加如下配置：

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <property name="dataSource" ref="dataSource" />
</bean>
```

新增的 `spring-mybatis.xml` 需要配置 `ContextLoaderListener` 来进行加载. 为了使用 `ContextLoaderListener` , 需要在 `web.xml` 文件中添加如下的 `listener` 声明,注册 `ContextLoaderListener` , 并告诉 `ContextLoaderListener` 需要加载那些配置文件：

```xml
<listener>
  <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
<context-param>
  <param-name>contextConfigLocation</param-name>
  <param-value>classpath:spring-mybatis.xml</param-value>
</context-param>
```

{% note warning %}
下面, 我们都采取这种配置方式, 若不想采用这种方式, 将所有在 `spring-mybatis.xml` 中的配置移入 `spring-mvc.xml` 即可.
{% endnote %}

### 数据源配置

要注意 SqlSessionFactory 需要一个 DataSource(数据源,译者注). 这可以是任意的 DataSource , 配置它就和配置其它 Spring 数据库连接一样.

引入进行相关数据源配置的 Jar 包, 修改`pom.xml`文件, 添加相关依赖如下：

```xml
<!-- https://mvnrepository.com/artifact/org.springframework/spring-jdbc -->
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-jdbc</artifactId>
  <version>5.1.0.RELEASE</version>
</dependency>
<!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <version>8.0.12</version>
</dependency>
<!-- https://mvnrepository.com/artifact/commons-dbcp/commons-dbcp -->
<dependency>
  <groupId>commons-dbcp</groupId>
  <artifactId>commons-dbcp</artifactId>
  <version>1.4</version>
</dependency>
```

在 `spring-mybatis.xml` 文件里面增加 `DataSource` 配置如下：

```xml
<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
  <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
  <property name="url" value="jdbc:mysql://localhost:3306/hello_ssm?useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC&useSSL=false"/>
  <property name="username" value="root"/>
  <property name="password" value="root"/>
</bean>
```

对于大多数情况, 可以将整个应用程序配置在一个Bean装配文件中. 但有时候, 你会发现将一个部分配置抽取到单独的属性文件中会大有益处, 在上面的 dataSource 这个 Bean 声明中, 连接数据库所需要的所有配置都在这里. 这意味着有两件事情：

1. 如果你需要修改数据库的 URL 或者用户名和密码的话,你需要编辑这个 Spring 配置文件,然后重新编译和部署应用程序；
2. 用户名和密码是敏感信息, 你不希望它落到不合适的人手上.

我们可以单独很多信息抽取出来, 放置于单独的属性文件下, 方便进行修改.

在 `resources` 目录下, 新建 `jdbc.properties` 文件,内容如下：

```properties
jdbc.driverClass=com.mysql.cj.jdbc.Driver
jdbc.connectionURL=jdbc:mysql://localhost:3306/hello_ssm?useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC&useSSL=false
jdbc.username=root
jdbc.password=root
```

在 `spring-mybatis.xml` 中, 借助 `org.springframework.beans.factory.config.PropertyPlaceholderConfigurer` 声明属性文件所在位置,内容如下：

```xml
<bean id="propertyConfigurer"
  class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
  <property name="location" value="classpath:jdbc.properties"/>
</bean>
```

将 `spring-mybatis.xml` 配置中的硬编码值替换为基于 `jdbc.properties` 属性的占位符变量：

```xml
<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
  <property name="driverClassName" value="${jdbc.driverClass}"/>
  <property name="url" value="${jdbc.connectionURL}"/>
  <property name="username" value="${jdbc.username}"/>
  <property name="password" value="${jdbc.password}"/>
</bean>
```

以上,我们已完成了基本的 Mybatis 集成配置.

## 应用实例

### 建表

在 Mysql 中,新建 `hello_ssm` 数据库中, 使用如下的建表语句, 创建 `user` 表.

```sql
SET NAMES utf8 ;
DROP TABLE IF EXISTS `user`;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) DEFAULT NULL,
  `user_age` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'admin',18);
UNLOCK TABLES;
```

### `Entity`实体类

新建 `cn.ghy.demo.entity` package, 新建`User.java`, 用于映射表 user, 代码如下：

```java
package cn.ghy.demo.entity;

public class User {

  private int id;
  private String userName;
  private int userAge;

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public int getUserAge() {
    return userAge;
  }

  public void setUserAge(int userAge) {
    this.userAge = userAge;
  }

  @Override
  public String toString() {
    return "User{" +
        "id=" + id +
        ", userName='" + userName + '\'' +
        ", userAge=" + userAge +
        '}';
  }
}
```

### `Mapper`映射类

新建 `cn.ghy.demo.mapper` package, 新建 `UserMapper.java` , 如下：

```java
package cn.ghy.demo.mapper;

import cn.ghy.demo.entity.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMapper {

  User selectById(@Param("id") int id);
}
```

我们需要在 Spring 的 XML 配置文件中注册映射器,可以使用 MapperScannerConfigurer ,它将会查找类路径下的映射器并自动将它们创建为 MapperFactoryBean , 在`spring-mybatis.xml`文件中增加如下代码：

```xml
<bean id="mapperScannerConfigurer" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
  <property name="basePackage" value="cn.ghy.demo.mapper"/>
</bean>
```

使用映射器 XML 文件来指定 SQL 语句,在 `resources` 目录下新建 `mapper`目录,在其下新建`UserMapper.xml`,如下：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="cn.ghy.demo.mapper.UserMapper">

  <resultMap id="userResultMap" type="cn.ghy.demo.entity.User">
    <result property="id" column="id" jdbcType="INTEGER" />
    <result property="userName" column="user_name" jdbcType="VARCHAR" />
    <result property="userAge" column="user_age" jdbcType="INTEGER" />
  </resultMap>

  <select id="selectById" resultMap="userResultMap">
       SELECT * FROM user WHERE id = #{id}
    </select>

</mapper>
```

项目采用 xml 的方式实现接口. 采用这种方式的好处有很多, 比如可以采用包扫描, 更少的配置, 所有的 sql 语句都放在这里, 有利于统一规范, 代码的可维护性和可读性也大大提高.

我们需要在类路径下加载 `mapper` 包中的所有的 MyBatis 映射器XML文件, mapperLocations 属性使用一个资源位置的 list , 这个属性可以用来指定 MyBatis 的 XML 映射器文件的位置. 在 sqlSessionFactory 下添加该属性, 修改 `spring-mybatis.xml` 中 `sqlSessionFactory` 内容如下：

```[xml][spring-mybatis.xml]
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <property name="dataSource" ref="dataSource"/>
  <property name="mapperLocations" value="classpath:mapper/*.xml"/>
</bean>
```

### `Service`服务类

新建 `cn.ghy.demo.service` package, 新建 `UserService.java` , 如下：

```java
package cn.ghy.demo.service;

import cn.ghy.demo.entity.User;

public interface UserService {

  User selectById(int id);
}
```

新建 `cn.ghy.demo.service.impl` packgar, 新建 `UserServiceImpl.java` 使用 `UserService` 接口, 并实现里面的方法,代码如下：

```java
package cn.ghy.demo.service.impl;

import cn.ghy.demo.entity.User;
import cn.ghy.demo.mapper.UserMapper;
import cn.ghy.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

  @Autowired
  private UserMapper userMapper;

  @Override
  public User selectById(int id) {
    return userMapper.selectById(id);
  }
}
```

这里我们使用了 `@Autowired` 注解来自动装配 `userMapper` Bean.

我们需要在 `spring-mybatis.xml` 中添加 `context:component-scan` 元素, 来使 Spring 自动检测与定义 Bean, 增加内容如下：

```xml
<context:component-scan base-package="cn.ghy.demo.service"/>
```

### `Controller`控制类

Entity , Mapper, Service 完成后, 我们实现在 Controller 中调用 Service 来从数据库中获取数据.
新建`UserController.java`,如下：

```java
package cn.ghy.demo.controller;

import cn.ghy.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/user")
public class UserController {

  @Autowired
  private UserService userService;

  @RequestMapping(value = "/{id}", method = RequestMethod.GET)
  public String selectById(@PathVariable int id) {
    return userService.selectById(id).toString();
  }
}
```

### 运行结果

运行结果如下：
![运行结果](https://xn--i0v668g.com/uploads/images/spring-mvc-mybatis.png)

## 参考文章

- [使用IntelliJ IDEA开发SpringMVC网站（四）集成MyBatis](http://jasonli822.github.io/2016/06/29/springmvc-framework-4/)