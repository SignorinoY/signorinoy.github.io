---
title: 线性模型
categories: 机器学习
tags: [对数几率回归]
date: 2020-04-15 16:04:10
---

线性模型试图学得一个通过属性 $\boldsymbol{w}$ 的线性组合来进行预测的函数，即：

$$
f(\boldsymbol{x})=\boldsymbol{w}^T\boldsymbol{x}+b
$$

线性模型形式简单、易于建模，但却蕴含着机器学习中一些重要的基本思想。许多功能更为强大的非线性模型可在线性模型的基础上通过引入层级结构或高位映射而得。

<!--more-->

## 对数几率回归

对于分类任务而言，只需要得到一个单调可微函数即可将分类任务的真实标记 $y$ 与线性回归模型的预测值相联系。

最为理想的函数是阶跃函数，它将输入值映射为输出值“0”或“1”。然而，阶跃函数具有不连续、不光滑等不太好的性质，因此实际常用 Sigmoid 函数作为激活函数，Sigmoid 函数能把可能在较大范围内变化的输入值挤压到 $(0,1)$ 输出值范围内，因此有时也被称为“挤压函数”。

{% note %}

Sigmoid 函数也叫 Logistic 函数，因此，对数几率回归也叫 Logistic 回归。

{% endnote %}

因此，对数几率回归可表示为：

$$
y=\frac{1}{1+e^{-(\boldsymbol{w}^T\boldsymbol{x}+b)}}
$$

可变化为：

$$
\ln\frac{y}{1-y}=\boldsymbol{w}^T\boldsymbol{x}+b
$$

若将 $y$ 视为样本 $\boldsymbol{x}$ 作为正例的可能性，则 $1-y$ 是其作为反例的可能性，两者的比值：

$$
\frac{y}{1-y}
$$

称为“几率”（odds），反映了 $\boldsymbol{x}$ 作为正例的相对可能性。对几率取对数则得到“对数几率”（log odds， logit）:

$$
\ln\frac{y}{1-y}
$$

由此可以看出，对数几率回归实际上是在用线性回归模型的预测结果去逼近真实标记的对数几率。

可通过极大似然法来估计 $\boldsymbol{w}$ 和 $b$。给定数据集 $D=\{(\boldsymbol{x_1},y_1),(\boldsymbol{x_2},y_2),\ldots,(\boldsymbol{x_m},y_m)\},\boldsymbol{x_i}\in\mathbb{R}^n,y_i\in\left\{0,1\right\}$，对数几率回归模型的对数似然函数为：

$$
\mathcal{l}(\boldsymbol{w},b)=\sum_{i=1}^m\ln p(y_i|\boldsymbol{x_i};\boldsymbol{w},b)
$$

令 $p_1(\boldsymbol{x};\boldsymbol{w},b)=p(y=1|\boldsymbol{x};\boldsymbol{w},b)$、$p_0(\boldsymbol{x};\boldsymbol{w},b)=p(y=0|\boldsymbol{x};\boldsymbol{w},b)$，则上式中的似然项可重写为：

$$
p(y_i|\boldsymbol{x_i};\boldsymbol{w},b)=y_ip_1(\boldsymbol{x_i};\boldsymbol{w},b)+(1-y_i)p_0(\boldsymbol{x_i};\boldsymbol{w},b)
$$

因此，对数似然函数可写为：

$$
\begin{aligned}
\mathcal{l}(\boldsymbol{w},b)&=\sum_{i=1}^m\ln p(y_i|\boldsymbol{x_i};\boldsymbol{w},b)\\
    &=\sum_{i=1}^m\ln\left(y_ip_1(\boldsymbol{x_i};\boldsymbol{w},b)+(1-y_i)p_0(\boldsymbol{x_i};\boldsymbol{w},b))\right)\\
    &=\sum_{i=1}^m\ln\left(y_ip_1(\boldsymbol{x_i};\boldsymbol{w},b)+(1-y_i)(1-p_1(\boldsymbol{x_i};\boldsymbol{w},b))\right)\\
    &=\sum_{i=1}^m\ln\frac{1-y_i+y_ie^{\boldsymbol{w}^T\boldsymbol{x_i}+b}}{1+e^{\boldsymbol{w}^T\boldsymbol{x_i}+b}}\\
    &=\sum_{i=1}^m\left(\ln(1-y_i+y_ie^{\boldsymbol{w}^T\boldsymbol{x_i}+b})-\ln(1+e^{\boldsymbol{w}^T\boldsymbol{x_i}+b})\right)\\
    &=\sum_{i=1}^m\left(y_i(\boldsymbol{w}^T\boldsymbol{x_i}+b)-\ln(1+e^{\boldsymbol{w}^T\boldsymbol{x_i}+b})\right)
\end{aligned}
$$

最大化该对数似然函数等价于最小化：

$$
\mathcal{l}(\boldsymbol{w},b)=\sum_{i=1}^m\left(-y_i(\boldsymbol{w}^T\boldsymbol{x_i}+b)+\ln(1+e^{\boldsymbol{w}^T\boldsymbol{x_i}+b})\right)
$$

由于该函数为任意阶可导的凸函数，现有的许多数值优化算法都可直接用于求取最优解，如梯度下降法、牛顿迭代法等。以梯度下降法为例，关于 $\boldsymbol{w},b$ 的一阶导数为：

$$
\begin{aligned}
\frac{\partial\mathcal{l}(\boldsymbol{w},b)}{\partial\boldsymbol{w}}&=\sum_{i=1}^m\left(-y_i\boldsymbol{x_i}+\frac{e^{\boldsymbol{w}^T\boldsymbol{x_i}+b}}{1+e^{\boldsymbol{w}^T\boldsymbol{x_i}+b}}\boldsymbol{x_i}\right)\\
    &=-\sum_{i=1}^m(y_i-p_1(\boldsymbol{x};\boldsymbol{w},b))\boldsymbol{x_i}
\end{aligned}
$$

$$
\begin{aligned}
\frac{\partial\mathcal{l}(\boldsymbol{w},b)}{\partial b}&=\sum_{i=1}^m\left(-y_i+\frac{e^{\boldsymbol{w}^T\boldsymbol{x_i}+b}}{1+e^{\boldsymbol{w}^T\boldsymbol{x_i}+b}}\right)\\
    &=-\sum_{i=1}^m(y_i-p_1(\boldsymbol{x};\boldsymbol{w},b))
\end{aligned}
$$

因此，对数几率回归模型的学习算法（梯度下降法）如下：

{% note primary %}

**输入：** 训练集 $D=\{(\boldsymbol{x_k},y_k)\}_{i=1}^m$；学习率 $\eta$；
**输出：** 权重 $\boldsymbol{w}$，截距 $b$；

**过程：**

1. 随机初始化权重 $\boldsymbol{w}$，截距 $b$
2. 计算梯度项 $\frac{\partial\mathcal{l}(\boldsymbol{w},b)}{\partial\boldsymbol{w}}$，$\frac{\partial\mathcal{l}(\boldsymbol{w},b)}{\partial b}$
3. 更新权重 $\boldsymbol{w}=\boldsymbol{w}-\eta\frac{\partial\mathcal{l}(\boldsymbol{w},b)}{\partial\boldsymbol{w}}$，截距 $b=b-\eta\frac{\partial\mathcal{l}(\boldsymbol{w},b)}{\partial b}$
4. 若模型收敛或达到其他条件，终止；否则转步（2）

{% endnote %}
