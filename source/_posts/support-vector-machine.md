---
title: 支持向量机
categories: 机器学习
tags: [支持向量机]
date: 2019-04-16 13:06:38
---

在机器学习中，支持向量机（英语：Support Vector Machine，常简称为 SVM，又名支持向量网络）是在分类与回归分析中分析数据的监督式学习模型与相关的学习算法。给定一组训练实例，每个训练实例被标记为属于两个类别中的一个或另一个，SVM训练算法创建一个将新的实例分配给两个类别之一的模型，使其成为非概率二元线性分类器。SVM模型是将实例表示为空间中的点，这样映射就使得单独类别的实例被尽可能宽的明显的间隔分开。然后，将新的实例映射到同一空间，并基于它们落在间隔的哪一侧来预测所属类别。

除了进行线性分类之外，SVM还可以使用所谓的核技巧有效地进行非线性分类，将其输入隐式映射到高维特征空间中。

当数据未被标记时，不能进行监督式学习，需要用非监督式学习，它会尝试找出数据到簇的自然聚类，并将新数据映射到这些已形成的簇。将支持向量机改进的聚类算法被称为支持向量聚类，当数据未被标记或者仅一些数据被标记时，支持向量聚类经常在工业应用中用作分类步骤的预处理。[^1]

<!--more-->

通过上述对于支持向量机的描述，我们给出支持向量机的定义如下：

假设给定一个特征空间上的训练数据集

$$ T = \left\{\left(\vec{x_1},y_1\right), \left(\vec{x_2},y_2\right),\dots,\left(\vec{x_N},y_N\right)\right\} $$

其中，$\vec{x_i} \in \mathcal{X} = R^n, y_i \in \mathcal{Y} =\left\{+1,-1\right\}, i=1,2,\dots,N$，$\vec{x_i}$ 为第 $i$ 个特征向量，也称为实例，$y_i$ 为 $\vec{x_i}$ 的类标记，当 $y_i = +1$时，称 $\vec{x_i}$ 为正例；当 $y_i = -1$时，称 $\vec{x_i}$ 为负例，$\left(\vec{x_i},y_i\right)$ 称为样本点。

学习的目标是在特征空间中找到一个分离超平面，能够将实例分到不同的类。分离超平面对应于方程 $\vec{w}^T \vec{x} + b = 0$，它由法向量 $\vec{w}$ 和截距 $b$ 决定，可用 $\left(\vec{w}, b\right)$表示。分离超平面将特征空间划分为两部分，一部分是正类，另一部分是负类。

## 线性可分支持向量机

![存在多个划分超平面将两类训练样本分开](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/svm-separating-hyperplanes.png)

对于给定的训练数据集 $T$ 和超平面 $(\vec{w},b)$，定义超平面 $(\vec{w},b)$ 关于样本点 $(\vec{x_i}, y_i)$ 的函数间隔为

$$\hat{\gamma_i} = y_i \left( \vec{w}^T \vec{x_i} + b \right)$$

定义超平面 $(\vec{w},b)$ 关于训练数据集 $T$ 的函数间隔为超平面 $(\vec{w},b)$ 关于 $T$ 中所有样本点 $(\vec{x_i}, y_i)$的函数间隔之间的最小值，即

$$\hat{\gamma} = \min_{i=1,\dots,N} \hat{\gamma_i}$$

对于给定的训练数据集 $T$ 和超平面 $(\vec{w},b)$，定义超平面 $(\vec{w},b)$ 关于样本点 $(\vec{x_i}, y_i)$ 的几何间隔为

$$\gamma_i = \frac{y_i \left( \vec{w}^T \vec{x_i} + b \right)}{\left\| \vec{w} \right\|}$$

定义超平面 $(\vec{w},b)$ 关于训练数据集 $T$ 的几何间隔为超平面 $(\vec{w},b)$ 关于 $T$ 中所有样本点 $(\vec{x_i}, y_i)$的几何间隔之间的最小值，即

$$\gamma = \min_{i=1,\dots,N} \gamma_i$$

$$\max\hat{\gamma}, \quad \text{s.t.} \quad y_i \left( \vec{w}^T \vec{x_i} + b \right) \geq \hat{\gamma}, i=1,\dots,N$$

$$\max \frac{1}{2} {\left\| \vec{w} \right\|}^2, \quad \text{s.t.} \quad y_i \left( \vec{w}^T \vec{x_i} + b \right) \geq 1, i=1,\dots,N$$

![支持向量和间隔边界](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/support-vector-and-margin.png)

## 线性支持向量机

## 非线性支持向量机

## 序列最小最优化算法

## 支持向量机的推广

## 附件

- [Slide of Support Vector Machine](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/files/support_vector_machine.pdf)
- [支持向量机通俗导论——理解 SVM 的三重境界](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/files/支持向量机通俗导论.pdf)

[^1]: [https://en.wikipedia.org/wiki/Support-vector_machine](https://en.wikipedia.org/wiki/Support-vector_machine)
