---
title: 数据分析（Python） 第二周课后作业
date: 2018-03-07 20:12:13
tags:
- Python
- 绘图
- 数据分析
permalink: building-a-high-performance-expandable-Asp-Net-website2
---
## 问题描述

### 数据说明

> 下面是个嵌套列表,每个元素表示1个学生,例如[1,90]表示一个学生,1表示python班级,90表示分数.
### 数据分析任务

> 统计每个班级的平均分数.
基于分析结果,给出您的判断：老师同时教授4个班级,是否班级越靠后,教学效果越好？


<!--more-->
## 分析过程

### 数据预处理


```python
import numpy as np
import pandas as pd

t = [[],[],[],[]]
pre_data = ...
for i in pre_data:
    t[i[0]-1].append(i[1])
data = pd.DataFrame(t).T
data.columns = ['A', 'B', 'C', 'D']
data.head()
```

| |A|B|C|D|
|:-:|:-:|:-:|:-:|:-:|
|0|90.0|13.0|90.0|87.0|
|1|78.0|67.0|94.0|71.0|
|2|61.0|82.0|99.0|76.0|
|3|56.0|32.0|51.0|78.0|
|4|82.0|88.0|61.0|84.0|

### 数据描述

调用pandas内置函数describe(),获取各个班级的统计特性进行描述.


```python
data.describe()
```

||A|B|C|D|
|:-:|:-:|:-:|:-:|:-:|
|count|54.000000|61.000000|60.000000|59.000000
|mean|78.629630|78.393443|81.783333|79.322034
|std|11.621867|15.914646|10.410379|12.747469
|min|53.000000|13.000000|51.000000|49.000000
|25%|71.500000|73.000000|74.750000|69.000000
|50%|80.000000|83.000000|84.000000|82.000000
|75%|87.750000|87.000000|89.250000|90.000000
|max|99.000000|100.000000|100.000000|98.000000


### 数据可视化

#### 箱线图

绘制各个班级的箱线图.


```python
import matplotlib.pyplot as plt
import seaborn as sns
```


```python
data.boxplot()
plt.xlabel("Class")
plt.ylabel("Score")
plt.ylim(0,100+1)
plt.show()
```

![png](https://xn--i0v668g.com/images/python_data_analysis_1.png)

#### 频率分布直方图

绘制各个班级的频率分布直方图.


```python
for i in range(len(data.columns)):
    df = data.iloc[:,i].dropna()
    sns.distplot(df,label='Class '+data.columns[i])
plt.xlim(0,100)
plt.xlabel("Class")
plt.ylabel("Frequency")
plt.legend()
plt.show()
```
![png](https://xn--i0v668g.com/images/python_data_analysis_3.png)


#### 百分比柱状堆积柱形图

按照成绩的不同,划分为四个等级,计算各个班级不同等级的占比,并绘制出百分比堆积柱形图.划分标准如下：

85分及以上算优秀,75分及以上算良好,60分及以上算及格,以下为不及格.


```python
level = []
for i in range(len(data.columns)):
    df = data.iloc[:,i].dropna()
    count = len(df)
    o = len(df[df>=85])
    g = len(df[(df<85)&(df>=75)])
    f = len(df[df<60])
    p = count - o - g - f
    level.append([o/count,g/count,p/count,f/count])
level_df = pd.DataFrame(level,columns=['Outstanding', 'Good', 'Pass', 'Fail'],index=['A','B','C','D'],)
print(level_df)
level_df.plot(kind='bar',stacked=True)
plt.show()
```


![png](https://xn--i0v668g.com/images/python_data_analysis_2.png)

### 单因素方差分析

单因素方差分析是用来研究一个控制变量的不同水平是否对观测变量产生了显著影响.这里,由于仅研究单个因素对观测变量的影响,因此称为单因素方差分析.
例如,分析不同施肥量是否给农作物产量带来显著影响,考察地区差异是否影响妇女的生育率,研究学历对工资收入的影响等.这些问题都可以通过单因素方差分析得到答案.


```python
from scipy import stats
```

首先进行levene test,如果p小于0.05,就警告方差不齐.


```python
args = [data['A'].dropna(),data['B'].dropna(),data['C'].dropna(),data['D'].dropna()]
print(stats.levene(*args))
```

    LeveneResult(statistic=0.8790130201996657, pvalue=0.4526504712461912)
    

对数据进行方差分析.


```python
print(stats.f_oneway(*args))
```

    F_onewayResult(statistic=0.8629218341297421, pvalue=0.4610267146483309)
    

P值为0.46,即碰巧出现的可能性大于46%,差别无显著意义.即教学顺序的先后与教学质量没有关系.
