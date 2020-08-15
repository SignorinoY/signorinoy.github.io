---
title: 《机器学习》公式推导
categories: 机器学习
tags: []
date: 2020-05-31 23:50:50
---

{% note info %}

- 书籍名称：机器学习，周志华
- 阅读地址：[https://book.douban.com/subject/26708119/](https://book.douban.com/subject/26708119/)

{% endnote %}

<!--more-->

## 线性模型

### 对数几率回归

给定数据集 $D=\{(\boldsymbol{x_1},y_1),(\boldsymbol{x_2},y_2),\ldots,(\boldsymbol{x_m},y_m)\},\boldsymbol{x_i}\in\mathbb{R}^n,y_i\in\left\{0,1\right\}$，对数几率回归模型的对数似然函数为：

$$
\mathcal{l}(\boldsymbol{w},b)=\sum_{i=1}^m\ln p(y_i|\boldsymbol{x_i};\boldsymbol{w},b)
$$

令 $\boldsymbol{\beta}=(\boldsymbol{w},b)$、$\boldsymbol{\hat{x}}=(\boldsymbol{x};1)$，则 $\boldsymbol{w}^T\boldsymbol{x}+b$ 可简写为 $\boldsymbol{\beta}^T\boldsymbol{\hat{x}}$。再令 $p_1(\boldsymbol{\hat{x}};\boldsymbol{\beta})=p(y=1|\boldsymbol{\hat{x}};\boldsymbol{\beta})$、$p_0(\boldsymbol{\hat{x}};\boldsymbol{\beta})=p(y=0|\boldsymbol{\hat{x}};\boldsymbol{\beta})$，则上式中的似然项可重写为：

$$
p(y_i|\boldsymbol{x_i};\boldsymbol{w},b)=y_ip_1(\boldsymbol{\hat{x_i}};\boldsymbol{\beta})+(1-y_i)p_0(\boldsymbol{\hat{x_i}};\boldsymbol{\beta})
$$

因此，对数似然函数可写为：

$$
\begin{aligned}
\mathcal{l}(\boldsymbol{w},b)&=\sum_{i=1}^m\ln p(y_i|\boldsymbol{x_i};\boldsymbol{w},b)\\
    &=\sum_{i=1}^m\ln\left(y_ip_1(\boldsymbol{\hat{x_i}};\boldsymbol{\beta})+(1-y_i)p_0(\boldsymbol{\hat{x_i}};\boldsymbol{\beta}))\right)\\
    &=\sum_{i=1}^m\ln\left(y_ip_1(\boldsymbol{\hat{x_i}};\boldsymbol{\beta})+(1-y_i)(1-p_1(\boldsymbol{\hat{x_i}};\boldsymbol{\beta}))\right)\\
    &=\sum_{i=1}^m\ln\frac{1-y_i+y_ie^{\boldsymbol{\beta}^T\boldsymbol{\hat{x_i}}}}{1+e^{\boldsymbol{\beta}^T\boldsymbol{\hat{x_i}}}}\\
    &=\sum_{i=1}^m\left(\ln(1-y_i+y_ie^{\boldsymbol{\beta}^T\boldsymbol{\hat{x_i}}})-\ln(1+e^{\boldsymbol{\beta}^T\boldsymbol{\hat{x_i}}})\right)\\
    &=\sum_{i=1}^m\left(y_i\boldsymbol{\beta}^T\boldsymbol{\hat{x_i}}-\ln(1+e^{\boldsymbol{\beta}^T\boldsymbol{\hat{x_i}}})\right)
\end{aligned}
$$

最大化该对数似然函数等价于最小化：

$$
\mathcal{l}(\boldsymbol{\beta})=\sum_{i=1}^m\left(-y_i\boldsymbol{\beta}^T\boldsymbol{\hat{x_i}}+\ln(1+e^{\boldsymbol{\beta}^T\boldsymbol{\hat{x_i}}})\right)
$$

关于 $\boldsymbol{\beta}$ 的一阶导数为：

$$
\begin{aligned}
\frac{\partial\mathcal{l}(\boldsymbol{\beta})}{\partial\boldsymbol{\beta}}&=\sum_{i=1}^m\left(-y_i\boldsymbol{\hat{x_i}}+\frac{e^{\boldsymbol{\beta}^T\boldsymbol{\hat{x_i}}}}{1+e^{\boldsymbol{\beta}^T\boldsymbol{\hat{x_i}}}}\boldsymbol{\hat{x_i}}\right)\\
    &=-\sum_{i=1}^m(y_i-p_1(\boldsymbol{\hat{x}};\boldsymbol{\beta}))\boldsymbol{\hat{x_i}}
\end{aligned}
$$

## 神经网络

### 误差逆传播算法

为方便讨论，给定训练集 $D=\{(\boldsymbol{x_1},\boldsymbol{y_1}),(\boldsymbol{x_2},\boldsymbol{y_2}),\ldots,(\boldsymbol{x_n},\boldsymbol{y_n})\},\boldsymbol{x_i}\in\mathbb{R}^d,\boldsymbol{y_i}\in\mathbb{R}^l$，即输入示例由 d 个属性描述、输出 l 维实值向量。给出一个拥有 d 个输入神经元、l 个输出神经元以及 q 个隐层神经元的多层前馈网络结构，假设隐层和输出层神经元都使用 Sigmoid 函数。

![BP 网络及算法中的变量符号](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/bp-neural-network-example.svg)

可以看出：BP 算法首先将误差反向传播给隐层神经元，调节隐层到输出层的连接权重与输出层神经元的阈值；接着根据隐含层神经元的均方误差，来调节输入层到隐含层的连接权值与隐含层神经元的阈值。

假定神经网络的输出为 $\boldsymbol{\hat{y}_k}=\left(\hat{y}_1^k,\hat{y}_2^k,\dots,\hat{y}_l^k\right)$，即 $\hat{y}_j^k=f\left(\beta_j-\theta_j\right)$；神经网络的隐层输出为 $\boldsymbol{\hat{b}_k}=\left(\hat{b}_1^k,\hat{b}_2^k,\dots,\hat{b}_q^k\right)$，即 $\hat{b}_h^k=f\left(\alpha_h-\gamma_h\right)$。

因此，神经网络在单个训样例 $\left(\boldsymbol{x_k},\boldsymbol{y_k}\right)$ 上的均方误差为：

$$
E_k=\frac{1}{2}\sum_{j=1}^l\left(\hat{y}_j^k-y_j^k\right)^2
$$

BP 算法基本的推导过程与感知机的推导过程原理是相同的，给定学习率 $\eta$，有

$$
\begin{aligned}
\Delta w_{hj}&=-\eta\cdot\frac{\partial E_k}{\partial w_{hj}}\\
             &=-\eta\cdot\frac{\partial E_k}{\partial\hat{y}_j^k}\cdot\frac{\partial\hat{y}_j^k}{\partial\beta_j}\cdot\frac{\partial\beta_j}{\partial w_{hj}}\\
             &=-\eta\cdot\left(\hat{y}_j^k-y_j^k\right)\cdot f^\prime\left(\beta_j-\theta_j\right)\cdot b_h\\
             &=-\eta\cdot\left(\hat{y}_j^k-y_j^k\right)\cdot f\left(\beta_j-\theta_j\right)\left(1-f\left(\beta_j-\theta_j\right)\right)\cdot b_h\\
             &=-\eta\cdot\left(\hat{y}_j^k-y_j^k\right)\cdot\hat{y}_j^k\left(1-\hat{y}_j^k\right)\cdot b_h\\
             &=\eta b_h\hat{y}_j^k\left(1-\hat{y}_j^k\right)\left(y_j^k-\hat{y}_j^k\right)\\
\Delta \theta_j&=-\eta\cdot\frac{\partial E_k}{\partial\theta_j}\\
               &=-\eta\cdot\frac{\partial E_k}{\partial\hat{y}_j^k}\cdot\frac{\partial\hat{y}_j^k}{\partial\theta_j}\\
               &=-\eta\cdot\left(\hat{y}_j^k-y_j^k\right)\cdot (-1)f^\prime\left(\beta_j-\theta_j\right)\\
               &=\eta\hat{y}_j^k\left(1-\hat{y}_j^k\right)\left(\hat{y}_j^k-y_j^k\right)\\
\Delta v_{ih}&=-\eta\cdot\frac{\partial E_k}{\partial v_{ih}}\\
             &=-\eta\cdot\sum_{j=1}^{l}\frac{\partial E_k}{\partial\hat{y}_j^k}\cdot\frac{\partial\hat{y}_j^k}{\partial\beta_h}\cdot\frac{\partial\beta_j}{\partial b_h}\cdot\frac{\partial b_h}{\partial\alpha_h}\cdot\frac{\partial\alpha_h}{\partial v_{ih}}\\
             &=-\eta\cdot\sum_{j=1}^{l}\left(\hat{y}_j^k-y_j^k\right)\cdot\hat{y}_j^k\left(1-\hat{y}_j^k\right)\cdot w_{hj}\cdot f^\prime\left(\alpha_h-\gamma_h\right)\cdot x_i\\
             &=\eta x_ib_h(1-b_h)\sum_{j=1}^lw_{hj}\hat{y}_j^k\left(1-\hat{y}_j^k\right)\left(y_j^k-\hat{y}_j^k\right)\\
\Delta \gamma_h&=-\eta\cdot\frac{\partial E_k}{\partial v_{ih}}\\
               &=-\eta\cdot\sum_{j=1}^{l}\frac{\partial E_k}{\partial\hat{y}_j^k}\cdot\frac{\partial\hat{y}_j^k}{\partial\beta_h}\cdot\frac{\partial\beta_j}{\partial b_h}\cdot\frac{\partial b_h}{\partial\gamma_h}\\
               &=-\eta\cdot\sum_{j=1}^{l}\left(\hat{y}_j^k-y_j^k\right)\cdot\hat{y}_j^k\left(1-\hat{y}_j^k\right)\cdot w_{hj}\cdot(-1)f^\prime\left(\alpha_h-\gamma_h\right)\\
               &=\eta b_h(1-b_h)\sum_{j=1}^lw_{hj}\hat{y}_j^k\left(1-\hat{y}_j^k\right)\left(\hat{y}_j^k-y_j^k\right)
\end{aligned}
$$

综上所述，不妨令 $g_j=\hat{y}_j^k\left(1-\hat{y}_j^k\right)\left(y_j^k-\hat{y}_j^k\right)$，$e_h=b_h(1-b_h)\sum_{j=1}^lw_{hj}g_j$，则有

$$
\Delta w_{hj}=\eta g_jb_h,\Delta\theta_j=-\eta g_j,\Delta v_{ih}=\eta e_hx_i,\Delta\gamma_h=-\eta e_h
$$

任意参数 $v$ 的更新估计式为

$$
v\leftarrow v+\Delta v
$$

BP 算法将不断对模型的权重及阈值进行调整，直至模型收敛为止。
