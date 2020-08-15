---
title: 描述性时序分析
categories: 时间序列分析
tags: [描述性时序分析]
date: 2018-10-04 21:25:47
---

早期的时序分析通常都是通过直观的数据比较或绘图观测，寻找序列中蕴涵的发展规律，这种分析方法就称为描述性时序分析。操作简单、直观有效是描述性时间序列分析方法的突出特点。它通常也是人们进行统计时序分析的第一步，通过图示的方法可以直观地反映出序列的特征。

<!-- more -->

## 数据准备

下载数据集 [Daily minimum temperatures in Melbourne](https://datamarket.com/data/set/2324/daily-minimum-temperatures-in-melbourne-australia-1981-1990#)。这个数据集描述了澳大利亚墨尔本市十年（1981-1990）来的最低日温。单位是摄氏度，有3650个观测值。数据的来源是澳大利亚气象局。

尝试使用 `read.table` 将数据读入 R，并存为 `temp_data`。

```r
temp_data <- read.table("daily-minimum-temperatures-in-melbourne.csv", header = TRUE, sep = ",")
```

查看 `temp_data` 内部结构，发现 `temp_data$Date` 为 `Factor` 数据类型，无法直接转换为时间序列，且最低温度的列名较长，可在后续步骤中对以上两点进行修改。

```r
str(temp_data)
```

```r
'data.frame':    3650 obs. of  2 variables:
 $ Date                                                         : Factor w/ 3650 levels "1981/1/1","1981/1/10",..: 1 12 23 26 27 28 29 30 31 2 ...
 $ Daily.minimum.temperatures.in.Melbourne..Australia..1981.1990: num  20.7 17.9 18.8 14.6 15.8 15.8 15.8 17.4 21.8 20 ...
```

对 `Daily.minimum.temperatures.in.Melbourne..Australia..1981.1990` 列重命名为 `MinTemp`。

```r
names(temp_data)[names(temp_data)=="Daily.minimum.temperatures.in.Melbourne..Australia..1981.1990"]="MinTemp"
```

R 语言无法自动将读取的数据转化为时间序列格式，所以利用 R 语言画时间序列图的一个关键步骤就是将读取的数据转变为时间序列格式。

```r
temp_data$Date <- as.Date(temp_data$Date, format='%Y/%m/%d')
```

加载 `xts` 包将 `temp_data` 转换为时间序列的数据类型。

```r
library(xts)
temp_data <- xts(temp_data$MinTemp, temp_data$Date)
```

## 数据可视化

加载 `ggplot2` 包来对 `temp_data` 进行数据可视化。

```r
library(ggplot2)
```

### 时间序列线图

> 时间序列的首选也可能是最流行的可视化方法是线图，即时间显示在 $x$ 轴上，而观察值则沿着 $y$ 轴的。

Q： 试将最低日温数据集直观地可视化为线图的示例。

```r
Date <- index(temp_data)
MinTemp <- temp_data
ggplot(temp_data, aes(Date, MinTemp)) + geom_line()
```

![时间序列线图](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/time-series-analysis-descriptive-analysis-1.png)

从图中可以看出，墨尔本市十年来的最低日温具有明显的周期性波动。

### 时间序列直方图和密度图

> 另一个重要的可视化是关于观察值本身的分布。这意味着一个没有时间顺序仅观测值本身的图像。一些线性时间序列预测方法假定观测值具有良好的分布（即钟形曲线或正态分布）。这可以使用统计假设检验等工具来明确地检查。但是，对于原始观测值和经任何类型的数据转换后的值，图像也能提供对其分布进行有用的初次检查。

Q：试画出最低日温数据集中创建观测值的直方图。

```r
ggplot(MinTemp, aes(MinTemp)) + geom_histogram()
```

![时间序列直方图](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/time-series-analysis-descriptive-analysis-2.png)

从图中可以看出，墨尔本市十年来的最低日温大致服从于正态分布。

### 时间序列区间箱线图

> 直方图和密度图显示了所有观测值的分布情况，但我们可能对一定时间区间内值的分布感兴趣。另一种有助于总结观察值分布的图像是箱线图。可以创建箱线图，并按时间序列（如年，月，日）对每个时间区间进行比较。

Q：试将最低日温数据集按年分组，然后对每年的数据创建一个箱须图像，并排列在一起以直接比较。

加载 `lubridate` 包来获取每一个日期的年份，从而可以进行按年分组。

```r
library(lubridate)
year <- factor(year(Date))
ggplot(temp_data, aes(year, MinTemp)) + geom_boxplot()
```

![时间序列区间箱线图](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/time-series-analysis-descriptive-analysis-3.png)
