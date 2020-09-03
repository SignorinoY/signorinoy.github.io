---
title: SSH (Secure Shell) 原理与应用
categories: 开发者手册
tags: []
date: 2020-02-20 23:40:45
---

Secure Shell（安全外壳协议，简称 SSH）是一种加密的网络传输协议，可在不安全的网络中为网络服务提供安全的传输环境。SSH 通过在网络中创建安全隧道来实现 SSH 客户端与服务器之间的连接。虽然任何网络服务都可以通过 SSH 实现安全传输，SSH最常见的用途是远程登录系统，人们通常利用 SSH 来传输命令行界面和远程执行命令。[^1]

<!--more-->

## SSH 原理

SSH 使用对称密钥来加密整个连接。与某些用户所假设的相反，可以创建的公/私非对称密钥对仅用于身份验证，而不是加密连接。对称加密允许甚至密码身份验证免受窥探。

## SSH 安装

一般情况下，Linux 操作系统已默认安装了 SSH Client、SSH Server，若需要安装，可以通过 `yum` 或 `apt-get` 进行安装

```sh
# CentOS
yum install -y openssh-clients openssh-server
# Ubuntu
apt-get install -y openssh-clients openssh-server
```

> 现在 Windows 下同样提供了原生的 SSH 服务，可参照 [安装适用于 Windows Server 2019 和 Windows 10 的 OpenSSH](https://docs.microsoft.com/zh-cn/windows-server/administration/openssh/openssh_install_firstuse) 进行安装。

## SSH 口令登录

执行如下命令即可使用 SSH 登陆本地服务器：

```sh
ssh user@localhost
```

## SSH 公钥登录

但这样登陆是需要每次输入密码的，在后面我们有多个服务器需要进行登陆时，重复输入密码往往时一件比较费时费事的事情，所以我们需要配置成 SSH 无密码登陆。

下面以在本地生成 SSH 无密码登陆为例，进行示范，在本地配置多个服务器的 SSH 无密码登陆可类似执行。

首先输入 `exit` 退出刚才的 SSH ，就回到了我们原先的终端窗口，然后利用 `ssh-keygen` 生成密钥，并将密钥加入到授权中：

```sh
exit
cd ~/.ssh/
ssh-keygen -t rsa
cat id_rsa.pub >> authorized_keys
chmod 600 ./authorized_keys
```

[^1]: [The Secure Shell (SSH) Protocol Architecture](https://www.ietf.org/rfc/rfc4251.txt)
