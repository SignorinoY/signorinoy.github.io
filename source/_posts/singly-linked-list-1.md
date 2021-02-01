---
title: 单链表（1）
categories: 数据结构
tags: [单链表]
date: 2018-09-23 21:02:01
---

单向链表（又名单链表、线性链表）是链表的一种，其特点是链表的链接方向是单向的，对链表的访问要通过从头部开始，依序往下读取。

![单链表，其结点包含两个字段：整数值和指向下一个结点的指针](https://signorinoy.oss-cn-beijing.aliyuncs.com/upload/images/singly-linked-list.png)

<!-- more -->

- 线性表的链式存储结构的特点是用一组任意的存储单元存储线性表中的数据元素，这组存储单元可以存放在内存中未被占用的任意位置。
- 相比顺序存储结构，链式存储结构中，除了需要存储数据元素信息之外，还需要存储它的后继元素的存储地址（指针）。
- 如果链表的每个结点中只包含一个指针域，那就叫做单链表。

单链表具有如下优点：

- 动态大小
- 易于插入与删除

同时，也具有如下缺点：

- 不允许随机访问，我们必须从第一个结点开始按顺序访问元素。
- 每个元素都需要额外的指针内存空间。

## 单链表的表示

结点构造 <--> 数据字段 + 指针字段

- 数据字段：元素自身信息
- 指针字段：指明本元素的直接后继（存储）位置

链表由指向链表的第一个结点的指针来进行唯一表示。

第一个结点称为 `head`。有时为了操作方便，第一个结点的数据字段一般不存放具体的值，指针字段存放指向下一个结点的指针。如果链表为空，则 `head` 的指针字段为空指针 `NULL`。

> （本文所写的单链表也是带头结点的单链表）

单链表中的最后一个结点由于没有后继，所以它的指针字段为空指针 `NULL`。

```c
typedef struct Node {
    Elemtype data;
    Node *next;
}
```

## 单链表的初始化操作

创建一个空结点作为头结点，只记录下一个结点的地址，方便后面进行插入与删除操作，并返回头结点地址作为该链表的唯一标识。

```c
// 初始化链表，返回其头结点地址
Node *init() {
    // 创建头结点并动态分配内存
    Node *head = (Node*)malloc(sizeof(Node));
    // 若分配内存失败则报错
    if (head == NULL) {
       printf("Error - unable to allocate required memory\n");
       exit(-2);
    }
    // 初始化头结点，使数据字段与指针字段皆为 NULL
    head->data = NULL;
    head->next = NULL;
    // 返回头结点地址
    return head;
}
```

## 查看单链表结点地址

无论是进行插入、删除、修改、查看都需要知道其进行操作的结点的地址，故将其抽象成一个函数。

由于单链表的存储空间不连续，所以它不能像顺序表那样通过位序号来定位其存储地址。

单链表是一种顺序存储的结构，即要取第 index 个结点的值，只能从头指针所指的结点开始沿着指针字段依次进行查找。若查询第 0 个结点，即头结点，则不进行遍历，直接返回头结点；若不是头结点，则需进行遍历并判断该结点是否存在。

```c
// 返回第 index 个结点的地址，若不存在则报错
Node *locationOf(Node *head, int index) {
    // 创建临时结点以遍历链表
    Node* temp = head;
    if (index != 0)
    {
       for (int i = 0; i < index; i++) {
         if (temp == NULL) {
          // 判断插入位置是否有效(位置是否超过单链表长度）
          printf("Error - wrong location\n");
          exit(-1);
         }
         // 指向下一个结点
         temp = temp->next;
       }
    }
    // 返回第 index 个结点的地址
    return temp;
}
```

## 单链表上的插入操作

首先需查询要插入的地址是否存在，若存在，则为新建的结点动态申请内存空间，然后将新建结点添加到链表中。

```c
// 在第 index 个结点后插入结点
void insertById(Node *head, int index, Elemtype elem) {
    // 获得第 index 个结点的地址
    Node* temp = locationOf(head, index);
    // 创建新的结点 c
    Node *c = (Node*)malloc(sizeof(Node));
    // 若分配内存失败则报错
    if (c == NULL) {
       printf("Error - unable to allocate required memory\n");
       exit(-2);
    }
    // 插入新的结点
    c->data = elem;
    // 新的结点连接原结点的后继结点
    c->next = temp->next;
    // 原结点连接新的结点
    temp->next = c;
}
```

## 单链表上的删除操作

查询要删除结点的前驱结点的地址，并判断要删除结点是否存在，若存在，则记录要删除结点的后继结点的地址，将前驱结点的指针字段指向后继结点的地址；若不存在，则跳出。

结点被删除后，只表示将它从链表中断开而已，它仍占用着内存，必须要释放这个内存，否则会出现内存泄漏。

```c
// 删除第 index 个结点
void deleteById(Node *head, int index) {
    // 获取第 index 个结点前驱结点的地址
    Node *temp1 = locationOf(head, index - 1);
    // 记录第 index 个结点的地址供释放空间用
    Node *temp2 = temp1->next;
    // 若第 index 个结点不存在,则函数结束
    if (temp2 == NULL)
       return;
    // 将第 index 个结点的前驱指点的指针指向其后继结点
    temp1->next = temp2->next;
    // 释放第 index 个结点的内存空间
    free(temp2);
}
```

## 单链表上的更新操作

获取第 index 个结点的地址，若存在则修改该结点所存储的数据。

```c
// 更新第index个结点
void updateById(Node *head, int index, Elemtype elem) {
    // 获取第 index 个结点的地址
    Node* temp = locationOf(head, index);
    // 修改第 index 个结点的值
    temp->data = elem;
}
```

## 单链表上的查找操作

1. 按序号查找

获取第 index 个结点的地址，若存在则返回该结点所存储的数据。

```c
// 查看第 index 个结点并返回其值
Elemtype selectById(Node *head, int index) {
    // 获取第 index 个结点的地址
    Node* temp = locationOf(head, index);
    // 返回第 index 个结点的值
    return temp->data;
}
```
2. 按值查找

为获取该单链表上第一个与给定值 `elem` 相同的结点，从该单链表的头结点开始沿着后继指针一次对各结点的数据字段与 `elem` 进行比较，直到找到数据字段为 `elem` 的结点或到达该单链表的标为为止。

```c
// 按值进行查找，若存在则返回其 index，不存在返回 -1
int indexOf(Node *head, Elemtype elem) {
    int index = 0;
    // 创建临时结点以遍历链表
    Node *temp = head;
    // 从头结点开始查找,直到 temp->data 为 elem 或到达链表的结尾
    while (temp != NULL && temp->data != elem)
    {
       // 指向下一个结点
       temp = temp->next;
       // 计数器增加1
       index++;
    }
    // 若 elem 在结点中，则返回其在单链表中的位置；若不存在，则返回 -1
    if (temp != NULL)
       return index;
    else
       return -1;
}
```

## 单链表上的清空操作

清空单链表，从首结点开始，先记录其后继结点的地址，后释放该结点的内存，后重复进行，直至到达尾结点为止。最后需将头结点的指针字段指向 `NULL`。

```c
// 清空该链表
void clear(Node *head) {
    Node *p, *q;
    // 从头结点开始查找
    p = head->next;
    while (p)
    {
       // 记录其后继结点
       q = p->next;
       // 释放该结点内存空间
       free(p);
       // 将后继结点赋值给 p
       p = q;
    }
    // 使头结点的指针指向 NULL
    head->next = NULL;
}
```

## 单链表上的输出操作

```c
// 输出该链表
void display(Node *head) {
    // 创建临时结点以遍历链表
    Node *temp = head;
    // 只要temp有后续结点就输出
    while (temp->next) {
       // 指向下一个结点
       temp = temp->next;
       printf("%d ", temp->data);
    }
    printf("\n");
}
```

## 判断单链表是否为空

因为采用的是带头结点的单链表，故只需判断其指针字段是否指向 `NULL`即可。

```c
// 判断该链表是否为空
int isEmpty(Node *head) {
    return head->next == NULL;
}
```

## 返回单链表的长度

```c
// 返回该单链表的长度
int length(Node *head) {
    int length = 0;
    // 创建临时结点以遍历链表
    Node *temp = head->next;
    while (temp)
    {
       // 指向下一个结点
       temp = temp->next;
       // 计数器增加1
       length++;
    }
    // 返回该链表的长度
    return length;
}
```
