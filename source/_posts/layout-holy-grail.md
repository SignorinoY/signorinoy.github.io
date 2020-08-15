---
title: 圣杯布局
categories: 折腾
tags: []
date: 2017-10-31 21:22:28
---

圣杯布局是典型的 Css 布局问题，有着众多的解决方案。最早的完美实现是来自于 Matthew Levine 的 ["In Search of the Holy Grail"](https://alistapart.com/article/holygrail)，它主要讲述了圣杯布局的最佳实现方法。而现在的最佳解决方法为使用 flex 实现。

圣杯布局具有如下优点：

- 主要内容先加载的优化。
- 兼容目前所有的主流浏览器。
- 实现不同的布局方式，可以通过调整相关 Css 属性即可实现。

<!--more-->

## 圣杯布局的传统实现

在 Matthew Levine 的 ["In Search of the Holy Grail"](https://alistapart.com/article/holygrail)中，作者指出了当时的一些实现方式所存在的问题，如：必须按照源顺序（在 DOM 中表现为先写 Left，然后 Middle，最后，Right）等，它将可能导致代码不够灵活，尤其是从 DOM 的载入顺序上来说，中间的内容不能被首先加载。因此他给出一个方案，它将：

- 两边带有固定宽度中间可以流动（fluid）。
- 允许中间一栏最先出现。
- 允许任意一栏放在最上面。
- 仅需一个额外的 `div` 标签。
- 仅需非常简单的 Css，带上最少的兼容性补丁。

```html
<body>
    <div id="header">This is the header.</div>
    <div id="container">
        <div id="center" class="column"></div>
        <div id="left" class="column"></div>
        <div id="right" class="column"></div>
    </div>
    <div id="footer">This is the footer.</div>
</body>
```

```css
body {
    min-width: 550px;        /* 2x LC width + RC width */
}
#container {
    padding-left: 200px;     /* LC width */
    padding-right: 150px;    /* RC width */
}
#container .column {
    height: 200px;
    position: relative;
    float: left;
}
#center {
    background-color: #e9e9e9;
    width: 100%;
}
#left {
    background-color: red;
    width: 200px;                    /* LC width */
    right: 200px;                    /* LC width */
    margin-left: -100%;
}
#right {
    background-color: blue;
    width: 150px;                    /* RC width */
    margin-right: -150px;    /* RC width */
}
#footer {
    clear: both;
}
#header,
#footer {
    background-color: #c9c9c9;
}
/*** IE6 Fix ***/
* html #left {
    left: 150px;                     /* RC width */
}
#footer {
    clear: both;
}
```

[Source Code](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/files/layout-holy-grail-example1.html)

### 美化及实现等高列

见["In Search of the Holy Grail"](https://alistapart.com/article/holygrail)

[Source Code](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/files/layout-holy-grail-example2.html)

## 圣杯布局的flex实现

圣杯布局由页头（header），中间部分（center），页脚（footer），和三栏组成。中间的一栏是主要内容，左边和右边提供如广告、导航的链接。大部分的 Css 解决方案都是以下列为目标：

- 边栏应流动居中，定宽
- 中间一栏（主要内容）在 HTML 源码中应该首先元素出现
- 所有栏同高，忽略实际高度
- 使用的 HTML 标记尽量少
- 当页面内容不够充满页面时，页脚应 “粘” 在底部

不幸的是，这些自然的需求由于原生 Css 的限制，当前经典的圣杯布局的解决方案都不能完美满足以上所有的要点。有了 Flexbox 布局，终极的解决方案终于成为可能。

```html
<body class="HolyGrail">
    <header></header>
    <div class="HolyGrail-body">
        <main class="HolyGrail-content"></main>
        <nav class="HolyGrail-nav"></nav>
        <aside class="HolyGrail-ads"></aside>
    </div>
    <footer></footer>
</body>
```

让中间部分撑开并让页脚粘在底部的方法使用了粘性页脚中相同的技术。唯一的不同点是，圣杯布局的中间部分（`.HolyGrail-body`）需要指定 `display:flex` 来控制子元素的布局。

```css
header,footer {
    flex: 0 0 50px;
    background: #ccc;
}
.HolyGrail {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
}
.HolyGrail-body {
    display: flex;
    flex: 1;
}
.HolyGrail-content {
    flex: 1;
    background: #4DBCB0;
}
.HolyGrail-nav,
.HolyGrail-ads {
    flex: 0 0 12em;
    background: #daf1ef;    /* 12em is the width of the columns */
}
.HolyGrail-nav {
    order: -1;    /* put the nav on the left */
}
```

[Source Code](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/files/layout-holy-grail-example3.html)

### 响应式

圣杯布局来自于每个人都使用个人计算机冲浪的互联网时期的网页设计，但是随着移动设备的激增，圣杯布局已渐渐没落。另一方面，使用 Flexbox 布局，创建一个移动设备优先和移动设备友好版本的圣杯布局很简单。其主旨就是把中间的部分默认指定为 `flex-direction:column`，然后为拥有更宽屏幕的设备指定 `flex-direction:row` 。

```css
.HolyGrail,
.HolyGrail-body {
    display: flex;
    flex-direction: column;
}
.HolyGrail-nav {
    order: -1;
}
@media（min-width: 768px）{
    .HolyGrail-body {
        flex-direction: row;
        flex: 1;
    }
    .HolyGrail-content {
        flex: 1;
    }
    .HolyGrail-nav, .HolyGrail-ads {
        /* 12em is the width of the columns */
        flex: 0 0 12em;
    }
}
```
