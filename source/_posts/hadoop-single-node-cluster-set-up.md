---
title: Hadoop学习笔记：伪分布式配置
tags: [Hadoop, 分布式计算, 伪分布式, java]
date: 2018-09-26 17:12:12
permalink: hadoop-single-node-cluster-set-up
---

Hadoop 是一个开源框架, 允许使用简单的编程模型在跨计算机集群的分布式环境中存储和处理大数据. 它的设计是从单个服务器扩展到数千个机器, 每个都提供本地计算和存储.

本次实验基于[Hadoop安装教程_伪分布式配置_CentOS6.4/Hadoop2.6.0](http://dblab.xmu.edu.cn/blog/install-hadoop-in-centos/)与[官网教程](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/SingleCluster.html), 实现了在 CentOS 操作系统的主机上安装 Hadoop-2.9.1 、 并实现单机与伪分布式配置并运行实例.
<!-- more -->

## 开发环境

- 腾讯云主机: CentOS 7.4 64位
- Java: 10.0.1

## 准备工作

### 安装SSH、 配置SSH无密码登陆

集群、 单节点模式都需要用到 SSH 登陆（类似于远程登陆, 你可以登录某台 Linux 主机, 并且在上面运行命令）, 一般情况下, CentOS 默认已安装了 SSH client、 SSH server, 打开终端执行如下命令进行检验：

```sh
rpm -qa | grep ssh
```

如果返回的结果如下图所示, 包含了 SSH client 跟 SSH server, 则不需要再安装.

![安装SSH、 配置SSH无密码登陆
](https://xn--i0v668g.com/uploads/images/hadoop-single-node-cluster-set-up-1.png)

若需要安装, 则可以通过 `yum` 进行安装（安装过程中会让你输入 `[y/N]` , 输入 `y` 即可）

```sh
yum install openssh-clients
yum install openssh-server
```

执行如下命令即可使用 SSH 登陆本地服务器：

```sh
ssh localhost
```

但这样登陆是需要每次输入密码的, 在后面我们有多个服务器需要进行登陆时, 重复输入密码往往时一件比较费时费事的事情, 所以我们需要配置成 SSH 无密码登陆.

下面以在本地生成 SSH 无密码登陆为例, 进行示范, 在本地配置多个服务器的 SSH 无密码登陆可类似执行.

首先输入 `exit` 退出刚才的 SSH , 就回到了我们原先的终端窗口,然后利用 `ssh-keygen` 生成密钥,并将密钥加入到授权中：

```sh
exit
cd ~/.ssh/
ssh-keygen -t rsa
cat id_rsa.pub >> authorized_keys
chmod 600 ./authorized_keys
```

{% note info %}
在本文中, 因为只在本地进行搭建, 所以未使用 SSH 配置 SSH 无密码登陆.
{% endnote %}

### 配置 `Java` 环境

现在一般 Linux 系统默认安装的基本是 OpenJDK,如 CentOS 6.4 就默认安装了 OpenJDK 1.7. 若系统未安装, 可参考网上相关教程进行安装.

在安装完成后, 具体如何配置 Java 环境, 可参考下面的操作步骤：

用文本编辑器打开 `/etc/profile` 来配置 Java 全局环境变量

```sh
vi /etc/profile
```

在profile文件末尾加入：

```sh
export JAVA_HOME=/usr/java/jdk-10.0.1
export PATH=$JAVA_HOME/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```

让该环境变量生效, 执行如下代码：

```sh
source ~/.bashrc
```

设置好后我们来检验一下是否设置正确：

```sh
java -version
$JAVA_HOME/bin/java -version
```

如果设置正确的话,`$JAVA_HOME/bin/java -version` 会输出 Java 的版本信息,且和 `java -version` 的输出结果一样,如下图所示：
![配置 `Java` 环境](https://xn--i0v668g.com/uploads/images/hadoop-single-node-cluster-set-up-2.png)

### 安装Hadoop

从清华大学开源软件镜像站下载 Hadoop , 此处我选择的是其稳定版本, 下载地址如下：[https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/stable/hadoop-2.9.1.tar.gz](https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/stable/hadoop-2.9.1.tar.gz)

下载命令如下：

```sh
wget https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/stable/hadoop-2.9.1.tar.gz
```

解压 Hadoop 至 `/usr/local`

```sh
tar -zxvf ./hadoop-2.9.1.tar.gz -C /usr/local
cd /usr/local
mv ./hadoop-2.9.1/ ./hadoop  
```

Hadoop 解压后即可使用. 输入如下命令来检查 Hadoop 是否可用：

```sh
cd /usr/local/hadoop/hadoop-2.9.1
./bin/hadoop version
```

Hadoop 成功安装后, 则会显示 Hadoop 版本信息,如下：
![安装Hadoop](https://xn--i0v668g.com/uploads/images/hadoop-single-node-cluster-set-up-3.png)

### 创建hadoop用户

如果你安装 CentOS 的时候不是用的 hadoop 用户,那么需要增加一个名为 hadoop 的用户.

执行命令创建新用户 hadoop：

```sh
useradd -m hadoop -s /bin/bash
```

接着使用如下命令修改密码, 按提示输入两次密码, 可简单的设为 “hadoop”

```sh
passwd hadoop
```

修改hadoop文件拥有者为hadoop

```sh
chown -R hadoop:hadoop ./hadoop
```

{% note info %}
理论上, 不创建 hadoop 用户也是可以的, 但此处仍建议单独创建 hadoop 用户, 以方便权限管理, 避免 hadoop 用户对其他的文件、 进程进行操作, 提高系统安全性.
{% endnote %}

## Hadoop单机配置(非分布式)

切换至 hadoop 用户运行 Hadoop 单机配置(非分布式)

Hadoop 默认模式为非分布式模式, 无需进行其他配置即可运行. 非分布式即单 Java 进程, 方便进行调试.

在此我们选择运行 `grep` 例子, 我们将 `input` 文件夹中的所有文件作为输入, 筛选当中符合正则表达式 `dfs[a-z.]+` 的单词并统计出现的次数, 最后输出结果到 output 文件夹中.

```sh
cd /usr/local/hadoop/hadoop-2.9.1
mkdir ./input
cp ./etc/hadoop/*.xml ./input
./bin/hadoop jar ./share/hadoop/mapreduce/hadoop-mapreduce-examples-*.jar grep ./input ./output 'dfs[a-z.]+'
cat ./output/*
```

运行结果如下：

![Hadoop单机配置(非分布式)](https://xn--i0v668g.com/uploads/images/hadoop-single-node-cluster-set-up-4.png)

{% note warning %}
Hadoop 默认不会覆盖结果文件, 因此再次运行上面实例会提示出错, 需要先将 `./output` 删除.
{% codeblock lang:sh %}
rm -r ./output
{% endcodeblock %}

{% endnote %}

## Hadoop伪分布式配置

修改配置文件 `core-site.xml`

```sh
vi ./etc/hadoop/core-site.xml
```

```xml
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
    </property>
</configuration>
```

修改配置文件 `hdfs-site.xml`

```sh
vi ./etc/hadoop/hdfs-site.xml
```

```xml
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
</configuration>
```

配置完成后, 执行 `NameNode` 的格式化:

```sh
./bin/hdfs namenode -format
```

成功运行后, 结果如下：
![Hadoop伪分布式配置](https://xn--i0v668g.com/uploads/images/hadoop-single-node-cluster-set-up-5.png)

接着开启 `NaneNode` 和 `DataNode` 守护进程：

```sh
./sbin/start-dfs.sh
```

在看到提示后, 输入 hadoop 用户密码.

在输入密码后, 会提示是否需要继续连接, 输入`yes`.
![Hadoop伪分布式配置](https://xn--i0v668g.com/uploads/images/hadoop-single-node-cluster-set-up-6.png)
![Hadoop伪分布式配置](https://xn--i0v668g.com/uploads/images/hadoop-single-node-cluster-set-up-7.png)

{% note warning %}
在运行过程中, 发现提示环境变量`JAVA_HOME`未定义, 需修改`/etc/hadoop/hadoop-env.sh`中定义的`JAVA_HOME`.
{% codeblock lang:sh %}
vi ./etc/hadoop/hadoop-env.sh
{% endcodeblock %}
修改 `export JAVA_HOME=${JAVA_HOME}` 为 `export JAVA_HOME=/usr/java/jdk-10.0.1`
{% endnote %}

启动完成后, 可以通过命令 jps 来判断是否成功启动, 若成功启动则会列出如下进程: `NameNode`、 `DataNode`和`SecondaryNameNode`.
![Hadoop伪分布式配置](https://xn--i0v668g.com/uploads/images/hadoop-single-node-cluster-set-up-8.png)

{% note warning %}
如果 `SecondaryNameNode` 没有启动, 请运行 `./sbin/stop-dfs.sh` 关闭进程, 然后再次尝试启动尝试.
{% endnote %}

成功启动后, 可以访问 Web 界面 [http://localhost:50070](http://localhost:50070 )  (主机地址) 查看 `NameNode` 和 `Datanode` 信息, 还可以在线查看 `HDFS` 中的文件.

![Hadoop伪分布式配置](https://xn--i0v668g.com/uploads/images/hadoop-single-node-cluster-set-up-9.png)

## Hadoop伪分布式实例

上面的单机模式, `grep` 例子读取的是本地数据, 伪分布式读取的则是 `HDFS` 上的数据. 要使用 `HDFS`, 首先需要在 `HDFS` 中创建用户目录：

```sh
./bin/hdfs dfs -mkdir -p /user/hadoop
```

接着将 `./etc/hadoop` 中的 `xml` 文件作为输入文件复制到分布式文件系统中, 即将 `/usr/local/hadoop/etc/hadoop` 复制到分布式文件系统中的 `/user/hadoop/input` 中. 我们使用的是 `hadoop` 用户, 并且已创建相应的用户目录 `/user/hadoop` , 因此在命令中就可以使用相对路径如 `input`, 其对应的绝对路径就是 `/user/hadoop/input`：

```sh
./bin/hdfs dfs -mkdir input
./bin/hdfs dfs -put ./etc/hadoop/*.xml input
```

复制完成后, 可以通过如下命令查看 `HDFS` 中的文件列表：

```sh
./bin/hdfs dfs -ls input
```

运行结果如下：
![Hadoop伪分布式实例](https://xn--i0v668g.com/uploads/images/hadoop-single-node-cluster-set-up-10.png)

伪分布式运行 `MapReduce` 作业的方式跟单机模式相同, 区别在于伪分布式读取的是 `HDFS` 中的文件.

```sh
./bin/hadoop jar ./share/hadoop/mapreduce/hadoop-mapreduce-examples-*.jar grep input output 'dfs[a-z.]+'
```

查看运行结果的命令（查看的是位于 `HDFS` 中的输出结果）：

```sh
./bin/hdfs dfs -cat output/*
```

![Hadoop伪分布式实例](https://xn--i0v668g.com/uploads/images/hadoop-single-node-cluster-set-up-11.png)

我们也可以将运行结果取回到本地：

```sh
rm -r ./output
./bin/hdfs dfs -get output ./output
cat ./output/*
```

{% note warning %}
同样在 Hadoop 运行程序时, 输出目录不能存在. 因此若要再次执行, 需要执行如下命令删除 `output` 文件夹:

{% codeblock lang:sh %}
./bin/hdfs dfs -rm -r output
{% endcodeblock %}

{% endnote %}

若要关闭 `Hadoop`, 则运行

```sh
./sbin/stop-dfs.sh
```