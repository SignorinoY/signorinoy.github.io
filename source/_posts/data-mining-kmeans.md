---
title: 数据挖掘学习笔记：K-均值聚类
date: 2019-03-04 19:37:05
tags: [数据挖掘, 聚类分析, Python]
permalink: data-mining-kmeans
---

k-平均算法（英文：k-means clustering）源于信号处理中的一种向量量化方法,现在则更多地作为一种聚类分析方法流行于数据挖掘领域.k-平均聚类的目的是：把 $n$个点（可以是样本的一次观察或一个实例）划分到$k$个聚类中,使得每个点都属于离他最近的均值（此即聚类中心）对应的聚类,以之作为聚类的标准.这个问题将归结为一个把数据空间划分为Voronoi cells的问题.
<!--more-->

## 原理

1. 选定 K 个中心 $\mu_k$ 的初值.这个过程通常是针对具体的问题有一些启发式的选取方法,或者大多数情况下采用随机选取的办法.因为k-means 并不能保证全局最优,而是否能收敛到全局最优解其实和初值的选取有很大的关系,所以有时候我们会多次选取初值跑 k-means ,并取其中最好的一次结果.
2. 将每个数据点归类到离它最近的那个中心点所代表的 cluster 中.
3. 用公式 $\mu_k = \frac{1}{N_k}\sum_{j\in\text{cluster}_k}x_j$ 计算出每个 cluster 的新的中心点.
4. 重复第二步,一直到迭代了最大的步数或者前后的 $J$ 的值相差小于一个阈值为止.

## 优缺点

- 优点：
  - 原理简单
  - 速度快
  - 对大数据集有比较好的伸缩性
- 缺点：
  - 计算量大
  - 聚类数量K需要提前设定,并影响聚类效果(先验、基于变化的算法、基于结构的算法、基于一致性矩阵的算法、基于层次的算法、基于采样的算法）
  - 聚类中心需要人为初始化,并影响聚类效果（...)
  - 异常点的存在,会影响聚类效果
  - 只能收敛到局部最优

## 实例

在K-Means算法运行前,有两个因素比较重要：数据预处理和距离度量方法.因本文所采用的数据为百分比,故不需要进行数据标准化.

本文选用一个二维数据集——68个国家的出生率（%）及死亡率（%）.

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
```

```python
data = pd.read_csv('birth.csv', names=['Country', 'Birth', 'Death'])
data.head()
```

||Country|Birth|Death|
|:-:|:-:|:-:|:-:|
|0|ALGERIA|36.4|14.6|
|1|CONGO|37.3|8.0|
|2|EGYPT|42.1|15.3|
|3|GHANA|55.8|25.6|
|4|IVORY COAST|56.1|33.1|

```python
data.describe()
```

||Birth|Death|
|:-:|:-:|:-:|
|count|68.000000|68.000000|
|mean|29.310294|10.386765|
|std|11.766359|4.798909|
|min|13.100000|3.900000|
|25%|18.875000|7.800000|
|50%|25.150000|9.150000|
|75%|40.425000|11.725000|
|max|56.100000|33.100000|

使用图形方式对数据进行展示：

```python
plt.scatter(data.iloc[:,1], data.iloc[:,2])
plt.xlabel('Birth')
plt.ylabel('Death')
selected_countries = ['CHINA', 'TAIWAN', 'HONG KONG', 'UNITED STATES', 'JAPAN'] # 创建 selected_countries list,并选择部分国家
max_birth_country_index = data[data.Birth == max(data.Birth)].index[0] #获取出生率最大的行的索引值
selected_countries.append(data.iloc[max_birth_country_index]['Country']) #获取出生率最大的国家名并插入 selected_countries list
# 标记选择的国家
for i in range(len(selected_countries)):
    t = data[data.Country == selected_countries[i]]
    plt.scatter(t['Birth'],t['Death'], color='red')
    plt.annotate(s=selected_countries[i], xy=(t['Birth'],t['Death']), xycoords='data', xytext=(+5, -5),textcoords='offset points')
plt.show()
```

![png](https://xn--i0v668g.com/uploads/images/data-mining-kmeans-1.png)

使用`sklearn.cluster`中的`KMeans`函数进行K-均值聚类

```python
from sklearn.cluster import KMeans
```

首先尝试将样本点聚为较少类别（`n_clusters = 3`),其他参数取默认值来对 data 进行聚类.

```python
X = data.iloc[:,1:]
n_clusters = 3
kmeans = KMeans(n_clusters=n_clusters).fit(X) # 聚类
```

```python
centroids = kmeans.cluster_centers_  # 获取聚类中心
print(centroids)
```

    [[40.50740741 10.81111111]
     [20.19230769  9.12051282]
     [55.95       29.35      ]]

通过 `cluster_centers_` 查看各类别的中心点坐标,分别为$(40.50740741,10.81111111),(20.19230769,9.12051282),(55.95,29.35)$,即第一类可认为是中等出生率、低死亡率,第二类为低出生率、低死亡率,第三类为高出生率、高死亡率.

```python
label_pred = kmeans.labels_ # 获取聚类标签
result = []
for i in range(n_clusters):
    result.append([w for w in data['Country'] if label_pred[data[data.Country == w].index[0]] == i])
print(result)
```

    [['ALGERIA', 'CONGO', 'EGYPT', 'MALAGASY', 'MOROCCO', 'TUNISIA', 'CAMBODIA', 'CEYLON', 'CHINA', 'TAIWAN', 'HONG KONG', 'JORDAN', 'MALAYSIA', 'MONGOLIA', 'THAILAND', 'COSTA RICA', 'DOMINICAN R', 'GUATEMALA', 'HONDURAS', 'MEXICO', 'NICARAGUA', 'PANAMA', 'BRAZIL', 'CHILE', 'COLOMBIA', 'ECUADOR', 'VENEZUELA'], ['INDIA', 'INDONESIA', 'IRAQ', 'JAPAN', 'KOREA', 'PHILLIPINES', 'SYRIA', 'VIETNAM', 'CANADA', 'UNITED STATES', 'ARGENTINA', 'BOLIVIA', 'PERU', 'URUGUAY', 'AUSTRIA', 'BELGIUM', 'BRITAIN', 'BULGARIA', 'CZECHOSLOVAKIA', 'DENMARK', 'FINLAND', 'E.GERMANY', 'W.GERMANY', 'GREECE', 'HUNGARY', 'IRELAND', 'ITALY', 'NETHERLANDS', 'NORWAY', 'POLAND', 'PORTUGAL', 'ROMANIA', 'SPAIN', 'SWEDEN', 'SWITZERLAND', 'U.S.S.R.', 'YUGOSLAVIA', 'AUSTRALIA', 'NEW ZEALAND'], ['GHANA', 'IVORY COAST']]

使用`labels_`来查看不同国家属于哪一类.

```python
kmeans.inertia_ # 样本距其最近的聚类中心的平方距离之和,即组内平方和的总和
```

    1985.4864672364674

```python
x_mean = np.array(X.mean())
sa = 0
for i in range(n_clusters):
    sa = sa + len(result[i]) * np.linalg.norm(centroids[i] - x_mean)**2
sa # 计算组间平方和
```

    8833.454415116477

计算组间平方和与组内平方和,可用于对不同类别取值的聚类结果进行比较,从而找出最有聚类结果.

```python
plt.scatter(data.iloc[:,1], data.iloc[:,2],c=kmeans.labels_)
plt.xlabel('Birth')
plt.ylabel('Death')
# 标注中心点
for (i, j) in centroids:
     plt.plot(i, j, 'r*')
plt.show()
```

![png](https://xn--i0v668g.com/uploads/images/data-mining-kmeans-2.png)

将聚类结果绘图,并以红色五角星标注出中心点.

通过改变聚类组数,并通过组间平方和占总平方和的百分比值（聚合优度）,来进行比较,从而得出最优类别数.

```python
n = []
goodness = []
for k in range(len(X)):
    n_clusters = k+1
    kmeans = KMeans(n_clusters=n_clusters).fit(X)
    x_mean = np.array(X.mean())
    sa = 0
    result = []
    centroids = kmeans.cluster_centers_
    label_pred = kmeans.labels_ # 获取聚类标签
    for i in range(n_clusters):
        result.append([w for w in data['Country'] if label_pred[data[data.Country == w].index[0]] == i])
    for i in range(n_clusters):
        sa = sa + len(result[i]) * np.linalg.norm(centroids[i] - x_mean)**2
    n.append(n_clusters)
    goodness.append(sa/(kmeans.inertia_+sa))
```

```python
goodness = [round(w,2) for w in goodness]
print(goodness)
```

    [0.0, 0.72, 0.82, 0.88, 0.91, 0.93, 0.94, 0.95, 0.96, 0.96, 0.97, 0.97, 0.97, 0.98, 0.98, 0.98, 0.98, 0.98, 0.98, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]

```python
plt.plot(n, goodness,'.')
plt.plot(n[9],goodness[9],'ro')
plt.annotate(s=(n[9],goodness[9]), xy=(n[9],goodness[9]), xycoords='data', xytext=(+5, -10),textcoords='offset points')
plt.xlabel('Number of Cluster')
plt.ylabel('Goodness')
plt.show()
```

![png](https://xn--i0v668g.com/uploads/images/data-mining-kmeans-3.png)

由以上结果可以看出,在类别数小于10时,随着类别数的增加聚类效果越来越好,但当类别数超过10以后时,聚类效果基本不再提高.因此,不妨取10为最优类别数,在实际选择过程中,若无极高的聚类效果要求,可选择较小的类别数.

```python
n_clusters = 10
kmeans = KMeans(n_clusters=n_clusters).fit(X)
```

```python
centroids = kmeans.cluster_centers_  # 获取聚类中心
print(centroids)
```

    [[18.17777778 11.31111111]
     [36.66       11.32      ]
     [55.95       29.35      ]
     [44.04285714 16.25714286]
     [21.58571429  8.24285714]
     [15.97777778  8.03333333]
     [26.71666667  7.73333333]
     [34.68571429  7.25714286]
     [17.6        19.8       ]
     [44.9125      8.8375    ]]

```python
label_pred = kmeans.labels_ # 获取聚类标签
result = []
for i in range(n_clusters):
    result.append([w for w in data['Country'] if label_pred[data[data.Country == w].index[0]] == i])
print(result)
```

    [['AUSTRIA', 'BELGIUM', 'BRITAIN', 'FINLAND', 'E.GERMANY', 'W.GERMANY', 'ITALY', 'NORWAY', 'SWITZERLAND'], ['ALGERIA', 'CHINA', 'MONGOLIA', 'PANAMA', 'CHILE'], ['GHANA', 'IVORY COAST'], ['EGYPT', 'MALAGASY', 'MOROCCO', 'CAMBODIA', 'GUATEMALA', 'BRAZIL', 'ECUADOR'], ['INDIA', 'IRAQ', 'VIETNAM', 'UNITED STATES', 'ARGENTINA', 'URUGUAY', 'IRELAND', 'NETHERLANDS', 'POLAND', 'PORTUGAL', 'SPAIN', 'U.S.S.R.', 'YUGOSLAVIA', 'AUSTRALIA'], ['JAPAN', 'KOREA', 'BOLIVIA', 'BULGARIA', 'CZECHOSLOVAKIA', 'GREECE', 'HUNGARY', 'ROMANIA', 'SWEDEN'], ['INDONESIA', 'PHILLIPINES', 'SYRIA', 'CANADA', 'PERU', 'NEW ZEALAND'], ['CONGO', 'CEYLON', 'TAIWAN', 'HONG KONG', 'MALAYSIA', 'THAILAND', 'DOMINICAN R'], ['DENMARK'], ['TUNISIA', 'JORDAN', 'COSTA RICA', 'HONDURAS', 'MEXICO', 'NICARAGUA', 'COLOMBIA', 'VENEZUELA']]

```python
plt.scatter(data.iloc[:,1], data.iloc[:,2],c=kmeans.labels_)
plt.xlabel('Birth')
plt.ylabel('Death')
# 标注中心点
for (i, j) in centroids:
     plt.plot(i, j, 'r*')
plt.show()
```

![png](https://xn--i0v668g.com/uploads/images/data-mining-kmeans-4.png)