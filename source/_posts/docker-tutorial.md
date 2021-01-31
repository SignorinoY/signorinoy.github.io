---
title: Docker 入门指南
categories: 开发者手册
tags: 
date: 2020-09-02 14:58:00
---

Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器或 Windows 机器上，也可以实现虚拟化，容器是完全使用沙箱机制，相互之间不会有任何接口。

<!-- more -->

## 安装

使用官方安装脚本自动安装：

```shell
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

## 实例

### Gitea

```shell
docker run --detach \
    --publish 10080:3000 --publish 10022:22 \
    --name gitea \
    --restart always \
    --volume /srv/gitea:/data \
    gitea/gitea:latest
```

### NodeBB

```shell
docker network create -d bridge app
```

```shell
docker run --detach \
    --publish 4567:4567 \
    --name nodebb \
    --restart always \
    --network app \
    nodebb/docker
```

```shell
docker run --detach \
    --publish 27017:27017 \
    --name mongo \
    --restart always \
    --network app \
    --volume /srv/mongo/data:/data/db \
    mongo
```