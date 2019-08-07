---
title: '数据挖掘学习笔记：Basemap地理绘图'
date: 2018-02-18 21:15:37
tags: [数据挖掘, 绘图, Python, Basemap]
permalink: data-mining-basemap
---

在参加MCM/ICM时,发现了一些有趣的Python Package,下面将对其中之一——Basemap进行介绍.Basemap是一个强大的绘制地图工具包,配合matplotlib,可以绘制一些漂亮的地图,通过网上搜集的数据就可以绘制关于人口分布、天气等不同因素在不同地域的分布情况.
<!--more-->

## 安装

### 安装环境

- Windows 10 64位
- Python 3.6.4

### 安装过程

#### 安装 matplotlib

```shell
pip install matplotlib
```

#### 安装 GEOS

```shell
pip install GEOS
```

#### 安装 Basemap

安装Basemap的过程较前两个包安装过程麻烦,大致分为如下两个步骤：

1. 前往[官方网站](https://www.lfd.uci.edu/~gohlke/pythonlibs/#basemap),根据Python版本及操作系统下载Basemap.
2. 在命令行中,跳转目录至所下载的.whl文件目录下,使用`pip`命令进行安装.

大致过程如下：

```shell
E:
E:\>pip install basemap-1.1.0-cp36-cp36m-win_amd64.whl
```

### 参考文章

若安装时出现问题可参考：

- [python如何安装basemap?](https://www.zhihu.com/question/56852267)
- [神农尝百草---Windows环境下为Python3.X安装basemap](http://blog.csdn.net/moxigandashu/article/details/68945845)

## 美国特斯拉充电站分布图

### 数据来源

- [https://www.tesla.com/supercharger](https://www.tesla.com/supercharger)
- [https://www.tesla.com/destination-charging](https://www.tesla.com/destination-charging)

### 程序所使用数据

[下载地址](https://xn--i0v668g.com/uploads/data/TeslaChargerLocations.csv)

### 参考程序

```Python
'''
File: TeslaChargerMap.py
Date: 2018-02-28 16:36:00
Author: Ziyang
Email: meetziyang@gmail.com
Description: Tesla's Chargers in the US. Draw with Basemap and geopy,matplotlib.
'''

from mpl_toolkits.basemap import Basemap
from geopy.geocoders import Nominatim
import matplotlib.pyplot as plt
import numpy
import pandas
import time

map = Basemap(projection='stere',lat_0=90,lon_0=-105,\
    llcrnrlat=23.41 ,urcrnrlat=45.44,\
    llcrnrlon=-118.67,urcrnrlon=-64.52,\
    rsphere=6371200.,resolution='l',area_thresh=10000)

def draw_map():
    map.drawmapboundary()
    map.drawstates()
    map.drawcoastlines()
    map.drawcountries()
    #map.drawcounties() 绘制counties时,会在图例中多出counties,故删去
    parallels = numpy.arange(0.,90,10.)
    map.drawparallels(parallels,labels=[1,0,0,0],fontsize=10) # 绘制纬线
    meridians = numpy.arange(-110.,-60.,10.)
    map.drawmeridians(meridians,labels=[0,0,0,1],fontsize=10) # 绘制经线

def get_locations(filename):
    data = pandas.read_csv(filename)
    [rows,columns] = data.shape
    column_name = data.columns
    for i in range(columns):
        locations = []
        for j in range(rows):
            t = data[column_name[i]][j]
            if pandas.isnull(t):
                break
            locations.append(t)
        draw_scatter(column_name[i],locations)

def draw_scatter(charger_class,charger_location):
    lat = []
    lon = []
    geolocator = Nominatim()
    for i in range(len(charger_location)):
        try:
            time.sleep(.5)
            location = geolocator.geocode(charger_location[i])
            lat.append(location.latitude)
            lon.append(location.longitude)
        except Exception as e:
            print("Location %s not found" % charger_location[i])
            print("Error: %s" % e)
    x,y = map(lon,lat)
    map.scatter(x,y,s=50,alpha=.2,label=charger_class)

def main():
    draw_map()
    get_locations("./TeslaChargerLocations.csv")
    plt.legend()
    plt.title("Tesla's Chargers in the US")
    plt.show()

if __name__ == '__main__':
    main()
```

### 运行结果

![Tesla's Chargers in the US](https://xn--i0v668g.com/uploads/images/Tesla_Chargers_in_the_US.png)