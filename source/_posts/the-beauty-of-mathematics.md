---
title: 《数学之美》
categories: 读书笔记
tags: []
date: 2020-03-21 09:47:36
---

本文讲述数学如何应用于互联网行业，改变人们的日常生活，集中阐述了作者对数学和信息处理这些专业学科的理解。主要围绕作者所从事的工作——搜索引擎进行展开，包括以下几个方面：

- 自然语言处理
- 搜索引擎
- 其他数学模型
- 数学建模思想

本书未泛泛而谈数学于生活的意义，而是通过一个个应用并改变生活的实例，说明本科阶段所学的各种基础数学理论知识并非枯燥无用，而是可以实实在在解决现实问题的。本书并未通过通篇的数学公式来解释问题，而是以一种科普的方式通过具体的例子使读者学到如何用数学去思考、去解决问题，如何跳出固有的思维去创新，同时为想要进一步钻研的人以参考文献和延伸阅读的形式留了足够的思考深度。
<!--more-->

## 思维导图

![思维导图](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/the-beauty-of-mathematics-mind-map.png)

## 原文摘录

基于统计的自然语言处理方法，在数学模型上和通信是相通的，甚至就是相同的。因此，在数学意义上自然语言处理又和语言的初衷——通信联系在一起了。但是，科学家们认识到这个联系却花了几十年的时间。

古德-图灵估计（Good-Turing Estimate）：对于没有看见的事件，我们不能认为它的发生概率就是零，因此我们从概率的总量中，分配一个很小的概率给予这些没有看见的事件。这样一来，看见的时间的概率总和就要小于 1 了。至于小多少，要根据“越是不可信的统计折扣越多”的方法进行。

- 训练语料和模型应用的领域须保持一致，以减少噪音。
- 语料数据通常是越多越好，可以利用平滑过渡方法解决小/零概率事件。
- 最好能预处理能具有规律的、量比较大的噪音。

信息是消除系统不确定性的唯一办法。
合理利用信息，而不是玩弄什么公式和机器学习算法，是做好搜索的关键。

在计算机科学领域，一个好的算法应该像 AK-47 冲锋枪那样：简单、有效、可靠性好且容易读懂（或者说易操作），而不应该是故弄玄虚。

先解决 80% 的问题，再慢慢解决剩下的 20% 问题。一开始就追求大而全的方案，到最后大多不了了之。

选取简单方案的一个原因在于易于解释每一步骤和方法背后的道理，便于差错和找到今后改进目标。在改进时要知其所以然，说不清理由的改进，即使看上去有效也不应采用，否则将来可能成为隐患。

1. 一个正确的数学模型应当在形式上是简单的。
2. 一个正确的模型一开始可能还不如一个精雕细琢过的错误模型来的准确，但是，如果我们认定大方向是对的，就应该坚持下去。
3. 大量准确的数据对研发很重要。
4. 正确的模型也可能受噪音干扰，而显得不准确; 这时不应该用一种凑合的修正方法来弥补它，而是要找到噪音的根源，这也许能通往重大的发现。

## 读后感

### 数学到底有什么用

数学这门学科经过几千年的抽象化，与我们的日常生活似乎是渐行渐远，很多人在大学中所学的数学在毕业后难以有机会去应用，对于数学的印象可能只剩下抽象的数字、符号、公式和定理。

其实，数学的用途远超人们的想象，甚至可以说数学在生活中无处不在。不止在与日常生活联系较少的原子能和航天领域应用到大量的数学知识，更在我们天天用到的产品和技术，其背后也蕴藏着支持他们的数学基础。对于本科学习统计的我来说，在了解到《数学之美》前也是如此，难以想象本科所学到的数理知识竟可以通过如此一种巧妙的转换应用于实际解决一个又一个初看似乎无法解决的问题。

数学可以用一些通用的模型来描述一些看似不同的实际问题，并能够给出非常漂亮的解决方法。比如，在语音识别、机器翻译和自然语言处理等领域中，虽然人类的语言有成百上千种，但处理它们的数学模型却是相同的或相似的。

这种在不同问题上方法的一致性似乎可以回答“数学到底有什么用？”这个问题，**数学可以让我们抓住做事的规律**，数学能够帮助我们发现仅凭经验无法发现的规律，找到仅凭经验无法总结出来的方法。

### 数学之美即简单之美

在这本书中，除了具体到问题的数学模型以及相关知识外，给予我最深印象的就是作者所提到的数学模型本身的高度简洁及具有概括力，一个极为复杂的现象也可以用一个简单的数学模型来进行描述（虽然数学实际应用起来可能比较复杂，但其背后所蕴含的思想却是相对简单的）。

无数科学理论无不是沿着这个方向进行发展。比如说，如何描述天体的运动轨迹，从两千多年前托勒密所提出的地心说——通过 40 - 60 个小圆套大圆的方法计算出所有行星的运动轨迹，到哥白尼提出由 8 - 10 个圆描述行星运动的日心说，再到开普勒提出的三个定律，仅需要一个椭圆就可以将星体的运动规律描述清楚。正如爱因斯坦所说：“从希腊哲学到现代物理学的整个科学史中，不断有人力图把表面上极为复杂的自然现象归结为几个简单的基本概念和关系。”我非常羡慕这些可以将“简单”哲学贯彻到底的人，能将复杂的问题一步步简化，并在实用性和完备性中找到那个完美的中间点。

在生产领域也同样应该追求这种简单之美。在实际解决问题的时候，有时候靠瞎凑也能够得到一个凑合可用的结果，但长期来看维护这些瞎凑搭起来的东西代价非常巨大，不仅结构混乱丑陋，而且由于说不清瞎凑背后的道理，在以后的修改维护时也根本无从下手；反之，如果从更高的数学模型层面去抽象问题，去寻找一个正确的模型框架，就可以有条理地慢慢去填充细节，逐渐达到完善。这样的解决方案不仅能达到需求，而且结构清晰道理明了，便于日后的维护和修正。正如作者在后记里是这样说明他的写作意图的：“我更希望让做工程的年轻人看到信息技术行业正确的做事情的方法。”

### 追求简单有效的解决方法

在作者对美国工程院士阿米特·辛格博士的介绍中，提到了这样一种处世原则——追求简单有效的解决方法。

这种做事情的原则十分值得我们借鉴，即先帮用户解决主要的问题，再决定要不要纠结在次要的部分上；要知道修改代码的所作所为，知其所以然；能用简单方法解决就用简单的，可读性很重要。正如一个漂亮的 PageRank 矩阵乘法迭代加上一个 TF-IDF 公式，就可以大程度地改善搜索结果的质量，无一不体现出简单即是美的特点。许多失败并不是因为人不优秀，而是做事情的方法不对，一开始追求大而全的解决方案，之后长时间不能完成，最后不了了之。
