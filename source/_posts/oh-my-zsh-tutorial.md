---
title: Oh My Zsh 使用指南
categories: 开发者手册
tags: 
date: 2020-09-02 16:01:02
---

[Oh My Zsh](https://ohmyz.sh/) 是基于 zsh 命令行的一个扩展工具集，提供了丰富的扩展功能。

<!-- more -->

## 安装

```shell
apt-get install zsh
```

```shell
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

```shell
# 国内镜像
sh -c "$(wget -O- https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"
```

## 插件

`zsh-autosuggestions`

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

`zsh-syntax-highlighting`

```shell
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

```diff
- plugins=(git)
+ plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```