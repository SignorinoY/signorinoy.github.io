---
title: Hadoop学习笔记：分布式集群
tags: [Hadoop, 分布式, java]
date: 2018-11-24 09:56:01
permalink: hadoop-cluster-set-up
---

## 开发环境

- Ubuntu 18.04.1 LTS (VMware)
- Hadoop 2.9.1

## 准备工作

1. 选定一台机器作为 Master ；
2. 在Master节点上配置 hadoop 用户、安装SSH server、安装 Java 环境；
3. 在 Master 节点上安装 Hadoop,并完成配置；
4. 在其他 Slave 节点上配置 hadoop 用户、安装 SSH server、安装 Java 环境；

<!-- more -->

## 网络设置

各个节点需设置不同的Ip地址,具体配置情况如下：

| Host Names | IP Address    |
| ---------- | ------------- |
| Master     | 192.168.1.246 |
| Slave1     | 192.168.1.245 |
| Slave2     | 192.168.1.247 |

### 设置桥接模式

> 配置成桥接网络连接模式的虚拟机就当作主机所在以太网的一部分,虚拟系统和宿主机器的关系,就像连接在同一个 Hub 上的两台电脑,可以像主机一样可以访问以太网中的所有共享资源和网络连接,可以直接共享主机网络的互联网接入线路访问互联网.
> **此处各节点根据上文所描述的配置,配置各节点IP地址.**

1. 打开`VMware-编辑-虚拟网络编辑器`,设置主机上网所用网卡为桥接模式,如下：
    ![`VMware-编辑-虚拟网络编辑器`](https://xn--i0v668g.com/uploads/images/hadoop-cluster-set-up-1.png)
2. 打开`虚拟机-设置`,设置 虚拟机-网络连接 为 桥接模式,并勾选`复制物理网络连接状态`,如下：

    ![`虚拟机-设置`](https://xn--i0v668g.com/uploads/images/hadoop-cluster-set-up-2.png)

3. 配置虚拟机网络配置

    1. 修改`/etc/network/interfaces`,配置`iP`,`netmask`,`getway`如下：

        ```xml
        auto lo
        iface lo inet loopback
        //此处需要设置为自己使用的网卡,可通过 ifconfig -a 查看
        auto ens33
        iface ens33 inet static
        address 192.168.1.246
        getway 192.168.1.1
        netmask 255.255.255.0
        ```

    2. 重启网卡,`sudo /etc/init.d/networking restart`

### 设置IP映射

1. 修改`/etc/hosts`,所有节点配置均相同：

   ```xml
   127.0.0.1    localhost
   192.168.1.246    Master
   192.168.1.245    Slave1
   192.168.1.247    Slave2
   ```

## SSH无密码登陆节点

该操作目的为使 Master 节点可以无密码 SSH 登陆到各个 Slave 节点上.

1. 生成 Master 节点的公匙,在 Master 节点的终端中执行

   ```shell
   rm ~/.ssh
   ssh Master
   cd ~/.ssh
   ssh-keygen -t rsa
   ```

2. 让 Master 节点需能无密码 SSH 本机,在 Master 节点上执行

   ```shell
   cat ./id_rsa.pub >> ./authorized_keys
   ```

3. 在 Master 节点将上公匙传输到各 Slave 节点

   > `scp` 是 secure copy 的简写,用于在 Linux 下进行远程拷贝文件,类似于 `cp` 命令,不过 `cp` 只能在本机中拷贝.

   ```shell
   scp ~/.ssh/id_rsa.pub hadoop@Slave1:/home/hadoop/
   scp ~/.ssh/id_rsa.pub hadoop@Slave2:/home/hadoop/
   ```

4. 在各 Slave 节点上,将 `ssh`公匙加入授权

   ```shell
   mkdir ~/.ssh
   cat ~/id_rsa.pub >> ~/.ssh/authorized_keys
   rm ~/id_rsa.pub
   ```

## 配置分布式集群

### Master 节点配置

集群/分布式模式需要修改 `/usr/local/hadoop/etc/hadoop` 中的5个配置文件,更多设置项可点击查看官方说明.

#### `slaves`

```xml
Slave1
Slave2
```

#### `core-site.xml`

```xml
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://Master:9000</value
    </property>
    <property>
        <name>hadoop.tmp.dir</name>
        <value>file:/usr/local/hadoop/tmp</value>
    </property>
</configuration>
```

#### `hdfs-site.xml`

```xml
<configuration>
    <property>
        <name>dfs.namenode.secondary.http-address</name>
        <value>Master:50090</value>
    </property>
    <property>
        <name>dfs.replication</name>
        <value>2</value>
    </property>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>file:/usr/local/hadoop/tmp/dfs/name</value>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>file:/usr/local/hadoop/tmp/dfs/data</value>
    </property>
</configuration>
```

#### `mapred-site.xml`

```xml
t<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
    <property>
        <name>mapreduce.jobhistory.address</name>
        <value>Master:10020</value>
    </property>
    <property>
        <name>mapreduce.jobhistory.webapp.address</name>
        <value>Master:19888</value>
    </property>
</configuration>
```

#### `yarn-site.xml`

```xml
<configuration>
    <property>
        <name>yarn.resourcemanager.hostname</name>
        <value>Master</value>
    </property>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
</configuration>
```

### 其余 Slave 节点配置

配置好后,将 Master 上的 `/usr/local/Hadoop` 文件夹复制到各个节点上.

1. 在 Master 节点上配置

   ```sh
   cd /usr/local
   sudo rm -r ./hadoop/tmp
   sudo rm -r ./hadoop/logs/*
   tar -zcf ~/hadoop.master.tar.gz ./hadoop
   cd ~
   scp ./hadoop.master.tar.gz Slave1:/home/hadoop
   scp ~/hadoop.master.tar.gz Slave2:/home/hadoop
   rm ~/hadoop.master.tar.gz
   ```

2. 在 Slave1 与 Slave2 节点上配置：

   ```sh
   sudo rm -r /usr/local/hadoop
   sudo tar -zxf ~/hadoop.master.tar.gz -C /usr/local
   sudo chown -R hadoop /usr/local/hadoop
   ```

## 启动 Hadoop 集群

1. 首次启动时,需要在 Master 节点执行 `NameNode` 的格式化

   ```shell
   ./bin/hdfs namenode -format
   ```

2. 在 Master 节点启动 Hadoop

   ```shell
   ./sbin/start-dfs.sh
   ./sbin/start-yarn.sh
   ./sbin/mr-jobhistory-daemon.sh start historyserver
   ```

3. 在 Master 节点上通过命令 `hdfs dfsadmin -report` 查看 `DataNode` 是否正常启动,如果 `Live datanodes` 不为 0 ,则说明集群启动成功.

   ![`hdfs dfsadmin -report`](https://xn--i0v668g.com/uploads/images/hadoop-cluster-set-up-4.png)

   也可以通过 Web 页面看到查看 DataNode 和 NameNode 的状态：[http://master:50070/](http://master:50070/).

   ![查看 DataNode 和 NameNode 的状态](https://xn--i0v668g.com/uploads/images/hadoop-cluster-set-up-5.png)

   > 在查看 `DataNode` 时发现,没有 `DataNode`.
   > ![没有 `DataNode`](https://xn--i0v668g.com/uploads/images/hadoop-cluster-set-up-3.png)
   > 原因：每次`namenode forma`t会重新创建一个`namenodeId`,而`tmp/dfs/data`下包含了上次format下的id,`namenode format`清空了`namenode`下的数据,但是没有清空`datanode`下的数据,导致启动时失败.
   > 解决方案：在各节点下删除`./hadoop`下相关文件后,重新进行格式化.

    ```shell
    sudo rm -r tmp
    sudo mkdir tmp
    ./bin/hdfs namenode -format
    ./sbin/start-dfs.sh
    ./sbin/start-yarn.sh
    ./sbin/mr-jobhistory-daemon.sh start historyserver
    ```

## 执行分布式实例

与伪分布式中同样,在 Master 节点上执行相同的命令如下：

```shell
./bin/hdfs dfs -mkdir -p /user/hadoop
./bin/hdfs dfs -mkdir input
./bin/hdfs dfs -put ./etc/hadoop/*.xml input
./bin/hadoop jar ./share/hadoop/mapreduce/hadoop-mapreduce-examples-*.jar wordcount input output 'dfs[a-z.]+'
./bin/hdfs dfs -cat output/*
```

运行结果如下：

![分布式实例运行结果](https://xn--i0v668g.com/uploads/images/hadoop-cluster-set-up-6.png)

关闭 Hadoop 集群也是在 Master 节点上执行的：

```shell
./sbin/stop-yarn.sh
./sbin/stop-dfs.sh
./sbin/mr-jobhistory-daemon.sh stop historyserver
```

> 在执行过程中,遇到如下错误
> ![错误](https://xn--i0v668g.com/uploads/images/hadoop-cluster-set-up-7.png)
> 因为在Ubuntu的虚拟机上搭建的测试环境,分配的内存除了系统开销外远远不够Hadoop的使用,可在各个节点下通过增大虚拟内存或修改`mapred-site.xml`文件如下：
> ![mapred-site.xml](https://xn--i0v668g.com/uploads/images/hadoop-cluster-set-up-8.png)

## 思考

> 假设有100台计算机以以太网的方式相连,但仅有一台机器可以连接互联网.所有的机器都安装了Ubuntu16.04,但缺乏Hadoop集群建设需要的软件.
>
> - 在此基础上搭建一个Hadoop集群（包含一个master和若干slave）有哪些问题需要注意？如何解决这些问题？
> - 这样的解决方案能否适用于1000台计算机的集群搭建？

- 问题1：各个计算机之间的如何进行互相连接？

  因为所有计算机已通过以太网的方式进行连接,所以我们需要解决的问题就是如何使不同的计算机可以通过SSH无密码登录,假设我们已经知道所有Slave节点的IP地址,我们可以先用`ssh-keygen` 在master节点生成rsa的key,再通过Shell脚本的方式将其复制到各Slave节点中,批量添加`rsa_pub`至`authorized_keys`,即可解决各计算机之间互相连接的问题.

- 问题2：如何在多个节点中配置Hadoop环境？

  从上面的配置过程中,我们可以看出,只需要在Master节点中配置好Hadoop相关文件,通过scp命令将配置好的Hadoop文件复制到各Slave节点,即可解决Hadoop的配置问题,这里同样可使用Shell编写脚本,进行Hadoop的解压、环境变量的配置等,实现批量的部署.

  这里对待Jre等环境的配置也是相同的,,可以在Master节点中下载完毕后,打包进行复制,复制后,运行脚本进行解压并完成添加至环境变量等.

- 问题3：大集群如何进行Hadoop的维护？

  那么,这里又存在一个问题,如果要对配置文件进行修改,重新执行上述过程,显然是费时且费力的,我们可以通过git命令对我们修改的文件进行同步.

- 问题4：以上解决方案,是否适用于1000台计算机的集群搭建？

  对于100台计算机组成的节点而言,使用Shell脚本进行部署或许是一种可以接受的解决方法,但对于更多的计算机来说,就可能存在他们之间会有很多的不同的配置,需要我们编写不同的脚本来解决这个问题,并且如果Master节点需要进行更换时,维护映射表也同样难以解决.

  这时候,我们就可以采用一些Hadoop自动化管理系统来解决,如Cloudera、Ambari等,使得

  > 让一切人对机器的操作尽可能的自动化

## 参考文章

- [ubuntu14.04搭建Hadoop2.9.0集群(分布式)环境](https://www.cnblogs.com/VeryGoodVeryGood/p/8508324.html)
- [ubuntu使用桥接模式无法连接网络的问题](https://blog.csdn.net/zhongyoubing/article/details/71081464)
- [解决集群搭建找不到datanode的问题](https://www.cnblogs.com/yoghurt/p/5837353.html?tdsourcetag=s_pctim_aiomsg)
- [使用 Shell 脚本进行 Hadoop Spark 集群的批量安装](https://blog.csdn.net/simple_the_best/article/details/77726114?tdsourcetag=s_pctim_aiomsg)
- [大数据SRE的总结（1）－－部署](https://zhuanlan.zhihu.com/p/31498847?tdsourcetag=s_pctim_aiomsg )