---
title: 并查集
categories: 数据结构
tags: [Coursera, 并查集]
date: 2019-10-02 14:31:05
---

{% note info %}

- 课程名称：Algorithms, Part Ⅰ
- 课程地址：[https://www.coursera.org/learn/algorithms-part1/](https://www.coursera.org/learn/algorithms-part1/)

{% endnote %}

在计算机科学中，并查集是一种树型的数据结构，用于处理一些不交集（Disjoint Sets）的合并及查询问题。由于支持这两种操作，一个不相交集也常被称为联合-查找数据结构（union-find data structure）或合并-查找集合（merge-find set）。[^1]

<!--more-->

## 问题描述

在给定 N 个元素的集合中，使其支持如下两个操作：

- Find：确定元素属于哪一个子集，用来确定两个元素是否属于同一子集。
- Union：将两个子集合并成同一个集合。

## 问题建模

对于连接，从数学上看，是一个“等价”关系。若用 $\equiv$ 表示集合上的连接关系，那么对于该集合中的任意对象 $p$，$q$，$r$，具有如下性质：

- 自反性：$p \equiv p$。
- 对称性：若 $p \equiv q$，则 $q \equiv p$。
- 传递性：若 $p \equiv q$ 且  $q \equiv r$，则 $p \equiv r$。

当我们得到“等价”关系后，一个元素以及其连接的集合所构成的子集就称为连通分量。

- 连通分量：互相连接的元素的最大集合。

连通分量具有如下性质：

- 连通分量中的任意两个元素都是连接的，连通分量中的元素不与连通分量之外的元素相连接。

我们通过维护连通分量来实现并查集的操作，Find 就是检查两个元素是否在同一个连通分量中，Union 就是将包含两个元素的分量替换为其并集。

我们得到并查集的 API 设计如下：

- 具有巨大的对象数量与操作数量。
- 具有大量的合并与连接查询操作。

|函数名称|函数功能|
|:-:|:-:|
|`UnionFind(int N)`|初始化具有 N 个元素的并查集数据结构|
|`void union(int p, int q)`|在 p 与 q 元素之间添加连接|
|`int find(int p)`|查找 p 的连通向量 id|
|`int count()`|连通向量的数目|

```java
public int find(int p) {
    return id[p];
}

public void union(int p, int q) {
    int pId = find(p);
    int qId = find(q);
    if (pId == qId) {
        return;
    }
    for (int i = 0; i < id.length; i++) {
        if (id[i] == pId) {
            id[i] = qId;
        }
    }
    count--;
}
```

```java
public int find(int p) {
    while(p != id[p]) {
        p = id[p];
    }
    return p;
}

public void union(int p, int q) {
    int pRoot = find(p);
    int qRoot = find(q);
    if (pRoot == qRoot) {
        return;
    }
    id[pRoot] = qRoot;
    count--;
}
```

```java
    public int find(int p) {
        while(p != id[p]) {
            p = id[p];
        }
        return p;
    }

    public void union(int p, int q) {
        int i = find(p);
        int j = find(q);
        if (i == j) {
            return;
        }
        if (sz[i] < sz[j]) {
            id[i] = j;
            sz[j] += sz[i];
        } else {
            id[j] = i;
            sz[i] += sz[j];
        }
        count--;
    }
```

[^1]: [https://zh.wikipedia.org/wiki/%E5%B9%B6%E6%9F%A5%E9%9B%86](https://zh.wikipedia.org/wiki/%E5%B9%B6%E6%9F%A5%E9%9B%86)
