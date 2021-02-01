---
title: Hadoop学习笔记（1）：安装与伪分布式
categories: 开发者手册
tags: [Hadoop, 分布式计算]
date: 2021-02-01 00:12:12
---

Hadoop 是一个开源框架，允许使用简单的编程模型在跨计算机集群的分布式环境中存储和处理大数据。它的设计是从单个服务器扩展到数千个机器，每个都提供本地计算和存储。

本次实验基于[Hadoop安装教程_伪分布式配置_CentOS6.4/Hadoop2.6.0](http://dblab.xmu.edu.cn/blog/install-hadoop-in-centos/)与[官网教程](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/SingleCluster.html)，实现了在 Ubuntu 操作系统的主机上安装 Hadoop-3.3.0、并实现单机与伪分布式配置并运行实例.

<!-- more -->

## 准备工作

- 安装 SSH 与 Java 8；
- （可选）准备用户 `hadoop`。

## 安装 Hadoop

从清华镜像网站下载 Hadoop，此处我选择的是其[稳定版本](https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/stable/hadoop-3.3.0.tar.gz)。

```sh
wget https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/stable/hadoop-3.3.0.tar.gz
```

解压 Hadoop 至 `/usr/local/hadoop`

```sh
mkdir /usr/local/hadoop
tar -zxvf ./hadoop-3.3.0.tar.gz -C /usr/local/hadoop
```

Hadoop 解压后即可使用. 输入如下命令来检查 Hadoop 是否可用：

```sh
cd /usr/local/hadoop/hadoop-3.3.0
./bin/hadoop version
```

{% note info %}

在开始运行前，需修改`./etc/hadoop/hadoop-env.sh`中定义的`JAVA_HOME`。

```sh
vim ./etc/hadoop/hadoop-env.sh
```

修改 `export JAVA_HOME=${JAVA_HOME}` 为

```sh
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
```

{% endnote %}

Hadoop 成功安装后，则会显示 Hadoop 版本信息，如下：

```text
Hadoop 3.3.0
Source code repository https://gitbox.apache.org/repos/asf/hadoop.git -r aa96f1871bfd858f9bac59cf2a81ec470da649af
Compiled by brahma on 2020-07-06T18:44Z
Compiled with protoc 3.7.1
From source with checksum 5dc29b802d6ccd77b262ef9d04d19c4
This command was run using /usr/local/hadoop/hadoop-3.3.0/share/hadoop/common/hadoop-common-3.3.0.jar
```

## Hadoop 非分布式

Hadoop 默认模式为非分布式模式，无需进行其他配置即可运行。非分布式即单 Java 进程，方便进行调试。

在此我们选择运行 `grep` 例子，我们将 `input` 文件夹中的所有文件作为输入，筛选当中符合正则表达式 `dfs[a-z.]+` 的单词并统计出现的次数，最后输出结果到 output 文件夹中。

```sh
cd /usr/local/hadoop/hadoop-3.3.0
mkdir ./input
cp ./etc/hadoop/*.xml ./input
./bin/hadoop jar ./share/hadoop/mapreduce/hadoop-mapreduce-examples-*.jar grep ./input ./output 'dfs[a-z.]+'
cat ./output/*
```

运行结果如下：

```text
1       dfsadmin
```

{% note warning %}

Hadoop 默认不会覆盖结果文件，因此再次运行上面实例会提示出错，需要先将 `./output` 删除

```sh
rm -r ./output
```

{% endnote %}

## Hadoop 伪分布式

修改配置文件 `core-site.xml`

```sh
vim ./etc/hadoop/core-site.xml
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
vim ./etc/hadoop/hdfs-site.xml
```

```xml
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
</configuration>
```

配置完成后，执行 `NameNode` 的格式化:

```sh
./bin/hdfs namenode -format
```

接着开启 `NaneNode` 和 `DataNode` 守护进程：

```sh
./sbin/start-dfs.sh
```

{% note warning %}

在执行时，发现出现 `no HDFS_NAMENODE_USER defined` 错误（未定义 NameNode 用户），参考 [HDFS_NAMENODE_USER, HDFS_DATANODE_USER & HDFS_SECONDARYNAMENODE_USER not defined](https://stackoverflow.com/questions/48129029/hdfs-namenode-user-hdfs-datanode-user-hdfs-secondarynamenode-user-not-defined)，定义相关用户

```sh
export HDFS_NAMENODE_USER="root"
export HDFS_DATANODE_USER="root"
export HDFS_SECONDARYNAMENODE_USER="root"
export YARN_RESOURCEMANAGER_USER="root"
export YARN_NODEMANAGER_USER="root"
```

{% endnote %}

启动完成后，可以通过命令 jps 来判断是否成功启动，若成功启动则会列出如下进程: `NameNode`、 `DataNode`和`SecondaryNameNode`。

```text
8487 DataNode
8298 NameNode
8715 SecondaryNameNode
9387 Jps
```

{% note info %}

如果 `SecondaryNameNode` 没有启动，请运行 `./sbin/stop-dfs.sh` 关闭进程，然后再次尝试启动尝试.

{% endnote %}

成功启动后，可以访问 Web 界面 [http://localhost:50070](http://localhost:50070 )  (主机地址) 查看 `NameNode` 和 `Datanode` 信息，还可以在线查看 `HDFS` 中的文件.

上面的单机模式，`grep` 例子读取的是本地数据，伪分布式读取的则是 `HDFS` 上的数据. 要使用 `HDFS`，首先需要在 `HDFS` 中创建用户目录：

```sh
./bin/hdfs dfs -mkdir -p /user/hadoop
```

接着将 `./etc/hadoop` 中的 `xml` 文件作为输入文件复制到分布式文件系统中，即将 `/usr/local/hadoop/etc/hadoop` 复制到分布式文件系统中的 `/user/hadoop/input` 中. 我们使用的是 `hadoop` 用户，并且已创建相应的用户目录 `/user/hadoop` ，因此在命令中就可以使用相对路径如 `input`，其对应的绝对路径就是 `/user/hadoop/input`：

```sh
./bin/hdfs dfs -mkdir input
./bin/hdfs dfs -put ./etc/hadoop/*.xml input
```

复制完成后，可以通过如下命令查看 `HDFS` 中的文件列表：

```sh
./bin/hdfs dfs -ls input
```

伪分布式运行 `MapReduce` 作业的方式跟单机模式相同，区别在于伪分布式读取的是 `HDFS` 中的文件.

```sh
./bin/hadoop jar ./share/hadoop/mapreduce/hadoop-mapreduce-examples-*.jar grep input output 'dfs[a-z.]+'
```

查看运行结果的命令（查看的是位于 `HDFS` 中的输出结果）：

```sh
./bin/hdfs dfs -cat output/*
```

```text
1       dfsadmin
1       dfs.replication
```

我们也可以将运行结果取回到本地：

```sh
rm -r ./output
./bin/hdfs dfs -get output ./output
cat ./output/*
```

{% note warning %}

同样在 Hadoop 运行程序时，输出目录不能存在. 因此若要再次执行，需要执行如下命令删除 `output` 文件夹:

```sh
./bin/hdfs dfs -rm -r output
```

{% endnote %}

若要关闭 `Hadoop`，则运行

```sh
./sbin/stop-dfs.sh
```