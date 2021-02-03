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
docker network create -d bridge application
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
    --network application \
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
    --network application \
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
    --network application \
    mongo:latest
```

```shell
use admin
db.createUser( { user: "admin", pwd: "my-secret-pw", roles: [ { role: "root", db: "admin" } ] } )
```

### WordPress

```shell
create database wordpress;
create user 'wordpress'@'wordpress.application' identified by 'wordpress';
grant all privileges on wordpress.* to 'wordpress'@'wordpress.application' identified by 'wordpress';
flush privileges;
```

```shell
docker run -detach \
    --name wordpress \
    --restart always \
    --publish 81:80 \
    --network application \
    wordpress:latest
```

### NextCloud

```shell
create database nextcloud;
create user 'nextcloud'@'nextcloud.application' identified by 'nextcloud';
grant all privileges on nextcloud.* to 'nextcloud'@'nextcloud.application' identified by 'nextcloud';
flush privileges;
```

```shell
docker run -detach \
    --name nextcloud \
    --restart always \
    --publish 82:80 \
    --volume /data/nextcloud:/var/www/html \
    --network application \
    nextcloud:latest
```

### Gitea

```shell
create database gitea;
create user 'gitea'@'gitea.application' identified by 'gitea';
grant all privileges on gitea.* to 'gitea'@'gitea.application' identified by 'gitea';
flush privileges;
```

```shell
docker run --detach \
    --name gitea \
    --restart always \
    --publish 83:3000 --publish 84:22 \
    --volume /data/gitea:/data \
    --network application \
    gitea/gitea:latest
```

### NodeBB

```shell
use nodebb
db.createUser( { user: "nodebb", pwd: "nodebb", roles: [ { role: "readWrite", db: "nodebb" }, { role: "clusterMonitor", db: "admin" } ] } )
```

```shell
docker run --detach \
    --name nodebb \
    --restart always \
    --publish 4567:4567 \
    --network application \
    nodebb/docker:latest
```
