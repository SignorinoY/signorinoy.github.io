---
title: 神经网络
categories: 机器学习
tags: [神经网络]
date: 2020-04-16 21:41:33
---

无论是线性回归还是逻辑回归都有这样一个缺点，即：当特征太多时，计算的负荷会非常大。普通的模型无法有效处理这么多的特征，这时候我们需要神经网络。

神经网络是由具有适应性的简单单元组成的广泛并行互连的网络，它的组织能够模拟生物神经系统对真实世界物体所作出的交互反应。

<!--more-->

## 神经元模型

神经网络中最基本的成分是神经元（neuron）模型，即上述定义中的“简单单元”。类似于生物神经网络，每个神经元接受来自其他神经元的信号改变自身的激活状态，将上述过程抽象为如下的“ M-P 神经元模型”。

![M-P神经元模型](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/mp-neuron-model.svg)

神经元接受来自 n 个其他神经元传递过来的输入信号，这些输入信号通过带权重的连接进行传递，神经元接受到的总输入值将与神经元的阈值 $\theta$ 进行比较，然后通过“激活函数”处理以产生神经元的输出。

{% note %}

理想中的激活函数是阶跃函数，它将输入值映射为输出值“0”或“1”。然而，阶跃函数具有不连续、不光滑等不太好的性质，因此实际常用 Sigmoid 函数作为激活函数，Sigmoid 函数能把可能在较大范围内变化的输入值挤压到 $(0,1)$ 输出值范围内，因此有时也被称为“挤压函数”。

{% endnote %}

{% note primary %}

若使用线性函数 $f\left(\boldsymbol{x}\right)=\boldsymbol{w}^T\boldsymbol{x}$ 用作神经元激活函数有什么缺陷么？

使用线性函数作为激活函数时，无论是在隐藏层还是在输出层（无论传递几层），其单元值（在使用激活函数之前）都还是输入 $x$ 的线性组合，这个时候的神经网络其实等价于逻辑回归的，若输出层也使用线性函数作为激活函数，那么就等价于线性回归。

{% endnote %}

阈值 $\theta$ 可看作一个固定输入为 -1.0 的“哑节点”所对应的连接权重 $w_{n+1}$，这样权重和阈值的学习就可统一为权重的学习。

把许多个这样的神经元按一定的层次结构连接起来，就得到了神经网络。

## 感知机与多层网络

### 感知机模型

感知机（Perceptron）由两层神经元组成，输入层接收外界输入信号后传递给输出层，输出层是“M-P神经元”，亦称“阈值逻辑单元”（threshold logic unit）。感知机模型的公式可表示为：

$$
\hat{y}=f\left(\boldsymbol{w}^T\boldsymbol{x}\right)
$$

其中，$y_i\in\{0,1\}$ 为感知机模型的输出；$\boldsymbol{x}\in\mathbb{R}^{n+1}(\boldsymbol{x}_{n+1}\equiv-1)$ 为样本的特征向量，是感知机模型的输入；$\boldsymbol{w}\in\mathbb{R}^{n+1}$ 为感知机模型的权重。

感知机能容易地实现与、或、非运算。

|运算|$w_1$|$w_2$|$\theta$|
|:-:|:-:|:-:|:-:|
|与|1|1|2|
|或|1|1|0.5|
|非|-0.6||-0.5|

更一般地，给定训练数据集，权重 $w_i,(i=1,2,\dots,n+1)$ 可通过学习得到， 感知机的学习规则较为简单，对训练数据 $D=\{(\boldsymbol{x_1},y_1),(\boldsymbol{x_2},y_2),\ldots,(\boldsymbol{x_n},y_n)\}$，感知机的学习目标是求得对数据中的正负样本能够完全正确划分的超平面：

$$
\boldsymbol{w}^T\boldsymbol{x}=0
$$

给定损失函数：

$$
L(\boldsymbol{w})=\sum_{i=1}^n(\hat{y}_i-y_i)\boldsymbol{w}^T\boldsymbol{x_i}=\sum_{i=1}^n\sum_{j=1}^{n+1}w_jx_{i,j}(\hat{y}_i-y_i)
$$

基于梯度下降法，以目标的负梯度方向对参数 $\boldsymbol{w}$ 进行调整，给定学习率 $\eta\in(0,1)$，有：

$$
\Delta w_i=-\eta\frac{\partial L(\boldsymbol{w})}{\partial w_i}=-\eta\sum_{j=1}^n(\hat{y}_j-y_j)x_{j,i}=\eta\sum_{j=1}^n(y_j-\hat{y}_j)x_{j,i}
$$

因此，感知机权重调整公式为：

$$
w_i\leftarrow w_i+\Delta w_i,\Delta w_i=\eta\sum_{j=1}^n(y_j-\hat{y}_j)x_{j,i}
$$

其中 $\eta\in(0,1)$ 称为学习率，感知机将根据错误的程度对权重进行调整，直至收敛为止。

### 多层前馈神经网络

感知机只有输出层神经元进行激活函数处理，即只拥有一层功能神经元，其学习能力非常有限，仅能处理线性可分问题。若为非线性可分问题（如“异或”问题），感知机在学习过程中将发生振荡，$\boldsymbol{w}=(w_1;w_2;\dots;w_n;w_{n+1})$ 无法稳定下来，不能求得合适解。

为解决该问题，考虑使用多层功能神经元。例如，在输出层与输入层之间增加一层神经元，被称为隐层或隐含层，隐含层和输出层神经元都是拥有激活函数的功能神经元。

一般的，常见的神经网络是如下所示的层级结构，每层神经元与下一次神经元全互连，神经元之间不存在同层连接，也不存在跨层连接。这样的神经网络结构通常称为“多层前馈神经网络”，其中输入层神经元接收外界输入，隐层（可包含多层）与输出层神经元对信号进行加工，最终结果由输出层神经元输出。

![多层前馈神经网络结构示意图](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/multi-layer-feedforward-neural-networks.svg)

## 误差逆传播算法

误差逆传播算法（error BackPropagation）算法时迄今最为成功的神经网络学习算法，BP 算法不仅可用于多层前馈神经网络，还可同于其他类型的神经网络，例如训练递归神经网络。为方便讨论，给出如下定义：

|符号|描述|
|:-:|:-:|
|$\boldsymbol{x}$|输入向量|
|$\boldsymbol{y}$|目标向量|
|$C$|误差函数|
|$L$|网络层数|
|$\boldsymbol{W^l}=(w_{jk}^l)$|$l-1$ 层至 $l$ 层的权重，$w_{jk}^l$ 为 $l-1$ 层第 $k$ 个节点与 $l$ 层第 $j$ 个节点之间的权重|
|$\boldsymbol{b^l}=(b_k)$|$l-1$ 层至 $l$ 层的阈值，$b_k$ 为 $l$ 层第 $k$ 个节点的阈值|
|$f^l$|$l$ 层的激活函数|

因此，整个多层前馈神经网络可表示为多个函数的结合：

$$
g(\boldsymbol{x}):=f^{L}(\boldsymbol{W}^{L}f^{L-1}(\boldsymbol{W}^{L-1}\ldots f^{1}(\boldsymbol{W}^{1}\boldsymbol{x}+\boldsymbol{b}^1)\ldots+\boldsymbol{b}^{L-1})+\boldsymbol{b}^{L})
$$

给定单个训样例 $\left(\boldsymbol{x},\boldsymbol{y}\right)$ 上，其损失函数为：

$$
C(\boldsymbol{y},g(\boldsymbol{x}))
$$

为方便使用梯度下降法求解损失函数的最小值，定义

- $\boldsymbol{z}^l:=\boldsymbol{W}^l\boldsymbol{\alpha}^{l-1}+\boldsymbol{b}^l$：第 $l$ 层的加权输入
- $\boldsymbol{\alpha}^{l}:=f^l(\boldsymbol{z}^{l})$：第 $l$ 层的输出，其中$\boldsymbol{\alpha}^{0}=\boldsymbol{x}$

因此，损失函数 $C$ 对于每一层的权重 $\boldsymbol{W}^l$ 的偏导函数为：

$$
\begin{aligned}
\frac{\partial C}{\partial\boldsymbol{W}^l}&=\frac{\partial C}{\partial\boldsymbol{\alpha}^L}\cdot\frac{\partial\boldsymbol{\alpha}^L}{\partial\boldsymbol{z}^L}\cdot\frac{\partial\boldsymbol{z}^{L}}{\partial\boldsymbol{\alpha}^{L-1}}\cdot\ldots\cdot\frac{\partial\boldsymbol{z}^{l+1}}{\partial\boldsymbol{\alpha}^{l}}\cdot\frac{\partial\boldsymbol{\alpha}^l}{\partial\boldsymbol{z}^l}\cdot\frac{\partial\boldsymbol{z}^{l}}{\partial\boldsymbol{W}^l}\\
    &=(f^{l})^{\prime}\cdot(\boldsymbol{W}^{l+1})^T\odot\ldots\odot(\boldsymbol{W}^{L-1})^T\cdot(f^{L})^{\prime}\odot\frac{\partial C}{\partial\boldsymbol{\alpha}^L}\cdot(\boldsymbol{a}_{l-1})^T
\end{aligned}
$$

损失函数 $C$ 对于每一层的阈值 $\boldsymbol{b^l}$ 的偏导函数为：

$$
\begin{aligned}
\frac{\partial C}{\partial\boldsymbol{b}^l}&=\frac{\partial C}{\partial\boldsymbol{\alpha}^L}\cdot\frac{\partial\boldsymbol{\alpha}^L}{\partial\boldsymbol{z}^L}\cdot\frac{\partial\boldsymbol{z}^{L}}{\partial\boldsymbol{\alpha}^{L-1}}\cdot\ldots\cdot\frac{\partial\boldsymbol{z}^{l+1}}{\partial\boldsymbol{\alpha}^{l}}\cdot\frac{\partial\boldsymbol{\alpha}^l}{\partial\boldsymbol{z}^l}\cdot\frac{\partial\boldsymbol{z}^{l}}{\partial\boldsymbol{b}^l}\\
    &=(f^{l})^{\prime}\cdot(\boldsymbol{W}^{l+1})^T\odot\ldots\odot(\boldsymbol{W}^{L-1})^T\cdot(f^{L})^{\prime}\odot\frac{\partial C}{\partial\boldsymbol{\alpha}^L}
\end{aligned}
$$

为方便计算神经网络中损失函数 $C$ 对于每一层的权重 $\boldsymbol{W}^l$ 与阈值 $\boldsymbol{b^l}$ 的偏导函数，引入辅助变量 $\boldsymbol{\delta}^l$：

$$
\boldsymbol{\delta}^l:=(f^{l})^{\prime}\odot(\boldsymbol{W}^{l+1})^T\odot\ldots\odot(\boldsymbol{W}^{L-1})^T\cdot(f^{L})^{\prime}\odot\frac{\partial C}{\partial\boldsymbol{\alpha}^L}
$$

所以，$\boldsymbol{\delta}^l$ 可被循环计算如下：

$$
\left\{
\begin{aligned}
\boldsymbol{\delta}^{l-1}&=(f^{l-1})^\prime\cdot(\boldsymbol{W}^{l})^{T}\boldsymbol{\delta}^l\\
\boldsymbol{\delta}^{L}&=(f^{L})^\prime\odot\frac{\partial C}{\partial\boldsymbol{\alpha}^L}
\end{aligned}
\right.
$$

所以，每一层的权重 $\boldsymbol{W}^l$ 与阈值 $\boldsymbol{b^l}$ 的偏导函数可表示为：

$$
\left\{
\begin{aligned}
\frac{\partial C}{\partial\boldsymbol{W}^l}&=\boldsymbol{\delta}^l\cdot(\boldsymbol{a}_{l-1})^T\\
\frac{\partial C}{\partial\boldsymbol{b}^l}&=\boldsymbol{\delta}^l\\
\end{aligned}
\right.
$$

因此，多层前馈神经网络模型的学习算法（误差逆传播算法）如下：

{% note primary %}

**输入：** 训练集 $D=\{(\boldsymbol{x_k},\boldsymbol{y_k})\}_{i=1}^m$；学习率 $\eta$；
**输出：** 连接权 $\boldsymbol{W^l}$与阈值 $\boldsymbol{b^l}$ 确定的多层前馈神经网络；

**过程：**

1. 在 $(0,1)$ 范围内随机初始化网络中所有连接权 $\boldsymbol{W^l}$ 与阈值 $\boldsymbol{b^l}$
2. 循环计算辅助变量 $\boldsymbol{\delta}^l,l=(L,L-1,\ldots,1)$
3. 计算梯度项 $\frac{\partial C}{\partial\boldsymbol{W}^l}$，$\frac{\partial C}{\partial\boldsymbol{b}^l}$
4. 更新网络中所有连接权 $\boldsymbol{W^l}=\boldsymbol{W^l}-\eta\frac{\partial C}{\partial\boldsymbol{W}^l}$，阈值 $\boldsymbol{b^l}=\boldsymbol{b^l}-\eta\frac{\partial\mathcal{l}(\boldsymbol{w},b)}{\partial b}$
5. 若模型收敛或达到其他条件，终止；否则转步（2）

{% endnote %}

- 网络结构：真正要决定的是隐藏层的层数和每个中间层的单元数，如果隐藏层数大于 1，确保每个隐藏层的单元个数相同，通常情况下隐藏层单元的个数越多越好。

[程序实现](https://github.com/SignorinoY/marine)

## 其他神经网络

## 深度学习
