---
title: 单链表（2）
categories: 数据结构
tags: [单链表, 归并排序]
date: 2018-09-24 21:00:00
---

在完成上述[单链表的基本操作](./singly-linked-list-1)后，可以利用单链表的特点完成下列操作：

> 创建两个单链表的，排序后，合并成一个有序链表；并实现就地转置（即不利用额外空间实现转置）。

<!-- more -->

因为后面有要求要对有序链表进行合并操作，使其仍然保持有序性，所以根据这一要求采用归并排序。

## 单链表上的归并排序

### 归并操作

首先考虑下如何将将二个有序数列合并，只要从比较二个数列的第一个数，谁小就先取谁，取了后就在对应数列中删除这个数。然后再进行比较，如果有数列为空，那直接将另一个数列的数据依次取出即可。可以看出合并有序数列的效率是比较高的，可以达到 $O(n)$。

```c
// 输入两单链表的头结点，从小到大进行归并后，返回归并后的单链表头结点
Node *merge(Node *head1, Node *head2) {
    Node *head = init();
    int length = 0, a, b;
    // 任一链表为空时，则表示剩余的结点中存储的数据皆比已归并的结点中存储数据大，故可直接拼接
    while (!isEmpty(head1) && !isEmpty(head2))
    {
       // 记录两单链表中首结点存储的数据
       a = selectById(head1, 1);
       b = selectById(head2, 1);
       // a，b两数，谁小谁就插入到新的单链表中，且删除原单链表中结点
       if (a < b) {
         insertById(head, length, a);
         deleteById(head1, 1);
         length++;
       }
       else {
         insertById(head, length, b);
         deleteById(head2, 1);
         length++;
       }
    }
    // 拼接剩余元素
    Node *temp = locationOf(head, length);
    temp->next = isEmpty(head1)?locationOf(head2, 1):locationOf(head1, 1);
    // 释放原先的单链表的头结点所占用的空间
    free(head1);
    free(head2);
    // 返回进行归并操作后的新的单链表
    return head;
}
```

### 归并排序

再来看归并排序，其的基本思路就是将数组分成二组A、B，如果这二组组内的数据都是有序的，那么就可以很方便的将这二组数据进行排序。如何让这二组组内数据有序了？

可以将A、B组各自再分成二组。依次类推，当分出来的小组只有一个数据时，可以认为这个小组组内已经达到了有序，然后再合并相邻的二个小组就可以了。这样通过先递归的分解数列，再合并数列就完成了归并排序。

```c
// 对单链表进行从小到大的归并排序
Node *mergeSort(Node *head) {
    // 当单链表只有一个或没有结点时，可认为已达到组内有序，返回
    if (length(head) == 0 || length(head) == 1)
    {
       return head;
    }
    // 对单链表进行二分，拆分成两个单链表
    Node *middleNode = locationOf(head, length(head) / 2);;
    Node *head2 = init();
    head2->next = middleNode->next;
    Node *head1 = head;
    middleNode->next = NULL;
    // 分别对这两个单链表进行归并排序
    head1 = mergeSort(head1);
    head2 = mergeSort(head2);
    // 对两个已经有序的单链表进行归并操作，合并成一个有序的单链表
    return merge(head1, head2);
}
```

## 单链表上的反转操作

1. 思路一

平常较常使用的是线性顺序表进行存储，不需要考虑怎么进行反转，只需要按照存储地址逆序输出就好。在看到这道题目的第一想法就是，先将其转为顺序表后逆序生成单链表，但本题不允许使用额外空间，故考虑可否把所有结点的前后顺序进行反转。

基于此思路，使用3个指针遍历单链表，逐个结点进行反转。

利用两个结点指针和一个中间结点指针 `next`（用来记录当前结点的下一个结点的位置），分别指向当前结点和前一个结点，每次循环让当前结点的指针字段指向前一个结点即可，翻转结束后，需要为该单链表添加头结点，并释放原来的头结点所占据的内存。

```c
// 对链表进行反转并返回新链表的头结点
// 使用3个指针遍历单链表，逐个结点进行反转
Node *reverse(Node *head) {
    Node *curr = head->next;
    Node *prev = NULL;
    Node *next = NULL;
    while (curr != NULL)
    {
       next = curr->next;
       curr->next = prev;
       prev = curr;
       curr = next;
    }
    // 添加头结点并动态分配内存
    Node *newHead = init();
    newHead->next = prev;
    free(head);
    return newHead;
}
```

2. 思路二

除上一种思路外，还想出了一种思路更加易于理解。

从第 1 个结点到第 N 个结点，依次逐结点插入到头结点之后，即可完成反转。

```c
//对链表进行反转并返回新链表的头结点
//从第 1 个结点到第 N 个结点，依次逐结点插入到头结点之后，即可完成反转
Node *reverse1(Node *head) {
    int l = length(head);
    for (int i = 0; i < l; i++)
    {
       int temp = selectById(head, 1);
       insertById(head, l, temp);
       deleteById(head, 1);
    }
    return head;
}
```

为了方便理解，本方法使用了现成的方法，性能不高，存在较多的重复使用的现象，可以进一步改进。
