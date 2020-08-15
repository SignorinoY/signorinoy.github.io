---
title: 约瑟夫环
categories: 数据结构
tags: [单链表]
date: 2018-10-12 12:25:50
---

约瑟夫Joseph)问题的一种描述是：编号为 $1,2,\dots,n$ 的 $n$ 个人按顺时针方向围坐一圈，每人持有一个密码（正整数）。一开始选任一个正整数作为报数上限值 m，从第一个人开始按顺时针方向自1开始顺序报数，报到 m 时停止报数。报 m 的人出列，将它的密码作为新的 m 值，再从下个人开始新一轮报数，如此反复，直到剩下最后一人则为获胜者。试设计一个程序求出出列顺序。

<!-- more -->

- 测试数据
  - **Input:** n = 7, m0 = 20, password = 3 1 7 2 4 8 4
  - **Output:** 6 1 4 7 2 3 5
- 输入输出
  - 输入：输入 n 输入以及每个人的密码；m 的初值
  - 输出：按照出列的顺序印出各人的编号

## 问题分析

为解决该问题，需利用单向循环链表存储结构模拟此过程。

> 单向循环链表也称为环形链表，其结构与单链表相似，只是将单链表的首尾相连，即将单链表的最后一个结点的后继指针指向第一个结点，从而构成一个环状链表。

## 程序源码

```c
#include<stdio.h>
#include<stdlib.h>

typedef int Elemtype;

typedef struct Node {
    Elemtype index;
    Elemtype password;
    Node *next;
};

Node *create(int len,Elemtype password[]) {
    Node *prev,*head,*temp;
    for (int i = 1; i <= len; i++)
    {
    temp = (Node*)malloc(sizeof(Node));
    if (temp == NULL) {
    printf("Error - unable to allocate required memory\n");
    exit(-2);
    }
    temp->index = i;
    temp->password = password[i - 1];
    if (i == 1)
    head = temp;
    else
    prev->next = temp;
    prev = temp;
    }
    temp->next = head;
    return head;
}


void display(Node *head) {
    Node *temp = head;
    while (temp->next != head) {
    printf("%d ",temp->index);
    temp = temp->next;
    }
    printf("\n");
}

void josephus_problem(int n,int m0,int password[]) {
    Node *head = create(n,password);
    Node *temp = head,*prev;
    int len = n,m = m0;
    while (len != 0){
    m = m == len ? m % len : m;
    if (m > 1){
    for (int i = 1; i < m - 1; i++)
    temp = temp->next;
    prev = temp;
    temp = temp->next;
    }
    printf("%d ",temp->index);
    m = temp->password;
    temp = temp->next;
    prev->next = prev->next->next;
    len--;
    }
}

int main()
{
    int password[1000],m0,n;
    scanf("%d",&n);
    scanf("%d",&m0);
    for (int i = 0; i < n; i++)
    scanf("%d",&password[i]);
    josephus_problem(n,m0,password);
}
```
