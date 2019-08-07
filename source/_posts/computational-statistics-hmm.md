---
title: 计算统计学习笔记：隐式马尔科夫模型
date: 2019-05-21 20:17:16
tags: [计算统计, 隐式马尔科夫模型, Hidden Markov Model]
permlink: computational-statistics-hmm
---

隐马尔可夫模型（Hidden Markov Model；缩写：HMM）或称作隐性马尔可夫模型, 是统计模型, 它用来描述一个含有隐含未知参数的马尔可夫过程.其难点是从可观察的参数中确定该过程的隐含参数.然后利用这些参数来作进一步的分析, 例如模式识别.

在正常的马尔可夫模型中, 状态对于观察者来说是直接可见的.这样状态的转换概率便是全部的参数.而在隐马尔可夫模型中, 状态并不是直接可见的, 但受状态影响的某些变量则是可见的.每一个状态在可能输出的符号上都有一概率分布.因此输出符号的序列能够透露出状态序列的一些信息.

<!--more-->

## 隐式马尔科夫模型的定义

我们考虑这样一个例子：

假设你有一个住得很远的朋友, 他每天跟你打电话告诉你他那天做了什么.你的朋友仅仅对三种活动感兴趣：公园散步, 购物以及清理房间.他选择做什么事情只凭天气.你对于他所住的地方的天气情况并不了解, 但是你知道总的趋势.在他告诉你每天所做的事情基础上, 你想要猜测他所在地的天气情况.

你认为天气的运行就像一个马尔可夫链.其有两个状态“雨”和“晴”, 但是你无法直接观察它们, 也就是说, 它们对于你是隐藏的.每天, 你的朋友有一定的概率进行下列活动：“散步”、“购物”、“清理”.因为你朋友告诉你他的活动, 所以这些活动就是你的观察数据.这整个系统就是一个隐马尔可夫模型（HMM）.

你知道这个地区的总的天气趋势, 并且平时知道你朋友会做的事情.也就是说这个隐马尔可夫模型的参数是已知的.[^1]

![A Simple Hidden Markov Model Example.](https://xn--i0v668g.com/uploads/images/computational-statistics-hmm-example.png)

即：

初始概率分布为： 

$$\pi=\left({0.6},{0.4}\right)'$$

状态转移概率分布为：

$$A=\left(\begin{array}{cc}{0.7}&{0.3}\\{0.4}&{0.6}\end{array}\right)$$

观察概率分布为： 

$$B=\left(\begin{array}{ccc}{0.1}&{0.4}&{0.5}\\{0.6}&{0.3}&{0.1}\end{array}\right)$$

## 观察序列的生成过程

{% note default %}

**算法： 观察序列的生成过程**

输入： 隐式马尔可夫模型 $\lambda=\left(A,B,\pi\right)$ ,  观察序列长度 $T$ ；

输出：观察序列 $O=\left(o_1,o_2,\dots,o_T\right)$ ；

1. 按照初始状态分布 $\pi$ 生成状态 $i_1$
2. 令 $t=1$
3. 按照状态 $i_t$ 的观测概率分布 $b_{i_t}(k)$ 生成 $o_t$
4. 按照状态 $i_t$ 的状态转移概率分布 $\left\{a_{i_ti_{t+1}}\right\}$ 生成状态 $i_{t+1}$
5. 令 $t=t+1$ ； 如果 $t<T$,  转步(3)；否则, 终止

{% endnote %}

所以,  其生成程序如下：

```python
def sample(self, l, trans, emis, statenames=None, symbols=None):
    seq = []
    states = []

    # Trans must be square
    states_num, m = trans.shape
    if states_num != m:
        raise TypeError("BadTransitions.")

    # Number of rows of emis must be same as number of states
    m, emissions_num = emis.shape
    if states_num != m:
        raise TypeError("InputSizeMismatch.")

    if statenames != None and len(statenames) != states_num:
        raise TypeError("BadStateNames.")

    if symbols != None and len(symbols) != emissions_num:
        raise TypeError("BadSymbols.")

    # Create two random sequences, one for state changes, one for emission
    state_change = np.random.rand(1, l)
    rand_vals = np.random.rand(1, l)

    # Calculate cumulative probabilities
    trans_cumsum = np.cumsum(trans, axis=1)
    emis_cumsum = np.cumsum(emis, axis=1)

    # Normalize these just in case they don't sum to 1.
    trans_cumsum = trans_cumsum/trans_cumsum[:,-1][:,None]
    emis_cumsum = emis_cumsum/emis_cumsum[:,-1][:,None]

    # Assume that we start in state 0.
    current_state = 0

    # Main loop 
    for i in range(l):
        # Calculate state transition
        state_val = state_change[:, i]
        state = 0
        for j in range(states_num - 2, -1, -1):
            if state_val > trans_cumsum[current_state, j]:
                state = j + 1
                break
        # Calculate emission
        val = state_change[:, i]
        emit = 0
        for j in range(emissions_num - 2, -1, -1):
            if val  > emis_cumsum[state, j]:
                emit = j + 1
                break

    # Add values and states to output
    seq.append(emit)
    states.append(state)
    current_state = state
    if symbols != None:
        seq = [symbols[i] for i in seq]
    if statenames != None:
        states = [statenames[i] for i in states]
    return seq, states
```

[^1]: [https://en.wikipedia.org/wiki/Hidden_Markov_model](https://en.wikipedia.org/wiki/Hidden_Markov_model)