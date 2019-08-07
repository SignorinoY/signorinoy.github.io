---
title: R语言学习笔记：数组
tags: [R]
date: 2018-09-30 14:22:01
permalink: r-array
---
数组（array）与矩阵类似,是矩阵的一个自然推广,但是维度可以大于2.

- 它们在编写新的统计方法时可能很有用
- 像矩阵一样,数组中的数据也只能拥有一种模式
- 从数组中选取元素的方式与矩阵相同
- 矩阵和数组在R中扮演主要角色,向量化运算,提高计算速度.

<!-- more -->

## 数组的创建

数组可通过`array()`函数创建,形式如下：

```r
myarray <- array(vector, dimensions, dimnames)
```

- vector包含了数组中的数据
- dimensions是一个数值型向量,给出了各个维度下标的最大值
- dimnames是可选的、各维度名称标签的列表

```r
dim1 <- c("A1", "A2")
dim2 <- c("B1", "B2", "B3")
dim3 <- c("C1", "C2", "C3", "C4")
z <- array(1:24, c(2, 3, 4), dimnames=list(dim1, dim2, dim3))
z
```

```r
, , C1

   B1 B2 B3
A1  1  3  5
A2  2  4  6

, , C2

   B1 B2 B3
A1  7  9 11
A2  8 10 12

, , C3

   B1 B2 B3
A1 13 15 17
A2 14 16 18

, , C4

   B1 B2 B3
A1 19 21 23
A2 20 22 24
```