---
title: R语言学习笔记：ggplot2 作品展示
date: 2019-05-22 22:23:01
tags: [R]
permlink: r-ggplot2
---

统计软件编程期末作业 ggplot2 包 作品展示！

## United States Economic Time Series

![United States Economic Time Series](https://xn--i0v668g.com/uploads/images/united_states_economic_time_series.png)

<!--more-->

```R
library(ggplot2)
data(economics)

ggplot(data = economics, aes(x = date, y = psavert)) +
    # 绘制时间序列
    geom_line(color = "#24576D") +
    # 绘制趋势线
    stat_smooth(color = "#FC4E07", fill = "#FC4E07", method = "loess") +
    # 添加标题及图示
    labs(
        x = NULL,
        y = NULL,
        title = "United States Economic Time Series",
        subtitle = "Personal Savings Rate",
        caption = "Sources: U.S. Bureau of Economic Analysis"
    ) +
    # 修改主题样式
    theme_bw() +
    theme(
        panel.spacing = unit(c(-.1, 0.2, .2, 0.2), "cm"),
        panel.border = element_blank(),
        panel.grid = element_blank(),
        panel.grid.major.y = element_line(color = "gray"),
        text = element_text(color = "gray20"),
        axis.text = element_text(face = "italic", size = 11),
        axis.title.x = element_text(face = "italic"),
        axis.title.y = element_text(face = "italic"),
        axis.ticks.y = element_blank(),
        axis.line.x = element_line(color = "gray40", size = 0.5),
        axis.line.y = element_blank(),
        plot.margin = unit(c(.5, .5, .2, .5), "cm"),
        plot.title = element_text(size = 18, face = "bold"),
        plot.subtitle = element_text(size = 12, margin = margin(b = 0.8, t = 0.1, unit = "cm" )),
        plot.caption = element_text(size = 10, hjust = 0.92, margin = margin(t = 0.2, b = 0, unit = "cm"), color = "#939184")
    )
```

## Corruption and Human Development

![Corruption and Human Development](https://xn--i0v668g.com/uploads/images/corruption_and_human_development.png)

所需数据： [hdi-cpi.csv](https://xn--i0v668g.com/uploads/data/hdi-cpi.csv)

```R
# 加载所需包
library(ggplot2)
library(ggrepel)
library(grid)
# 加载数据
dat <- read.csv("./hdi-cpi.csv")
# 更改区域标签
dat$Region <- factor(
    dat$Region,
    levels = c("WE/EU", "AME", "AP", "ECA", "MENA", "SSA"),
    labels = c("OECD", "Americas", "Asia & Oceania", "Central & Eastern Europe", "Middle East & north Africa", "Sub-Saharan Africa"
    )
)
# 计算R^2
mR2 <- summary(lm(HDI ~ CPI + log(CPI), data = dat))$r.squared
mR2 <- paste0(format(mR2 * 100, digits = 2), "%")
ggplot(dat, mapping = aes(x = CPI, y = HDI)) +
    # 添加趋势线
    geom_smooth(mapping = aes(linetype = "r2"), method = "lm",formula = y ~ x + log(x), se = FALSE, color = "red") +
    # 将点更改为空心圆
    geom_point(mapping = aes(color = Region), shape = 1, size = 3, stroke = 1.25) +
    # 标记部分点
    geom_text_repel(
        mapping = aes(label = Country, alpha = labels),
        color = "gray20",
        data = transform(
            dat,
            labels = Country %in% c("Russia", "Iraq", "Afghanistan", "Congo", "Greece", "India", "China", "France", "US", "Germany", "Britain", "Japan", "New Zealand")
        )
    ) +
    # 添加x轴标题,并修改范围及间距
    scale_x_continuous(
        name = "Corruption Perception Index, 2017 (100=least corrupt)",
        limits = c(10.0, 100.0),
        breaks = seq(10.0, 100.0, by = 10.0)
    ) +
    # 添加y轴标题,并修改范围及间距
    scale_y_continuous(
        name = "Human Development Index, 2017 (1=best)",
        limits = c(0.3, 1.0),
        breaks = seq(0.3, 1.0, by = 0.1)
    ) +
    scale_alpha_discrete(range = c(0, 1), guide = FALSE) +
    # 修改标签颜色
    scale_color_manual(
        name = "",
        values = c("#24576D", "#099DD7", "#28AADC", "#248E84", "#F2583F", "#96503F")
    ) +
    # 添加趋势线R^2标签
    scale_linetype(
        name = "",
        breaks = "r2",
        labels = list(bquote(R ^ 2 == .(mR2))),
        guide = guide_legend(
            override.aes = list(linetype = 1, size = 2, color = "red"),
            order = 2
        )
    ) +
    # 添加标题、注释等
    labs(
        title = "Corruption and Human Development",
        caption = "Sources: Transparency International; UN Human Development Report"
        ) +
    # 修改主题样式
    theme_bw() +
    theme(
        panel.spacing = unit(c(-.1, 0.2, .2, 0.2), "cm"),
        panel.border = element_blank(),
        panel.grid = element_blank(),
        panel.grid.major.y = element_line(color = "gray"),
        text = element_text(color = "gray20"),
        axis.text = element_text(face = "italic", size = 11),
        axis.title.x = element_text(face = "italic"),
        axis.title.y = element_text(face = "italic"),
        axis.ticks.y = element_blank(),
        axis.line.x = element_line(color = "gray40", size = 0.5),
        axis.line.y = element_blank(),
        legend.position = "top",
        legend.direction = "horizontal",
        legend.box = "horizontal",
        legend.text = element_text(size = 12),
        plot.margin = unit(c(.5, .5, .2, .5), "cm"),
        plot.caption = element_text(size = 10, hjust = 0.92, margin = margin(t = 0.2, b = 0, unit = "cm"), color = "#939184"),
        plot.title = element_text(size = 22, face = "bold")
    )
```


## Population in America Counties, 2012

![Population in America Counties, 2012](https://xn--i0v668g.com/uploads/images/population_in_america_counties_2012.png)


所需数据： [us_pop.csv](https://xn--i0v668g.com/uploads/data/us_pop.csv)

```R
# 加载所需包
library(ggplot2)
library(viridis)
library(dplyr)
# 加载数据
pop <- read.csv("./us_pop.csv")
counties <- map_data("county")
states <- map_data("state")
counties_pop <- left_join(counties, pop, by = c("region", "subregion"))
# 人为地将pop划分为几个区间
pretty_breaks <- c(10000, 25000, 50000, 75000, 100000)
minVal <- min(counties_pop$pop, na.rm = T)
maxVal <- max(counties_pop$pop, na.rm = T)
labels <- c()
brks <- c(minVal, pretty_breaks, maxVal)
for (idx in 1:length(brks)) {
    labels <- c(labels, round(brks[idx + 1] / 1000, 2))
}
labels <- labels[1:length(labels) - 1]
counties_pop$brks <- cut(
    counties_pop$pop,
    breaks = brks,
    include.lowest = TRUE,
    labels = labels
)
brks_scale <- levels(counties_pop$brks)
labels_scale <- rev(brks_scale)
labels_scale[1] <- ""

ggplot(counties_pop, aes(long, lat, group = group)) +
    # 绘制郡县并以pop进行填充
    geom_polygon(aes(fill = brks))  +
    # 绘制州的边界
    geom_polygon(data = states, colour = "white", fill = NA) +
    # 使地图符合真实比例
    coord_map("polyconic") +
    # 添加标题、注释等
    labs(
        x = NULL,
        y = NULL,
        title = "America's Regional Graphics",
        subtitle = "Population in America Counties, 2012",
        caption = "Sources: American Community Survey (ACS) 5 year estimates"
    ) +
    # 设置图例
    scale_fill_manual(
        values = rev(magma(8, alpha = 0.8)[2:7]),
        breaks = rev(brks_scale),
        name = expression(paste("Population (", 1 %*% 10 ^ 3, ")")),
        drop = FALSE,
        labels = labels_scale,
        guide = guide_legend(
            direction = "horizontal",
            keyheight = unit(2, units = "mm"),
            keywidth = unit(70 / length(labels), units = "mm"),
            title.position = 'top',
            title.hjust = 0.5,
            label.hjust = 1.5,
            nrow = 1,
            byrow = T,
            reverse = T,
            label.position = "bottom"
        )
    ) +
    # 修改主题样式
    theme(
        text = element_text(color = "#22211d"),
        axis.line = element_blank(),
        axis.text.x = element_blank(),
        axis.text.y = element_blank(),
        axis.ticks = element_blank(),
        axis.title.x = element_blank(),
        axis.title.y = element_blank(),
        panel.background = element_rect(fill = "#f5f5f2", color = NA),
        panel.border = element_blank(),
        panel.grid.major = element_line(color = "#ebebe5", size = 0.2),
        panel.grid.minor = element_blank(),
        panel.spacing = unit(c(-.1, 0.2, .2, 0.2), "cm"),
        plot.background = element_rect(fill = "#f5f5f2", color = NA),
        plot.title = element_text(size = 18, face = "bold"),
        plot.subtitle = element_text(size = 12, color = "#4e4d47", margin = margin(b = 0.8, t = 0.1, unit = "cm")),
        plot.caption = element_text(size = 10, color = "#939184", margin = margin(t = 0.2, b = 0, unit = "cm")),
        plot.margin = unit(c(.5, .5, .2, .5), "cm"),
        legend.position = "bottom",
        legend.direction = "horizontal",
        legend.background = element_rect(fill = "#f5f5f2", color = NA)
    )
```