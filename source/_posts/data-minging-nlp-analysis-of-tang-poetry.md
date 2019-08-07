---
title: 数据挖掘学习笔记：初探自然语言处理——词云
tags: [数据挖掘, 自然语言处理, Python, jieba, wordcloud]
date: 2018-05-25 04:32:46
permalink: data-minging-nlp-analysis-of-tang-poetry
---

在做文本数据可视化的时候,词云是一种对词频进行展示的很好的方式,并且在用于制作一些海报推广时,具有较好的展示效果.本文将使用`jieba`与`wordcloud`包对唐诗进行文本分析并生成词云.
<!-- more -->

## 中文分词——`jieba`

> 中文分词(Chinese Word Segmentation) 指的是将一个汉字序列切分成一个一个单独的词.分词就是将连续的字序列按照一定的规范重新组合成词序列的过程.我们知道,在英文的行文中,单词之间是以空格作为自然分界符的,而中文只是字、句和段能通过明显的分界符来简单划界,唯独词没有一个形式上的分界符,虽然英文也同样存在短语的划分问题,不过在词这一层上,中文比之英文要复杂得多、困难得多.

目前而言,比较好用的Python中文分词组件为`jieba`,具有分词、关键词提取、词性标注等多项功能,且安装与使用方法也较为简单,具体使用方法可参考其[说明文档](https://github.com/fxsjy/jieba).

## 词云绘制——`wordcloud`

> 标签云或文字云是关键词的视觉化描述,用于汇总用户生成的标签或一个网站的文字内容.标签一般是独立的词汇,常常按字母顺序排列,其重要程度又能通过改变字体大小或颜色来表现,所以标签云可以灵活地依照字序或热门程度来检索一个标签. 大多数标签本身就是超级链接,直接指向与标签相联的一系列条目.

目前,可以生成词云的软件较多,不过Python中有`wordcloud`库,可进行十分自由的定制化生成且使用方法极为方便,可以自定义颜色以及图片.安装及使用方法可参考其[说明文档](https://github.com/amueller/word_cloud).不过,需要注意的是**wordcloud自身不支持中文词云,需要指定中文字体**

## 实例

### 在Python中导入所需库

```python
import pandas as pd
import numpy as np
import jieba
import jieba.analyse
import matplotlib.pyplot as plt
from wordcloud import WordCloud
```

### 读取数据

使用`pandas`中的`read_csv`读入唐诗数据,并查看数据类型,发现（Title打错了！哈哈哈！）有用数据为`Tittle`,`Author`,`Contents`,故删去其他两列将其作为原始数据.

```python
data = pd.read_csv("/data/jupyter/the_analysis_of_tang_poetry/tangshi.csv")
data.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 42862 entries, 0 to 42861
    Data columns (total 5 columns):
    ID          42862 non-null int64
    No          42862 non-null object
    Tittle      42862 non-null object
    Author      42016 non-null object
    Contents    42861 non-null object
    dtypes: int64(1), object(4)
    memory usage: 1.6+ MB

```python
data.drop(['ID','No'], axis=1,inplace=True)
```

```python
data.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 42862 entries, 0 to 42861
    Data columns (total 3 columns):
    Tittle      42862 non-null object
    Author      42016 non-null object
    Contents    42861 non-null object
    dtypes: object(3)
    memory usage: 1004.7+ KB

### 读取停止词（Stop Words）

> 在信息检索中,为节省存储空间和提高搜索效率,在处理自然语言数据（或文本）之前或之后会自动过滤掉某些字或词,这些字或词即被称为Stop Words(停用词).

```python
stopwords = []
with open("/data/jupyter/the_analysis_of_tang_poetry/stopwords.txt") as file:
    for word in file.readlines():
        stopwords.append(word.strip())
```

### 中文分词及词云绘制

#### 采用频率来作为权重

首先,考虑最简单的形式,即在分词后,对每一个词语的出现次数作为其权重,来进行排序,并据此生成词云.

```python
def draw_wordcloud_by_counts(columns_name, head):
    contents = " ".join(list(data[columns_name].dropna()))
    words = jieba.lcut(contents)
    clear_words = []
    for word in words:
        if (word not in stopwords) & (word != ' '):
            clear_words.append(word)
    frequencies = {}
    for word in clear_words:
        if len(word) == 1:
            continue
        else:
            frequencies[word] = frequencies.get(word,0) + 1
    items = list(frequencies.items())
    items.sort(key=lambda x:x[1], reverse=True)
    for i in range(head):
        word, count = items[i]
        print ("%s,%d"%(word, count))
    font_path = "/data/jupyter/the_analysis_of_tang_poetry/qingke.ttf"
    wordcloud = WordCloud(background_color='white',font_path=font_path, width=1920, height=1080, margin=5).generate_from_frequencies(frequencies)
    plt.imshow(wordcloud)
    plt.axis("off")
    plt.show()
```

```python
for columns in ['Author', 'Tittle', 'Contents']:
    draw_wordcloud_by_counts(columns, 20)
```

    白居易,2640
    杜甫,1151
    李白,891
    齐己,772
    刘禹锡,704
    元稹,593
    李商隐,554
    韦应物,549
    贯休,539
    陆龟蒙,519
    刘长卿,506
    皎然,502
    杜牧,485
    许浑,482
    罗隐,469
    张籍,463
    姚合,458
    钱起,422
    贾岛,406
    司空,405

![png](https://xn--i0v668g.com/uploads/images/data-minging-nlp-analysis-of-tang-poetry-1.png)

    一作,1372
    二首,1123
    乐章,598
    曲歌辞,547
    使君,516
    郎中,514
    员外,506
    应制,478
    相公,416
    歌辞,390
    友人,390
    郊庙,387
    处士,379
    春日,354
    秀才,333
    三首,313
    少府,304
    侍郎,302
    中丞,302
    长安,267

![png](https://xn--i0v668g.com/uploads/images/data-minging-nlp-analysis-of-tang-poetry-2.png)

    不知,1287
    万里,1235
    春风,1066
    今日,1065
    白云,1010
    千里,984
    不见,816
    人间,810
    无人,770
    明月,758
    惆怅,754
    故人,719
    秋风,706
    悠悠,675
    相思,640
    长安,637
    青山,627
    何人,617
    白日,590
    相逢,585

![png](https://xn--i0v668g.com/uploads/images/data-minging-nlp-analysis-of-tang-poetry-3.png)

#### 采用TF/IDF作为权重

使用各个词语的出现次数来表示每一个词语的权重,显然考虑不全面,如一些日常用语,如“的”等会占较大的权重,而其并不能代表每一句话的意思,在此基础上,我们可采用TF/IDF方法来对其权重进行降权,进而所获取的权重,更能反映作者所要强调的重点.关于TF/IDF可参考我的前面的文章[TF/IDF](https://xn--i0v668g.com/post/TF-IDF/).

```python
def draw_wordcloud_by_TFIDF(columns_name, head):
    contents = " ".join(list(data[columns_name].dropna()))
    words = jieba.lcut(contents)
    clear_words = []
    for word in words:
        if (word not in stopwords) & (word != ' '):
            clear_words.append(word)
    words_length = len(set(clear_words))
    frequencies = jieba.analyse.extract_tags(" ".join(clear_words), topK=words_length, withWeight=True)
    for i in range(head):
        word, count = frequencies[i]
        print ("%s,%f"%(word, count))
    frequencies = dict(frequencies)
    font_path = "/data/jupyter/the_analysis_of_tang_poetry/qingke.ttf"
    wordcloud = WordCloud(background_color='white',font_path=font_path, width=1920, height=1080, margin=5).generate_from_frequencies(frequencies)
    plt.imshow(wordcloud)
    plt.axis("off")
    plt.show()
```

```python
for columns in ['Author', 'Tittle', 'Contents']:
    draw_wordcloud_by_TFIDF(columns, 20)
```

    Building prefix dict from the default dictionary ...
    Loading model from cache /tmp/jieba.cache
    Loading model cost 1.002 seconds.
    Prefix dict has been built succesfully.


    白居易,0.600109
    杜甫,0.258726
    齐己,0.230623
    李白,0.201996
    刘禹锡,0.181996
    贯休,0.161018
    皎然,0.156985
    韦应物,0.156611
    刘长卿,0.151160
    元稹,0.149251
    许浑,0.143990
    陆龟蒙,0.143536
    李商隐,0.139435
    罗隐,0.138542
    姚合,0.129736
    张籍,0.128750
    钱起,0.126066
    杜牧,0.124069
    孟郊,0.113873
    贾岛,0.112284

![png](https://xn--i0v668g.com/uploads/images/data-minging-nlp-analysis-of-tang-poetry-4.png)

    一作,0.151809
    二首,0.111623
    曲歌辞,0.062945
    乐章,0.053482
    使君,0.048822
    应制,0.047716
    员外,0.044117
    歌辞,0.042871
    郊庙,0.042542
    郎中,0.039679
    处士,0.037517
    春日,0.033967
    友人,0.033059
    三首,0.031111
    少府,0.029859
    相公,0.029687
    中丞,0.029157
    侍御,0.027923
    留别,0.025653
    和歌,0.024977

![png](https://xn--i0v668g.com/uploads/images/data-minging-nlp-analysis-of-tang-poetry-5.png)

    万里,0.012060
    春风,0.011225
    白云,0.010207
    千里,0.009250
    惆怅,0.008384
    故人,0.007841
    不知,0.007672
    明月,0.007672
    秋风,0.007518
    人间,0.007161
    相思,0.007124
    悠悠,0.007103
    青山,0.006776
    无人,0.006353
    今日,0.006335
    白日,0.006307
    相逢,0.006301
    何人,0.006091
    不见,0.006011
    日暮,0.005614

![png](https://xn--i0v668g.com/uploads/images/data-minging-nlp-analysis-of-tang-poetry-6.png)

## 总结及思考

首先,先对所得结果进行分析,我们可以从中发现

- 作者： 白居易在所给的数据中,较其他诗人写出了更多的作品.
- 标题：在标题中,除了表达同一类型的诗歌数量（一作,二首,三首）、诗歌类型（曲歌辞、乐章）外,多包括诗歌的赠与人（应制、员外、少府）、创作目的（留别、和歌）、诗歌的创作地址（郊庙）、创作时间（春日）等.
- 内容：多为一些意象及形容词等,所表达的多为离别之情、思乡之情？（原谅我！我真的很久没有做过古诗词鉴赏题了！我大概是个废人了）

其次,TF/IDF更能够抓住作品的重点;

最后,思考一下如何对文本进行分析,本文所进行的只是一个最简单的分词及统计,如果我们是要往后面做呢？我们应该怎么做？我思考了一下,可以有以下改进方向：

- 诗词的情感方向
- 诗词的平仄韵脚
- 诗词的词性分析

如果,以后有空的话,再继续改吧！我先认认真真准备期末考试叭！