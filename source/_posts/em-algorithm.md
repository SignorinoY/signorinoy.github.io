---
title: EM 算法
categories: 机器学习
tags: [EM 算法]
date: 2019-06-19 19:26:44
---

最大期望算法（Expectation-maximization algorithm，又译期望最大化算法）在统计中被用于寻找，依赖于不可观察的隐性变量的概率模型中，参数的最大似然估计。

在统计计算中，最大期望（EM）算法是在概率模型中寻找参数最大似然估计或者最大后验估计的算法，其中概率模型依赖于无法观测的隐变量。最大期望算法经常用在机器学习和计算机视觉的数据聚类（Data Clustering）领域。最大期望算法经过两个步骤交替进行计算，第一步是计算期望（E），利用对隐藏变量的现有估计值，计算其最大似然估计值；第二步是最大化（M），最大化在 E 步上求得的最大似然值来计算参数的值。M 步上找到的参数估计值被用于下一个E步计算中，这个过程不断交替进行。[^1]

<!--more-->

### Gaussian Mixture Model

考虑 Gaussian Mixture Model：$X\sim qN(\mu_1,\sigma_1^2)+(1-q)N(\mu_2,\sigma_2^2)$，请用 EM 算法推导 $\theta=\left(q,\mu_1,\mu_2,\sigma_1^2,\sigma_2^2\right)$ 的估计，并用数据求得其估计值。

为引入 EM 算法，我们通过引入一个隐变量 $Z$ 来描述 Gaussian Mixture Model，其中：

$$x\mid(z=1)\sim N(\mu_1,\sigma_1^2),x\mid(z=2)\sim N(\mu_2,\sigma_2^2).$$

$$P(Z=1)=\tau_1=q,P(Z=2)=\tau_2=1-q.$$

所以：$p(x)=\sum_zp(z)p(x\mid z)$

为估计 Gaussian Mixture Model 的参数 $\theta=\left(q,\mu_1,\mu_2,\sigma_1^2,\sigma_2^2\right)$，写出完整数据的对数似然函数如下：

$$\log{L(\theta;\mathbf{x},\mathbf{z})}=\log{p(\mathbf{x},\mathbf{z}\mid\theta)}=\sum_{i=1}^{n}\log{p(x_i,z_i\mid\theta)}$$

$$\because p(x_i,z_i)=p(z_i)p(x_i\mid z_i)=\prod_{j=1}^{2}\left[f(x_i; \mu_j,\sigma_j)\tau_j\right]^{\mathbb{I}(z_i=j)}$$

$$\begin{aligned}\therefore\log{L(\theta;\mathbf{x},\mathbf{z})}&=\log{p(\mathbf{x},\mathbf{z}\mid\theta)}\\&=\sum_{i=1}^n\sum_{j=1}^{2}\mathbb{I}(z_i=j)\log{\left[f(x_i; \mu_j,\sigma_j)\tau_j\right]}\\&=\sum_{i=1}^n\sum_{j=1}^{2}\mathbb{I}(z_i=j)\left[\log{\tau_j-\frac{1}{2}\log{\sigma_j^2}-\frac{(x_i-\mu_j)^2}{2\sigma_j^2}-\frac{1}{2} \log{(2\pi)}}\right]\end{aligned}$$

**E-Step：** 在已有观测数据 $\mathbf{x}$ 及第 $t$ 步估计值 $\theta=\theta^{(t)}$ 的条件下，求出基于完全数据的对数似然函数的期望。

$$\begin{aligned}Q_{\theta^{(t)}}(\theta) &= E_{\theta^{(t)}}\left[\log{L(\theta; \mathbf{x},\mathbf{z})} \mid \mathbf{x} \right]\\&= E_{\theta^{(t)}} \left\{\sum_{i=1}^n\sum_{j=1}^{2} \mathbb{I}(z_i=j) \left[\log{\tau_j - \frac{1}{2} \log{\sigma_j^2} - \frac{(x_i-\mu_j)^2}{2\sigma_j^2} - \frac{1}{2} \log{(2\pi)}}\right] \mid \mathbf{x}\right\}\\&= \sum_{i=1}^n E_{\theta^{(t)}} \left\{\sum_{j=1}^{2} \mathbb{I}(z_i=j) \left[\log{\tau_j - \frac{1}{2} \log{\sigma_j^2} - \frac{(x_i-\mu_j)^2}{2\sigma_j^2} - \frac{1}{2} \log{(2\pi)}}\right] \mid x_i\right\}\\&= \sum_{i=1}^n \sum_{j=1}^{2} \left[\log{\tau_j - \frac{1}{2} \log{\sigma_j^2} - \frac{(x_i-\mu_j)^2}{2{\sigma_j}^2} - \frac{1}{2} \log{(2\pi)}}\right] E_{\theta^{(t)}} \left[ \mathbb{I}(z_i=j) \mid x_i\right]\end{aligned}$$

$$\because T_{j,i}^{(t)} := P(Z_i=j \mid X_i=x_i;\theta^{(t)})=\frac{\tau_j^{(t)}f(x_i;\mu_j^{(t)},{\sigma_j^2}^{(t)})}{\tau_1^{(t)}f(x_i;\mu_1^{(t)},{\sigma_1^2}^{(t)})+\tau_2^{(t)}f(x_i;\mu_2^{(t)},{\sigma_2^2}^{(t)})}.$$

$$\therefore E_{\theta^{(t)}} \left[ \mathbb{I}(z_i=j) \mid x_i\right] = T_{j,i}^{(t)}$$

$$\therefore Q_{\theta^{(t)}}(\theta) = \sum_{i=1}^n \sum_{j=1}^{2} \left[\log{\tau_j - \frac{1}{2} \log{\sigma_j^2} - \frac{(x_i-\mu_j)^2}{2{\sigma_j}^2} - \frac{1}{2} \log{(2\pi)}}\right] T_{j,i}^{(t)}$$

**M-Step：** 求 $Q_{\theta^{(t)}}(\theta)$ 关于 $\theta$ 的最大值 $\theta^{(t+1)}$，即找到$\theta^{(t+1)}$ 使得

$$\theta^{(t+1)} = {\arg\max}_\theta Q_{\theta^{(t)}}(\theta).$$

首先，我们考虑 $\boldsymbol{\tau}$ ，其中 $\tau_1+\tau_2=1$：

$$\begin{aligned}\boldsymbol{\tau}^{(t+1)} &= {\arg\max}_{\boldsymbol{\tau}} Q_{\theta^{(t)}}(\theta)\\&= {\arg\max}_{\boldsymbol{\tau}} \left\{\left[\sum_{i=1}^n T_{1,i}^{(t)}\right]\log\tau_1 + \left[\sum_{i=1}^n T_{2,i}^{(t)}\right]\log\tau_2\right\}\end{aligned}$$

将 $\tau_2$ 用 $\tau_1$ 代换后，对 $\tau_1$ 求偏导可得：

$$\frac{\partial Q_{\theta^{(t)}}(\theta)}{\partial\tau_1} = \frac{\sum_{i=1}^n T_{1,i}^{(t)}}{\tau_1} - \frac{\sum_{i=1}^n T_{2,i}^{(t)}}{1-\tau_1} = 0 \quad (\tau_1+\tau_2=1)$$

$$\therefore \tau_1^{(t+1)} = \frac{\sum_{i=1}^{n} T_{1,i}^{(t)}}{\sum_{i=1}^{n}\left(T_{1,i}^{(t)}+T_{2,i}^{(t)}\right)}=\frac{1}{n} \sum_{i=1}^{n} T_{1,i}^{(t)} \quad \tau_2^{(t+1)} = 1 - \tau_1^{(t+1)} = \frac{1}{n} \sum_{i=1}^{n} T_{2,i}^{(t)}.$$

接着我们考虑 $(\mu_1,\sigma_1^2)$：

$$\begin{aligned}\left(\mu_1^{(t+1)},{\sigma_1^2}^{(t+1)}\right) &= {\arg\max}_{\mu_1,\sigma_1^2} Q\left(\theta | \theta^{(t)}\right) \\&= {\arg\max}_{\mu_1,\sigma_1^2} \sum_{i=1}^{n} T_{1,i}^{(t)}\left\{-\frac{1}{2} \log {\sigma_1} - \frac{(x_i-\mu_1)^2}{2{\sigma_1}^2}\right\}\end{aligned}$$

对 $\mu_1,\sigma_1^2$ 分别求偏导可得：

$$\frac{\partial Q_{\theta^{(t)}}(\theta)}{\partial\mu_1} = \sum_{i=1}^{n} T_{1,i}^{(t)}\frac{x_i-\mu_i}{\sigma_1^2} = 0$$

$$\frac{\partial Q_{\theta^{(t)}}(\theta)}{\partial\sigma_1^2} = \sum_{i=1}^{n} T_{1,i}^{(t)}\left[-\frac{1}{2\sigma_1^2} + \frac{(x_i-\mu_1)^2}{2\sigma_1^4}\right] = 0$$

$$\therefore \mu_1^{(t+1)} = \frac{\sum_{i=1}^n T_{1,i}^{(t)} x_i}{\sum_{i=1}^n T_{1,i}^{(t)}} \quad {\sigma_1^2}^{(t+1)} = \frac{\sum_{i=1}^n T_{1,i}^{(t)} (x_i - \mu_1^{(t+1)})^2}{\sum_{i=1}^n T_{1,i}^{(t)}}.$$

最后，我们考虑 $(\mu_2,\sigma_2^2)$，其求解方法与上述相同：

$$\therefore \mu_2^{(t+1)} = \frac{\sum_{i=1}^n T_{2,i}^{(t)} x_i}{\sum_{i=1}^n T_{2,i}^{(t)}} \quad {\sigma_2^2}^{(t+1)} = \frac{\sum_{i=1}^n T_{2,i}^{(t)} (x_i - \mu_2^{(t+1)})^2}{\sum_{i=1}^n T_{2,i}^{(t)}}.$$

**终止：** 重复 E-Step 与 M-Step 直至收敛，即，对于给定的 $\varepsilon>0$ ，$Q_{\theta^{(t)}}(\theta) - Q_{\theta^{(t-1)}}(\theta) \leq \varepsilon$，即可得到 $\theta$ 的极大似然估计。

由此我们可以得到该高斯混合模型参数估计的 EM 算法如下：

![该高斯混合模型参数估计的 EM 算法](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/em-algorithm-gaussian-mixture-model-sample.png)

在得到估计该高斯混合模型的 EM 算法后，由于 EM 算法对初始值设置极为敏感，我们根据观测到的数据分布情况设定高斯混合模型的初始参数如下：

$$q = 0.7,\mu_1=1,\mu_2=2,\sigma_1^2=2,\sigma_2^2=2$$

在设定高斯混合模型的初始参数后，使用上述算法对其进行迭代，最终得到：

$$q = 0.45,\mu_1=0,\mu_2=2,\sigma_1^2=1,\sigma_2^2=1$$

Python源程序

```python
#!/usr/bin/env python
# coding: utf-8

import numpy as np
import pandas as pd
from scipy.stats import norm
import matplotlib.pyplot as plt
import seaborn as sns
sns.set()

data = pd.read_csv("../data/EM.csv",index_col=0)
X = np.array(data.x)

# 绘制数据分布图
sns.distplot(X)
plt.savefig("distplot.png")

# 设定高斯混合模型初始参数
n_samples = X.shape[0]
n_components = 2
tau = np.array([0.7,0.3])
mu = np.array([1,2])
sigma2 = np.array([2,2])
max_iters = 100
T = np.zeros((n_components,n_samples))

# 使用 EM 算法进行迭代
for j in range(max_iters):
    for i in range(n_components):
        T[i] = tau[i] * norm.pdf(X,mu[i],np.sqrt(sigma2[i]))
    T = T / np.sum(T,axis=0)
    tau = np.sum(T,axis=1)/n_samples
    for i in range(n_components):
        mu[i] = np.sum(T[i] * X,axis=0) / np.sum(T[i],axis=0)
        sigma2[i] = np.sum(T[i] * np.power(X - mu[i],2),axis=0) / np.sum(T[i],axis=0)

# 输出估计结果
print(tau,mu,sigma2)
```

[^1]: [https://en.wikipedia.org/wiki/Expectation%E2%80%93maximization_algorithm](https://en.wikipedia.org/wiki/Expectation%E2%80%93maximization_algorithm)
