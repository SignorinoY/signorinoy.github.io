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

我们通过维护连通分量来实现并查集的操作，Find 就是检查两个元素是否在同一个连通分量中，Union 就是将包含两个元素的连通分量替换为其并集。

我们得到并查集的 API 设计如下：

- 具有巨大的对象数量与操作数量。
- 具有大量的合并与连接查询操作。

|函数名称|函数功能|
|:-:|:-:|
|`UnionFind(int N)`|初始化具有 N 个元素的并查集数据结构|
|`void union(int p, int q)`|在 p 与 q 元素之间添加连接|
|`int find(int p)`|查找 p 的连通向量 id|
|`boolean connected(int p, int q)`|p 和 q 是否存在于同一个连通分量|
|`int count()`|连通向量的数目|

## 算法实现

为实现这份 API，所有的实现都应该：

- 定义一种数据结构表示已知的连接；
- 基于此数据结构实现高效的 API 方法。

因此：

- 我们将元素作为索引的数组 `id[]` 作为基础数据结构表示所有连通分量， 在开始时，每个元素都构成一个仅含有自己的连通分量，因此我们将 `id[i]` 的值初始化为 `i`，其中 $0 \leq i \leq N$。
- `find(p)` 方法返回元素所在的连通分量的 `id`，`connected(p, q)` 方法判断两个元素所在的连通分量 `id` 是否相同（`find(p) == find(q)`），来判断两元素是否存在于同一个连通分量之中。
- `count()` 方法会返回所有连通分量的数量，在开始时，有 N 个连通分量，每次对两个连通分量进行归并操作（`union(p, q)`）时会使分量总数减一。

根据以上思路，实现了 `UnionFind` 的基本结构，如下所示（`find(p)` 与 `union(p, q)` 方法将在其后进行讨论）：

```java
public class UnionFind {
    private int[] id; // 连通分量 id (以元素作为索引)
    private int count; // 连通分量数量

    public class UnionFind(int N) {
        count = N;
        for(int i = 0; i < N; i++) {
            id[i] = i;
        }
    }

    public void union(int p, int q)

    public int find(int p)

    public boolean connected(int p, int q) {
        return find(p) == find(q);
    }

    public int count() {
        return count;
    }
}
```

### quick-find 算法

最简单的一种方法为保证在同一个连通分量中的所有元素在 `id[]` 中的值全部相同，即保证 `id[p]` 等于 `id[q]` 时 p 和 q 是连通的。

也就是说，`connected(p, q)` 只需要判断 `id[p] == id[q]`，因此，`find(p)` 返回元素 p 所在连通分量的索引 `id[p]`。同时，为确保这一点，`union(p, q)` 首先需要检查元素 p 和 q 是否已经存在于同一个分量之中，若是，就不需要采取任何操作，否则，需要将元素 p 和 q 所属的连通分量中的所有元素的 `id[]` 值修改为同一个值，因此，我们可遍历整个数组，将所有和 `id[p]` 相等的元素的值修改为 `id[q]` 的值，归并后，连通分量数目减一。

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

对于 quick-find 算法，`find()` 操作速度是很快的，只需要访问 `id[]` 数组一次，但对于 `union()` 来说，每一次操作都需要扫描整个 `id[]` 数组，因此，该算法无法处理大型问题。

### quick-union 算法

每一个元素所对应的 `id[]` 都是同一个分量中的另一个元素的名称，我们称之为“链接”。

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

### 加权 quick-union 算法

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

[^1]: [https://zh.wikipedia.org/wiki/并查集](https://zh.wikipedia.org/wiki/%E5%B9%B6%E6%9F%A5%E9%9B%86)
