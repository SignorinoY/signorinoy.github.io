---
title: Spring MVC 入门指北（一）：Hello World!
tags: [spring, spring mvc, java]
date: 2018-09-22 15:46:15
permalink: spring-mvc-hello-world
---

本文介绍了在IntelliJ IDEA中如何使用Maven创建一个简单的Java Web项目,利用Spring MVC技术来搭建一个Web开发框架,并进行测试及部署.
<!-- more -->

## 开发环境

- Java: 10.0.2
- Intellij IDEA: 2018.2.1
- Tomcat: 9.0.8

## 使用Maven创建项目

1. 选择 Maven 项目,勾选 create from archetype ,选择 maven-archetype-webapp 用于创建 Web 项目
    ![创建 Web 项目](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-1.png)
    ![创建 Web 项目](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-2.png)
2. 填写 GroupId 和 ArtifactId , Version 默认即可,这三个属性可以唯一标识项目,具体解释如下：
    ![创建 Web 项目](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-3.png)
    - GroupId: 定义了项目属于哪个组,举个例子,如果你的公司是 mycom ,有一个项目为 myapp ,那么 GroupId 就应该是com.mycom.myapp .
    - ArtifactId: 定义了当前maven项目在组中唯一的ID,比如 myapp-util , myapp-domain , myapp-web 等.
    - Version: 指定了 myapp 项目的当前版本, SNAPSHOT 意为快照,说明该项目还处于开发中,是不稳定的版本.
    - Name: 声明了一个对于用户更为友好的项目名称,不是必须的,推荐为每个 pom 声明name,以方便信息交流.
3. 设置Maven配置,如maven目录、配置文件位置、本地仓库位置等
    ![创建 Web 项目](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-4.png)
    - Maven home directory,Maven 主目录,即最外层目录；
    - User settings file,Maven 配置文件；
    - Local repository,Maven 本地仓库,用于存储依赖包.
4. 填写项目名称、选择项目保存路径
    ![创建 Web 项目](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-5.png)
    - Project name,项目名称；
    - Project location,项目保存位置；
    - More Settings,更多配置,如配置项目模块位置、项目格式等.
5. 成功创建后项目目录如下：
    ![创建 Web 项目](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-6.png)
6. 修改项目目录,手动创建test、resources、java这样的结构实际上,之所以建立这样的目录结构,仅仅是出于我们的习惯以及方便管理项目而已.
    1. 依次点击`File`->`Project Structure`
    2. 在最左边的`Project Structure`列表中选择`Modules`,点击`Sources`进入我们的项目结构视图如下：
    ![创建 Web 项目](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-8.png)
    3. 右键呼出菜单栏,点击`New Folder`即可创建新目录,建立新的目录结构如下所示：
    ![创建 Web 项目](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-9.png)
    4. 选择`java`目录,点击`Mark as: Sources`即可将`java`目录标记为源目录
    ![创建 Web 项目](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-10.png)
    5. 以同样的方法,相继标记`Tests`、`Resources`和`Test Resources`目录
    ![创建 Web 项目](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-11.png)
        > - `Sources` 一般用于标注类似 `src` 这种可编译目录.有时候我们不单单项目的 `src` 目录要可编译,还有其他一些特别的目录也许我们也要作为可编译的目录,就需要对该目录进行此标注.只有 `Sources` 这种可编译目录才可以新建 `Java` 类和包,这一点需要牢记.
        > - `Tests` 一般用于标注可编译的单元测试目录.在规范的 maven 项目结构中,顶级目录是 `src` ,maven 的 `src` 我们是不会设置为 `Sources` 的,而是在其子目录 `main` 目录下的 `java` 目录,我们会设置为 `Sources` .而单元测试的目录是 `src - test - java` ,这里的 `java` 目录我们就会设置为 `Tests` ,表示该目录是作为可编译的单元测试目录.一般这个和后面几个我们都是在 maven 项目下进行配置的,但是我这里还是会先说说.从这一点我们也可以看出 IntelliJ IDEA 对 maven 项目的支持是比较彻底的.
        > - `Resources` 一般用于标注资源文件目录.在 maven 项目下,资源目录是单独划分出来的,其目录为： `src - main -resources` ,这里的 `resources` 目录我们就会设置为 `Resources` ,表示该目录是作为资源目录.资源目录下的文件是会被编译到输出目录下的.
        > - `Test Resources` 一般用于标注单元测试的资源文件目录.在 maven 项目下,单元测试的资源目录是单独划分出来的,其目录为： `src - test - resources` ,这里的 `resources` 目录我们就会设置为 `Test Resources` ,表示该目录是作为单元测试的资源目录.资源目录下的文件是会被编译到输出目录下的.
        > - `Excluded` 一般用于标注排除目录.被排除的目录不会被 IntelliJ IDEA 创建索引,相当于被 IntelliJ IDEA 废弃,该目录下的代码文件是不具备代码检查和智能提示等常规代码功能.
7. 最终成功创建的 `Web` 项目目录结构如下：
    ![创建 Web 项目](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-12.png)

至此 Maven 项目创建完成,java源目录设置成功.

## Maven自动导入jar包

我们使用maven管理依赖,Maven所做的工作就是自动把你需要的jar包下载到本地,然后关联到项目中来.maven的所有jar包都是保存在几个中央仓库里面的,其中一个最常用的是[Maven Repository](http://mvnrepository.com/),即,你需要什么jar包,它就会从仓库中拿给你.maven靠pom.xml文件来定义需求的.

在[Maven Repository](http://mvnrepository.com/)中查阅仓库,比如我们在此处需要引用`spring-mvc`,选择制定版本后,即可查询到制定版本的maven引用.如图中红框所示：
![Maven自动导入jar包](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-13.png)
我们将其复制到pom.xml中的`<dependencies>`中,这样,Maven就会开始自动下载jar包到本地仓库,然后关联到你的项目中,下载完成后,我们展开工程目录中External Libraries,可以发现虽然我们只写了一个依赖,但是会把与它密切相关的jar包同时导入进来.
![Maven自动导入jar包](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-14.png)

## Spring MVC 框架配置

Spring MVC的核心是`DispatcherServlet`,这个`Servlet`充当Spring MVC的前端控制器.与其他`Servlet`一样,`DispatcherServlet`必须在Web应用程序的`web.xml`文件中进行配置.所以在应用程序中使用Spring MVC的第一件事情就是将下面的`Servlet`声明放入`web.xml`中.

为这个`Servlet`所设置的`servlet-name`是很重要的.默认情况下,Spring MVC 会自动扫描 `WEB-INF` 下以 `servlet-name` 标签声明的名称开头以 `servlet` 结尾的配置文件.在这里我们显示配置用于解析 `DispatcherServlet`的配置文件.

在`web.xml`中通过将`DispatcherServlet`映射到`/`,声明了它会作为默认的`servlet`并且会处理所有的请求,包括对静态资源的请求.

对`webapp - WEB-INF`下的`web.xml`文件进行修改,如下所示：

```xml
<!DOCTYPE web-app PUBLIC
  "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
  "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app version="2.5" xmlns="http://java.sun.com/xml/ns/javaee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://java.sun.com/xml/ns/javaee
         http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd">

  <!-- 配置 DispatcherServlet 对 url 进行过滤 -->
  <servlet>
    <servlet-name>mvc-dispatcher</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>

    <!-- 显示配置用于解析 DispatcherServlet 的配置文件 -->
    <!-- 如果不显示指定,则 Spring MVC 会自动扫描 WEB-INF 下以 servlet-name 标签声明的名称开头以 servlet 结尾的配置文件 -->
    <init-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>classpath:spring-mvc.xml</param-value>
    </init-param>
    <!-- 显示指定加载顺序-->
    <load-on-startup>1</load-on-startup>
  </servlet>
  <servlet-mapping>
    <servlet-name>mvc-dispatcher</servlet-name>
    <!-- 如果声明 /* 则会拦截所有请求,包括 action 返回的 .jsp 页面 -->
    <url-pattern>/</url-pattern>
  </servlet-mapping>

</web-app>
```

`DispatcherServlet`需要咨询一个或多个处理器映射来明确地将请求分发给那个控制器.Spring自带了多个处理器映射实现供我们选择,具体如下：

- `BeanNameUrlHandlerMapping`: 根据控制器`Bean`的名字将控制器映射到URL.
- `ControllerBeanNameHandlerMapping`: 与`BeanNameUrlHandlerMapping`类似,根据控制器`Bean`的名字将控制器映射到`URL`.使用该处理器映射实现,`Bean`的名字不需要遵循URL的约定.
- `ControllerClassNameHandlerMpaaing`：通过使用控制器的类名作为`URL`基础将控制器映射到URL.
- `DefaultAnnotationHandlerMapping`：将请求映射给使用`@RequestMapping`注解的控制器好控制器方法.
- `SimpleUrlHandlerMapping`：使用定义在`Spring`应用上下文的属性集合将控制器映射到`URL`.

使用上述这些处理器映射通常只需在`Spring`中配置一个`Bean`.如果没有找到处理器映射`Bean`,`DispatcherServlet`将创建并使用`BeanNameUrlHandlerMapping`和`DefaultAnnotationHandlerMapping`.我们主要使用基于注解的控制器类,所以`DispatcherServlet`所提供的`DefaultAnnotationHandlerMapping`就能很好地满足我们的需求了. 我们在`spring-mvc.xml`文件中添加一行配置就能得到`Spring MVC`所提供的注解启动特性

我们需要在`spring-mvc.xml`文件中配置一个 `context:component-scan` 这样`MainController`类(以及将要编写的其他控制器)将会自动被发现并注册为`Bean`.

在resources目录下新建spring mvc配置文件：`spring-mvc.xml`
![spring-mvc.xml](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-15.png)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:mvc="http://www.springframework.org/schema/mvc"
  xmlns:context="http://www.springframework.org/schema/context"
  xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

  <!-- Using Spring MVC provides annotation-driven feature -->
  <mvc:annotation-driven/>

  <!-- Spring Auto scanning components -->
  <context:component-scan base-package="cn.ghy.demo.controller"/>
</beans>
```

## Spring MVC 控制器

新建`cn.ghy.demo.controller`包,并在该目录下新建一个名为`MainController`的Java类,用于测试Spring MVC框架.

`@RequestMapping`：可以为控制器指定处理可以请求哪些URL请求,`@RequestMapping`可以定义在类或方法上.

`@RestController`：使用的效果是将方法返回的对象直接在浏览器上展示成`json`格式.

```java
package cn.ghy.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/")
@RestController
public class MainController {

  @RequestMapping("hello")
  public String hello() {
    return "hello world";
  }
}
```

## 配置 Tomcat 进行测试

1. 点击编译器右上角`Add Configuration`对Tomcat进行配置以进行编译及测试.
    ![配置 Tomcat 进行测试](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-18.png)
2. 选择`Add New Configuration`.
    ![配置 Tomcat 进行测试](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-16.png)
3. 选择`Tomcat Server - Local`添加新的配置
    ![配置 Tomcat 进行测试](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-17.png)
4. 配置服务器进行的Tomcat 版本,测试路径等.
    ![配置 Tomcat 进行测试](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-19.png)
5. 发现出现报错,因为未发现进行部署的对象,点击`fix`进行修复以进行选择.
    ![配置 Tomcat 进行测试](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-20.png)
6. 点击运行,对代码进行测试,运行结果如下：
    ![配置 Tomcat 进行测试](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-21.png)

## 对项目进行打包及部署

1. 单击编译器右侧`Maven Projects`,选择`compiler`对项目进行打包,打包结果如下：
  ![对项目进行打包及部署](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-22.png)
  ![对项目进行打包及部署](https://xn--i0v668g.com/uploads/images/spring-mvc-hello-world-23.png)
2. 将打包所生成的`.war`文件复制到Tomcat服务器下webapp目录下,重启Tomcat服务器,即部署成功.