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

```shell
docker network create -d bridge web
```

### MySql/ MariaDB

```shell
docker run --detach \
    --name mysql \
    --restart always \
    --publish 3306:3306 \
    --volume /data/mysql/conf:/etc/mysql \
    --volume /data/mysql/logs:/var/log/mysql \
    --volume /data/mysql/data:/var/lib/mysql \
    --network web \
    -e MYSQL_ROOT_PASSWORD=my-secret-pw \
    mysql:latest
```

```shell
docker run --detach \
    --name mariadb \
    --restart always \
    --publish 3306:3306 \
    --volume /data/mysql/conf:/etc/mysql \
    --volume /data/mysql/logs:/var/log/mysql \
    --volume /data/mysql/data:/var/lib/mysql \
    --network web \
    -e MYSQL_ROOT_PASSWORD=my-secret-pw \
    mariadb:latest
```

### MongoDB

```shell
docker run --detach \
    --name mongo \
    --restart always \
    --publish 27017:27017 \
    --volume /data/mongo/data:/data/db \
    --network web \
    mongo:latest
```

### WordPress

```shell
docker run -detach \
    --name wordpress \
    --restart always \
    --publish 8000:80 \
    --network web \
    wordpress:latest
```

### NextCloud

```shell
docker run -detach \
    --name nextcloud \
    --restart always \
    --publish 8001:80 \
    --volume /data/nextcloud:/var/www/html \
    --network web \
    nextcloud:latest
```

### Gitea

```shell
docker run --detach \
    --name gitea \
    --restart always \
    --publish 8002:3000 --publish 8003:22 \
    --volume /data/gitea:/data \
    --network web \
    gitea/gitea:latest
```

### NodeBB

```shell
docker exec -it mongo bash
```

```shell
mongo
```

```shell
use admin
db.createUser( { user: "admin", pwd: "my-secret-pw", roles: [ { role: "root", db: "admin" } ] } )
```

```shell
use nodebb
db.createUser( { user: "nodebb", pwd: "nodebb", roles: [ { role: "readWrite", db: "nodebb" }, { role: "clusterMonitor", db: "admin" } ] } )
```

```shell
quit()
```

```shell
docker run --detach \
    --name nodebb \
    --restart always \
    --publish 4567:4567 \
    --network web \
    nodebb/docker:latest
```
