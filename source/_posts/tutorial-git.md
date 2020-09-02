---
title: Git 使用指南
categories: 折腾
tags: []
date: 2019-09-28 13:41:14
---

{% note info %}

- 课程名称： 用 Git 进行版本控制
- 课程地址： [https://classroom.udacity.com/courses/ud123](https://classroom.udacity.com/courses/ud123)

{% endnote %}

版本控制系统的主要目的是帮助你保留项目的详细历史记录，并且能够在不同的版本上进行工作。保留详细的项目历史记录很重要，因为这样可以看出一段时间内项目的进度。如果需要，你还可以回到项目的某个阶段，并恢复数据或文件。

版本控制系统模型包括两大主要类型：

- 集中式模型---所有用户都连接到一个中央的主仓库 (master repository)
- 分布式模型---每个用户都在自己的计算机上拥有完整的仓库

<!--more-->

## 相关术语

- 版本控制系统 / 源代码管理器： 版本控制系统 (简称 VCS) 是一个管理源代码不同版本的工具。源代码管理器 (简称 SCM) 是版本控制系统的另一个名称。
- 提交 (Commit) ： Git 将数据看做微型文件系统的一组快照。每次 commit (在 Git 中保持项目状态) ，它都对文件当时的状况拍照，并存储对该快照的引用。你可以将其看做游戏中的保存点，它会保存项目的文件和关于文件的所有信息。在 Git 中的所有操作都是帮助你进行 commit，因此 commit 是 Git 中的基本单位。
- 仓库 (Repository / repo) ： 仓库是一个包含项目内容以及几个文件 (在 Mac OS X 上默认地处于隐藏状态) 的目录，用来与 Git 进行通信。仓库可以存储在本地，或作为远程副本存储在其他计算机上。仓库是由 commit 构成的。
- 工作目录 / 工作区 (Working Directory) ： 工作目录是你在计算机的文件系统中看到的文件。当你在代码编辑器中打开项目文件时，你是在工作目录中处理文件。与这些文件形成对比的是保持在仓库中 (在 commit 中！) 的文件。在使用 Git 时，工作目录与命令行工具的 current working directory  (当前工作目录) 不一样，后者是 shell 当前正在查看的目录。
- 检出 (Checkout) ： 检出是指将仓库中的内容复制到工作目录下。
- 暂存区 / 暂存索引 / 索引 (Staging Area / Staging Index / Index) ： Git 目录下的一个文件，存储的是即将进入下个 commit 内容的信息。可以将暂存区看做准备工作台，Git 将在此区域获取下个 commit。暂存索引中的文件是准备添加到仓库中的文件。
- SHA： SHA 是每个 commit 的 ID 编号。以下是 commit 的 SHA 示例： e2adf8ae3e2e4ed40add75cc44cf9d0a869afeb6。它是一个长 40 个字符的字符串 (由 0–9 和 a–f 组成) ，并根据 Git 中的文件或目录结构的内容计算得出。SHA 的全称是"Secure Hash Algorithm" (安全哈希算法) 。
- 分支 (Branch) ： 分支是从主开发流程中分支出来的新的开发流程。这种分支开发流程可以在不更改主流程的情况下继续延伸下去。

## Git 的一般工作流程

1. 在工作目录中修改某些文件。
2. 对修改后的文件进行快照，然后保存到暂存区域。
3. 提交更新，将保存在暂存区域的文件快照永久转储到 Git 目录中。

## Windows 下 Git 的安装

1. 转到[https://git-scm.com/downloads](https://git-scm.com/downloads)
2. 下载 Windows 版软件
3. 安装 Git 并选择所有默认选项

## 初次运行 Git 前的配置

第一个要配置的是你个人的用户名称和电子邮件地址。这两条配置很重要，每次 Git 提交时都会引用这两条信息，说明是谁提交了更新，所以会随更新内容一起被永久纳入历史记录：

```shell
# 设置你的 Git 用户名
git config --global user.name "<Your-Full-Name>"
# 设置你的 Git 邮箱
git config --global user.email "<your-email-address>"
```

可选配置项：

```shell
# 确保 Git 输出内容带有颜色标记
git config --global color.ui auto
# 对比显示原始状态
git config --global merge.conflictstyle diff3
# 配置 Git 文本编辑器为 VS Code
git config --global core.editor "code --wait"
```

要检查已有的配置信息，可以使用 git config --list 命令：

```shell
git config --list
```

## 取得项目的 Git 仓库

### 在工作目录中初始化新仓库

要对现有的某个项目开始用 Git 管理，只需到此项目所在的目录，执行：

```shell
git init
```

初始化后，在当前目录下会出现一个名为 `.git` 的目录，所有 Git 需要的数据和资源都存放在这个目录中。

### 从现有仓库克隆

如果你想获得一份已经存在了的 Git 仓库的拷贝，比如说，你想为某个开源项目贡献自己的一份力，这时就要用到 `git clone` 命令。

克隆仓库的命令格式是 `git clone [url]`， 比如，要克隆 Git 的可链接库 libgit2，可以用下面的命令：

```shell
git clone https://github.com/libgit2/libgit2
```

这会在当前目录下创建一个名为 “libgit2” 的目录，并在这个目录下初始化一个 `.git` 文件夹，从远程仓库拉取下所有数据放入 `.git` 文件夹，然后从中读取最新版本的文件的拷贝。

## 记录每次更新到仓库

![文件的状态变化周期](https://xn--i0v668g.com/uploads/images/udacity-version-control-with-git-lifecycle.png)

### 判断仓库当前的状态

要查看哪些文件处于什么状态，可以用 `git status` 命令。 如果在克隆仓库后立即使用此命令，会看到类似这样的输出：

```shell
On branch master
Your branch is up-to-date with 'origin/master'.
nothing to commit，working directory clean
```

现在，让我们在项目下创建一个新的 README 文件。 如果之前并不存在这个文件，使用 `git status` 命令，你将看到一个新的未跟踪文件：

```shell
On branch master
Untracked files:
  (use "git add <file>..." to include in what will be committed)

    README

nothing added to commit but untracked files present (use "git add" to track)
```

### 跟踪新文件

使用命令 `git add` 开始跟踪一个文件。 所以，要跟踪 README 文件，运行：

```shell
git add README
```

此时再运行 `git status` 命令，会看到 README 文件已被跟踪，并处于暂存状态：

```shell
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
```

`git add` 命令可接受多个文件名 (用空格分隔)，此外，可以使用句点 `.` 来代替文件列表，告诉 git 添加当前目录至暂存区 (以及所有嵌套文件)。

## 查看提交历史

在提交了若干更新，又或者克隆了某个项目之后，你也许想回顾下提交历史。 完成这个任务最简单而又有效的工具是 `git log` 命令。

默认不用任何参数的话，`git log` 会按提交时间列出所有的更新，最近的更新排在最上面。 正如你所看到的，这个命令会列出每个提交的 SHA-1 校验和、作者的名字和电子邮件地址、提交时间以及提交说明。

```shell
commit 6f04ddd1fb41934c52e290bc937e45f9cd5949aa
Author: Richard Kalehoff <richardkalehoff@gmail.com>
Date:   Mon Dec 5 16:30:40 2016 -0500

    Add breakpoint for large-sized screens
```

> 在 Git 中使用 less 程序作为其分页器，可阅读 [less](https://en.wikipedia.org/wiki/Less_(Unix)) 查阅其使用说明。

`git log` 命令有一个选项，可以用来更改仓库信息的显示方式。该选项为 `--oneline`：

```shell
git log --oneline
```

`--oneline` 将每个提交放在一行显示，显示 commit 的 SHA 的前 7 个字符及消息，对查看的提交数很大时非常有用。

```shell
6f04ddd Add breakpoint for large-sized screens
50d835d Add breakpoint for medium-sized screens
0768f3d Add space around page edge
f9720a9 Style page header
8aa6668 Convert social links from text to images
```

`--stat` 选项在每次提交的下面列出所有被修改过的文件、有多少文件被修改了以及被修改过的文件的哪些行被移除或是添加了。

```shell
git log --stat
```

```shell
commit 6f04ddd1fb41934c52e290bc937e45f9cd5949aa
Author: Richard Kalehoff <richardkalehoff@gmail.com>
Date:   Mon Dec 5 16:30:40 2016 -0500

    Add breakpoint for large-sized screens

 css/app.css |  31 ++++++++++++++++
 index.html  | 118 ++++++++++++++++++++++++++++++------------------------------
 2 files changed, 91 insertions(+), 58 deletions(-)
```

`--patch` 用来显示对文件作出实际更改，可以简写为 `-p`：

```shell
git log -p
```

```shell
commit a3dc99a197c66ccb87e3f4905502a6c6eddd15b1 (HEAD -> master, origin/master, origin/HEAD)
Author: Richard Kalehoff <richardkalehoff@gmail.com>
Date:   Mon Dec 5 16:34:15 2016 -0500

    Center content on page

diff --git a/css/app.css b/css/app.css
index 07c36fa..3cbd0b8 100644
--- a/css/app.css
+++ b/css/app.css
@@ -38,6 +38,11 @@ p {
     line-height: 1.5;
 }

+.container {
+    margin: auto;
+    max-width: 1300px;
+    max-width: 1300px;
+}
+

 /*** Header Styling ***/
 .page-header {
```

> 补丁输出显示所有行先被删掉，然后在新的缩进位置又被重新添加。但是显示所有的缩进更改让我们很难发现实际添加了什么代码。 `git log -p -w` 将会忽略空格更改。

可以向所有这些命令提供 commit 的 SHA 作为最后一个参数。如：

```shell
git log -p fdf5493
```

通过提供 SHA，`git log -p` 命令将从这条 commit 开始。
