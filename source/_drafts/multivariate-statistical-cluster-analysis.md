---
title: 多元统计学习笔记：系统聚类
date: 2018-01-23 12:45:54
tags: [数据挖掘, 聚类分析, 多元统计]
permalink: multivariate-statistical-cluster-analysis
---

聚类分析（英语：Cluster analysis,亦称为群集分析）是对于统计数据分析的一门技术,在许多领域受到广泛应用,包括机器学习,数据挖掘,模式识别,图像分析以及生物信息.聚类是把相似的对象通过静态分类的方法分成不同的组别或者更多的子集（subset）,这样让在同一个子集中的成员对象都有相似的一些属性,常见的包括在坐标系中更加短的空间距离等.
对样本进行分类称为Q型聚类分析,对指标进行分类称为R型聚类分析.
<!-- more -->
# Q型聚类分析
## 样本的相似性度量
可以用距离来度量样本点间的相似程度.对于定量变量,最常用的是闵氏（Minkovski）距离：
> The Minkowski distance of order p between two points
>
> $$X=(x\_{1},x\_{2},\ldots ,x\_{n}){\text{ and }}Y=(y\_{1},y\_{2},\ldots ,y\_{n})\in {\mathbb{R}}^{n}$$
> is defined as:
> 
> $$D(X,Y)=(\sum \_{i=1}^{n}|x\_{i}-y\_{i}|^{p})^{1/p}$$

在Minkovski距离中,最常用的是欧氏距离（$p=2$),它的主要优点是当坐标轴进行正交旋转时,欧氏距离是保持不变的.
**值得注意的是在采用 Minkowski 距离时,一定要采用相同量纲的变量.在采用 Minkowski 距离时,还应尽可能地避免变量的多重相关性（multicollinearity）.多重相关性所造成的信息重叠,会片面强调某些变量的重要性.**
由于 Minkowski 距离的这些缺点,一种改进的距离就是马氏（Mahalanobis）距离：
> The Mahalanobis distance of an observation $\vec x=(x_1,x_2,x_3,\dots,x_N)^T$ from a set of observations with mean $\vec\mu=(\mu_1,\mu_2,\mu_3,\dots,\mu_N)^T$and covariance matrix $S$ is defined as:
> 
> $$D_M(\vec x)=\sqrt{ {(\vec x-\vec\mu)^T}S^{-1}(\vec x-\vec\mu)}$$

马氏距离对一切线性变换是不变的,故不受量纲的影响.

## 类与类间的相似性度量
如果有两个样本类$G1$和$G2$,可以用以下方法：
1. 最短距离法
2. 最长距离法
3. 重心法
4. 类平均法
5. 离差平方和法

## 聚类图
Q型聚类结果可以用一个聚类图展示出来.
> 怎样才能生成这样的聚类图呢？步骤如下：设$Ω={w_1, w_2,\dots,w_7}$,
> 1. 计算n个样本点两两之间的距离$d\_{i,j}$,记为矩阵$D=(d\_{i,j})\_{n*n}$；
> 2. 首先构造n个类,每一个类中只包含一个样本点,每一类的平台高度均为零；
> 3. 合并距离最近的两类为新类,并且以这两类间的距离值作为聚类图中的平台高
度；
> 4. 计算新类与当前各类的距离,若类的个数已经等于1,转入步骤5,否则,回到步骤3；
> 5. 画聚类图；
> 6. 决定类的个数和类.

# R型聚类分析
在实际工作中,为了避免漏掉某些重要因素,往往在一开始选取指标的时候尽可能考虑所有的相关因素,而这样做的结果,则是变量过多,变量间的相关度较高,给统计分析与建模带来极大不便,因此人们希望能够研究变量间的相似关系,按照变量的相似关系把他们聚合成若干类,进而找出影响系统的主要因素,引入了R型聚类方法.
## 变量相似性度量
在对变量进行聚类分析时,首先要确定变量的相似性程度,常用的变量相似性度量有两种：
1. 相关系数
> If we have one dataset $\{x\_1,...,x\_n\}$ containing $n$ values and another dataset $\{y\_1,...,y\_n\}$ containing $n$ values then that formula for $r$ is:
>
> $$r={\frac {\sum \_{i=1}^{n}(x\_{i}-{\bar {x}})(y\_{i}-{\bar {y}})}{\sqrt {\sum \_{i=1}^{n}(x\_{i}-{\bar {x}})^{2}}{\sqrt {\sum \_{i=1}^{n}(y\_{i}-{\bar {y}})^{2}}}}}$$
> where:
> - $n$ is the sample size
> - $x\_{i},y\_{i}$ are the single samples indexed with $i$
> - ${\bar x={\frac{1}{n}}\sum\_{i=1}^{n}x\_{i}}$ (the sample mean); and analogously for $\bar y$
2. 余弦相似性
> The cosine of two non-zero vectors can be derived by using the Euclidean dot product formula:
>
> $${\mathbf {a} \cdot \mathbf {b} =\left\|\mathbf {a} \right\|\left\|\mathbf {b} \right\|\cos \theta }$$
> Given two vectors of attributes, $A$ and $B$, the cosine similarity, $cos(\theta)$, is represented using a dot product and magnitude as
>
> $${\text{similarity}=\cos(\theta)={A\cdot B \over \|A\|\|B\|}={\frac {\sum \limits \_{i=1}^{n}{A\_{i}\times B\_{i}}}{\sqrt {\sum \limits \_{i=1}^{n}{(A\_{i})^{2}}}\times {\sqrt {\sum \limits \_{i=1}^{n}{(B\_{i})^{2}}}}}}}$$
>  where ${A\_{i}}$ and ${B\_{i}}$ are components of vector $A$ and $B$ respectively.
>  The resulting similarity ranges from −1 meaning exactly opposite, to 1 meaning exactly the same, with 0 indicating orthogonality (decorrelation), and in-between values indicating intermediate similarity or dissimilarity.

## 变量聚类法
类似于样本集合聚类分析中最常用的最短距离法、最长距离法等,变量聚类法采用了与系统聚类法相同的思路和过程.在变量聚类问题中,常用的有最大系数法、最小系数法等.

# Matlab聚类分析的相关命令
1. `pdist` 生成两两对象之间的距离
2. `linkage` 生成具有层次结构的聚类树
3. `cluster` 根据聚类树创建聚类
4. `zscore` 对数据矩阵进行标准化处理
5. `dendrogram` 根据聚类数画出聚类树状图
6. `clusterdara` pdist,linkage,cluster的综合
7. `squareform` 将`pdist`的输出转换为方阵

# 练习
## 问题重述
> 表 33 是 1999 年中国省、自治区的城市规模结构特征的一些数据,试通过聚类分析将这些省、自治区进行分类.
>![表33：城市规模结构特征数据](https://xn--i0v668g.com/images/matlab_ex10_1_1.png)

## 模型求解（简要）
``` matlab
clc,clear
data = load('data.txt');%读入数据
str = fopen('str.txt');%读入省名
str = textscan(str,'%s');
str = str{:};
data  = zscore(data);%标准化
distance = pdist(data);%计算两两之间欧氏距离
z = linkage(distance);%按照最短距离生成具有层次结构的聚类树
dendrogram(z,'label',str,'Orientation','right','ColorThreshold','default')%画出聚类图
```
![城市规模结构特征聚类图](https://xn--i0v668g.com/images/matlab_ex10_1_2.png)
从图中可以看出,苏沪、京津冀、青海各自成一类,其余省、自治区成一类.