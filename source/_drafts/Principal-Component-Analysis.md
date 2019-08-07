---
title: 主成分分析
date: 2018-01-24 14:38:57
tags:
- 数学建模
- Matlab
- 多元分析
---
在多元统计分析中,主成分分析（英语：Principal components analysis,PCA）是一种分析、简化数据集的技术.**主成分分析经常用于减少数据集的维数,同时保持数据集中的对方差贡献最大的特征**.这是通过保留低阶主成分,忽略高阶主成分做到的.这样低阶成分往往能够保留住数据的最重要方面.但是,这也不是一定的,要视具体应用而定.由于主成分分析依赖所给数据,所以数据的准确性对分析结果影响很大.
<!--more-->
### 基本思想及方法
[参考资料](https://en.wikipedia.org/wiki/Principal_component_analysis)
#### 主成分分析法的步骤
1. 对原始数据进行标准化处理
2. 计算相关系数矩阵$R$
3. 计算特征值和特征向量
4. 选择$p(p<=m)$个主成分,计算综合评价值

### 主成分回归分析
> In statistics, principal component regression (PCR) is a regression analysis technique that is based on principal component analysis (PCA). Typically, it considers regressing the outcome (also known as the response or the dependent variable) on a set of covariates (also known as predictors, or explanatory variables, or independent variables) based on a standard linear regression model, but uses PCA for estimating the unknown regression coefficients in the model.
> In PCR, instead of regressing the dependent variable on the explanatory variables directly, the principal components of the explanatory variables are used as regressors. One typically uses only a subset of all the principal components for regression, thus making PCR some kind of a regularized procedure. Often the principal components with higher variances (the ones based on eigenvectors corresponding to the higher eigenvalues of the sample variance-covariance matrix of the explanatory variables) are selected as regressors. However, for the purpose of predicting the outcome, the principal components with low variances may also be important, in some cases even more important.
> One major use of PCR lies in overcoming the multicollinearity problem which arises when two or more of the explanatory variables are close to being collinear. PCR can aptly deal with such situations by excluding some of the low-variance principal components in the regression step. In addition, by usually regressing on only a subset of all the principal components, PCR can result in dimension reduction through substantially lowering the effective number of parameters characterizing the underlying model. This can be particularly useful in settings with high-dimensional covariates. Also, through appropriate selection of the principal components to be used for regression, PCR can lead to efficient prediction of the outcome based on the assumed model.

### 练习1
#### 问题重述
> 表 34 是我国 1984—2000 年宏观投资的一些数据,试利用主成分分析对投资效益进行分析和排序.（主成分分析法）
> ![表34 1984—2000年宏观投资效益主要指标](https://xn--i0v668g.com/images/matlab_ex10_2_1.png)

#### 模型求解
```matlab
clc,clear
data = load('data.txt');
data = zscore(data);%标准化处理
year = [1984:2000]';
r = corrcoef(data);%计算相关系数矩阵
[COEFF,latent,explained] = pcacov(r)%COEFF的列为r的特征向量,latent为r的特征值,explained为各个主成分的贡献率
contr = cumsum(explained)%计算累积贡献率
f = repmat(sign(sum(COEFF)),size(COEFF,1),1);
COEFF = COEFF.*f;%修改特征向量的正负号,使得每个特征向量的分量和为正
num = 3;%选取主成分的个数
g = data*COEFF(:,1:num);%计算各个主成分的得分
tg = g*explained(1:num)/100;%计算综合得分
[stg,index] = sort(tg,'descend');%对综合得分进行排序
```
```matlab
COEFF =
    0.4905   -0.2934    0.5109    0.1896   -0.6134
    0.5254    0.0490    0.4337   -0.1217    0.7202
   -0.4871   -0.2812    0.3714    0.6888    0.2672
    0.0671    0.8981    0.1477    0.3863   -0.1336
   -0.4916    0.1606    0.6255   -0.5706   -0.1254
latent =
    3.1343
    1.1683
    0.3502
    0.2258
    0.1213
explained =
   62.6866
   23.3670
    7.0036
    4.5162
    2.4266
contr =
   62.6866
   86.0536
   93.0572
   97.5734
  100.0000
```
![排名和综合评价结果](https://xn--i0v668g.com/images/matlab_ex10_2_2.png)

### 练习2
#### 问题重述
> （Hald,1960）Hald 数据是关于水泥生产的数据.某种水泥在凝固时放出的热量 Y（单位：卡/克）与水泥中 4 种化学成品所占的百分比有关；在生产中测得 12 组数据,见表5,试建立 Y 关于这些因子的“最优”回归方程.（主成分回归分析）
> ![表5：Hald水泥](https://xn--i0v668g.com/images/matlab_eg10_5_1.png)

#### 模型求解
```matlab
clc,clear
data = load('data.txt');%读入数据
[m,n] = size(data);
x0 = data(:,[1:n-1]);
y0 = data(:,n);
hg1 = [ones(m,1),x0]\y0;%普通最小二乘法回归系数
hg1 = hg1'
xd = zscore(x0);%对x0进行标准化处理
yd = zscore(y0);%对y0进行标准化处理
r = corrcoef(x0);
[COEFF,latent,explained] = pcacov(r);%COEFF的列为r的特征向量,latent为r的特征值,explained为各个主成分的贡献率
contr = cumsum(explained);%计算累积贡献率
f = repmat(sign(sum(COEFF)),size(COEFF,1),1);
COEFF = COEFF.*f;%修改特征向量的正负号,使得每个特征向量的分量和为正
g = xd*COEFF;%计算所有主成分的得分
num = 3;
hg21 = g(:,1:num)\yd;%主成分变量的回归方程的系数
hg22 = COEFF(:,1:num)*hg21;%标准化变量的回归方程的系数
hg23 = [mean(y0) - std(y0)*mean(x0)./std(x0)*hg22,std(y0)*hg22'./std(x0)]%计算原始变量的回归方程的系数
rmse1 = sqrt(sum((hg1(1)+x0*hg1(2:end)'-y0).^2)/(m-n))
rmse2 = sqrt(sum((hg23(1)+x0*hg23(2:end)'-y0).^2)/(m-num))

result:
=>
hg1 =
   62.4054    1.5511    0.5102    0.1019   -0.1441
hg23 =
   85.7433    1.3119    0.2694   -0.1428   -0.3801
rmse1 =
    2.4460
rmse2 =
    2.2029
```
后者具有更小的均方误差,因此更稳定.此外,前者所有系数都无法通过显著性检验.