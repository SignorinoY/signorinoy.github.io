---
title: Bootstrap
categories: 机器学习
tags: [Bootstrap]
date: 2019-03-11 23:37:37
---

![Pull up by your own bootstraps.](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/pull-yourself-up-by-the-boot-straps.png)

<!--more-->

在统计学中，Bootstrap 是一种从给定训练集中有放回的均匀抽样，来估计几乎任何统计量的抽样分布的方法。

## 标准方差估计

当我们用一个统计量作为某个参数的估计量时，为考察这个估计量的好坏程度，我们需要求出这个估计量的期望以考察无偏性，方差以考察有效性等。

考虑这样一个例子，样本 $X=(x_1,\dots,x_n),x_i\stackrel{iid}{\sim}N(\mu,\sigma^2)$，其分布函数为 $F_x(x)$，密度函数为 $p_x(x)$ 在数理统计中我们知道 $\bar{x}\sim N(\mu,\frac{\sigma^2}{n})$，从而可以得出 $\hat{se}(\bar{x})=\sqrt{\frac{\sigma^2}{n}}=\sqrt{\frac{\sum\limits_{i=1}^n(x_i-\bar{x})^2}{n(n-1)}}$。若我们希望知道 $Y=median(x_1,\dots,x_n)$ 的标准方差估计，我们应该怎么解决呢？

我们知道，一个统计量除少数几个外往往形式非常复杂，很难用解析的形式求出其方差及其方差的估计，那么，我们希望是否有一种更简单的方法来获取。

我们回顾一下，我们为什么不能从样本 $X=(x_1,\dots,x_n)$ 得出其标准方差估计，因为只存在一组样本，所以我们只能得到一个中位数的估计值，其标准方差估计恒为 0 显然不行。那么，我们就希望获得更多的样本来计算其标准方差估计，而这种方法就是 Bootstrap 方法的思想。

以下，我们以 Bootstrap 方法来估计 $Y=median(x_1,\dots,x_n)$ 的标准方差估计：

1. 由样本 $X=(x_1,\dots,x_n)$ 得出 $\mu$ 与 $\sigma^2$ 的估计，从而确定 $x$ 的分布为 $N(\hat{\mu},\hat{\sigma}^2)$。
2. 从 $N(\hat{\mu},\hat{\sigma}^2)$ 中生产 $B$ 组 Bootstrap 样本 $X_b^\star(x_1^{(i)},\dots,x_n^{(i)})\quad i=(1,\dots,B)$。
3. 计算得到 $B$ 个中位数样本 $y_i=median(x_1^{(i)},\dots,x_n^{(i)})\quad i=(1,\dots,B)$。
4. 计算得出 $\hat{se}(y)=\sqrt{\frac{1}{B-1}\sum\limits_{i=1}^n(y_i-\bar{y})^2}$。

> 当然，我们可以从次序统计量的角度出发得出 $Y$ 的密度函数（这里假设 $n$ 为奇数），如下：
> $$p_Y(y)=\frac{n!}{(\frac{n+1}{2}-1)!(n-\frac{n+1}{2})!}(F_x(y))^{\frac{n+1}{2}-1}(1-F_x(y))^{n-\frac{n+1}{2}}p_x(y)$$
> 其形式极为复杂，但仍可以解决该问题，只要我们得出 $\hat{F_x(x)}$，即可得出 $Y=median(x_1,\dots,x_n)$ 的标准方差估计。若我们希望得到的是样本 $X=(x_1,\dots,x_n)$ 的众数标准方差估计，我们应该怎样解决呢？显然，以自己目前所学的知识是很难找到显式解的。

Bootstrap 方法也分非参数的 Bootstrap 和参数化的 Bootstrap，上述4个步骤实际上是参数化的 Bootstrap 过程。若样本 $X=(x_1,\dots,x_n)$ 的分布 $F(x)$ 未知（非参数）情况下，我们如何使用 Bootstrap 来进行估计呢？

回顾一下，我们仍然希望获得足够多的样本来进行计算，而 Bootstrap 样本是由 $X$ 的分布 $F(x)$ 生成的，那么 $F(x)$ 怎么得到呢？

由格里纹科定理可知，我们可以考虑用经验分布函数 $F_n(x)$ 来近似地模拟 $F(x)$。

{% note %}

**（格里纹科定理）** 设 $x_1,\dots,x_n$ 是取自总体分布函数为 $F(x)$ 的样本，$F_n(x)$ 是其经验分布函数，当 $n\to\inf$ 时，有
$$P(\sup_{-\inf<x<\inf}|F_n(x)-F(x)|\to 0)=1$$

{% endnote %}

我们考虑如下离散分布：

| $X$ | $x_1$ | $x_2$ | $\dots$ | $x_n$ |
| :-: |  :-:  |  :-:  |   :-:   |  :-:  |
| $p$ | $\frac{1}{n}$ | $\frac{1}{n}$ | $\dots$ | $\frac{1}{n}$ |

其分布函数为：

$$G(x)=P(X\leq x)=\frac{1}{n}\sum\limits_{i=1}^nI(x_i\leq x)$$

可以证明

$$x_1^{(i)},x_2^{(i)},\dots,x_n^{(i)}\stackrel{iid}{\sim}\hat{F}(x)\Leftrightarrow x_1^{(i)},x_2^{(i)},\dots,x_n^{(i)}\stackrel{iid}{\sim}G(x)$$

所以，我们只需要有放回地抽样就能使得样本服从 $G(x)$。

以下，我们总结一下，如何使用 Bootstrap 方法来计算非参数情况下，任意一个统计量标准方差估计。

设有样本 $X=(x_1,\dots,x_n)$，统计量 $s(X)=s(x_1,\dots,x_n)$，求 $s(x)$ 的标准方差估计。

1. 从 $x_1,\dots,x_n$ 有放回地抽样 $n$ 次，得到一个 Bootstrap 样本 $X^{\ast,b}=(X^{\ast,1},\dots,X{\ast,n},b)$。
2. 计算得到的 Bootstrap 样本的统计量 $s(X^{\ast, b})$。
3. 重复第 1 步 $B$ 次，得到 $B$ 个 Bootstrap 样本的统计量 $s(X^{\ast,i})\quad(i=1,\dots,n)$。
4. 计算标准方差估计 $\hat{se}(s(X))=\sqrt{\frac{1}{B-1}\sum\limits_{i=1}^n(s(X)_i-\bar{s(X)})^2}$。

而参数 Bootstrap 与上面的步骤类似，参数化的 Bootstrap 假设 $F$ 是参数模型。因此，参数化的 Bootstrap 比非参数化的多了一个步骤：利用数据估计估计参数 $\hat{\theta}$，从而用 $f(x:\hat{\theta})$ 来获得 Bootstrap 样本。

其实，不仅可以用 Bootstrap 来估计方差，也可以用来估计CDF、偏差、置信区间等，其思想是一致的。
