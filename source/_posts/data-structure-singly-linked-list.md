---
title: 数据结构学习笔记：单链表 
tags: [数据结构, 顺序表, 单链表]
date: 2018-09-23 21:02:01
permalink: data-structure-singly-linked-list
---
单向链表（又名单链表、线性链表）是链表的一种,其特点是链表的链接方向是单向的,对链表的访问要通过从头部开始,依序往下读取.

![单链表,其结点包含两个字段：整数值和指向下一个结点的指针](https://xn--i0v668g.com/uploads/images/data-structure-singly-linked-list-1.png)

<!-- more -->

## 定义

- 线性表的链式存储结构的特点是用一组任意的存储单元存储线性表中的数据元素,这组存储单元可以存放在内存中未被占用的任意位置.
- 相比顺序存储结构,链式存储结构中,除了需要存储数据元素信息之外,还需要存储它的后继元素的存储地址(指针).
- 如果链表的每个结点中只包含一个指针域,那就叫做**单链表**.

### 单链表的优点

- 动态大小
- 易于插入与删除

### 单链表的缺点

- 不允许随机访问.我们必须从第一个结点开始按顺序访问元素.
- 每个元素都需要额外的指针内存空间.

## 单链表的表示

结点构造 <--> 数据字段+指针字段

- 数据字段：元素自身信息
- 指针字段：指明本元素的直接后继（存储）位置

链表由指向链表的第一个结点的指针来进行唯一表示.

第一个结点称为`head`.有时为了操作方便,第一个结点的数据字段一般不存放具体的值,指针字段存放指向下一个结点的指针.如果链表为空,则`head`的指针字段为空指针`NULL`.**（本文所写的单链表也是带头结点的单链表）**

单链表中的最后一个结点由于没有后继,所以它的指针字段为空指针`NULL`.

```c
typedef struct Node {
    Elemtype data;
    Node *next;
}
```

## 单链表的基本操作

### 单链表的初始化操作

创建一个空结点作为头结点,只记录下一个结点的地址,方便后面进行插入与删除操作,并返回头结点地址作为该链表的唯一标识.

```c
//初始化链表,返回其头结点地址
Node *init() {
    //创建头结点并动态分配内存
    Node *head = (Node*)malloc(sizeof(Node));
    //若分配内存失败则报错
    if (head == NULL) {
       printf("Error - unable to allocate required memory\n");
       exit(-2);
    }
    //初始化头结点,使数据字段与指针字段皆为NULL
    head->data = NULL;
    head->next = NULL;
    //返回头结点地址
    return head;
}
```

### 查看单链表结点地址

无论是进行插入、删除、修改、查看都需要知道其进行操作的结点的地址,故将其抽象成一个函数.

由于单链表的存储空间不连续,所以它不能像顺序表那样通过位序号来定位其存储地址.

单链表是一种顺序存储的结构,即要取第index个结点的值,只能从头指针所指的结点开始沿着指针字段依次进行查找.若查询第0个结点,即头结点,则不进行遍历,直接返回头结点；若不是头结点,则需进行遍历并判断该结点是否存在.

```c
//返回第index个结点的地址,若不存在则报错
Node *locationOf(Node *head, int index) {
    //创建临时结点以遍历链表
    Node* temp = head;
    if (index != 0)
    {
       for (int i = 0; i < index; i++) {
         if (temp == NULL) {
          //判断插入位置是否有效(位置是否超过单链表长度）
          printf("Error - wrong location\n");
          exit(-1);
         }
         //指向下一个结点
         temp = temp->next;
       }
    }
    //返回第index个结点的地址
    return temp;
}
```

### 单链表上的插入操作

首先需查询要插入的地址是否存在,若存在,则为新建的结点动态申请内存空间,然后将新建结点添加到链表中.

```c
//在第index个结点后插入结点
void insertById(Node *head, int index, Elemtype elem) {
    //获得第index个结点的地址
    Node* temp = locationOf(head, index);
    //创建新的结点c
    Node *c = (Node*)malloc(sizeof(Node));
    //若分配内存失败则报错
    if (c == NULL) {
       printf("Error - unable to allocate required memory\n");
       exit(-2);
    }
    //插入新的结点
    c->data = elem;
    //新的结点连接原结点的后继结点
    c->next = temp->next;
    //原结点连接新的结点
    temp->next = c;
}
```

### 单链表上的删除操作

查询要删除结点的前驱结点的地址,并判断要删除结点是否存在,若存在,则记录要删除结点的后继结点的地址,将前驱结点的指针字段指向后继结点的地址；若不存在,则跳出.

结点被删除后,只表示将它从链表中断开而已,它仍占用着内存,必须要释放这个内存,否则会出现内存泄漏.

```c
//删除第index个结点
void deleteById(Node *head, int index) {
    //获取第index个结点前驱结点的地址
    Node *temp1 = locationOf(head, index - 1);
    //记录第index个结点的地址供释放空间用
    Node *temp2 = temp1->next;
    //若第index个结点不存在,则函数结束
    if (temp2 == NULL)
       return;
    //将第index个结点的前驱指点的指针指向其后继结点
    temp1->next = temp2->next;
    //释放第index个结点的内存空间
    free(temp2);
}
```

### 单链表上的更新操作

获取第index个结点的地址,若存在则修改该结点所存储的数据.

```c
//更新第index个结点
void updateById(Node *head, int index, Elemtype elem) {
    //获取第index个结点的地址
    Node* temp = locationOf(head, index);
    //修改第index个结点的值
    temp->data = elem;
}
```

### 单链表上的查找操作

#### 按序号查找

获取第index个结点的地址,若存在则返回该结点所存储的数据.

```c
//查看第index个结点并返回其值
Elemtype selectById(Node *head, int index) {
    //获取第index个结点的地址
    Node* temp = locationOf(head, index);
    //返回第index个结点的值
    return temp->data;
}
```

#### 按值查找

为获取该单链表上第一个与给定值`elem`相同的结点,从该单链表的头结点开始沿着后继指针一次对各结点的数据字段与`elem`进行比较,直到找到数据字段为`elem`的结点或到达该单链表的标为为止.

```c
//按值进行查找,若存在则返回其index,不存在返回-1
int indexOf(Node *head, Elemtype elem) {
    int index = 0;
    //创建临时结点以遍历链表
    Node *temp = head;
    //从头结点开始查找,直到temp->data为elem或到达链表的结尾
    while (temp != NULL && temp->data != elem)
    {
       //指向下一个结点
       temp = temp->next;
       //计数器增加1
       index++;
    }
    //若elem在结点中,则返回其在单链表中的位置；若不存在,则返回-1
    if (temp != NULL)
       return index;
    else
       return -1;
}
```

### 单链表上的清空操作

清空单链表,从首结点开始,先记录其后继结点的地址,后释放该结点的内存,后重复进行,直至到达尾结点为止.最后需将头结点的指针字段指向`'NULL`.

```c
//清空该链表
void clear(Node *head) {
    Node *p, *q;
    //从头结点开始查找
    p = head->next;
    while (p)
    {
       //记录其后继结点
       q = p->next;
       //释放该结点内存空间
       free(p);
       //将后继结点赋值给p
       p = q;
    }
    //使头结点的指针指向NULL
    head->next = NULL;
}
```

### 单链表上的输出操作

```c
//输出该链表
void display(Node *head) {
    //创建临时结点以遍历链表
    Node *temp = head;
    //只要temp有后续结点就输出
    while (temp->next) {
       //指向下一个结点
       temp = temp->next;
       printf("%d ", temp->data);
    }
    printf("\n");
}
```

### 判断单链表是否为空

因为采用的是带头结点的单链表,故只需判断其指针字段是否指向`NULL`即可.

```c
//判断该链表是否为空
int isEmpty(Node *head) {
    return head->next == NULL;
}
```

### 返回单链表的长度

```c
//返回该单链表的长度
int length(Node *head) {
    int length = 0;
    //创建临时结点以遍历链表
    Node *temp = head->next;
    while (temp)
    {
       //指向下一个结点
       temp = temp->next;
       //计数器增加1
       length++;
    }
    //返回该链表的长度
    return length;
}
```

## 单链表的复杂操作

在完成上述单链表的基本操作后,给出了下列要求：

> 完成 ：两个单链表的创建,排序后,合并成一个有序链表.并实现就地转置（即不利用额外空间实现转置）

因为后面有要求要对有序链表进行合并操作,使其仍然保持有序性,所以根据这一要求采用归并排序.

> 归并排序（英语：Merge sort,或mergesort）,是创建在归并操作上的一种有效的排序算法,效率为 O(nlog n)（大O符号）.1945年由约翰·冯·诺伊曼首次提出.该算法是采用分治法（Divide and Conquer）的一个非常典型的应用,且各层分治递归可以同时进行.

### 单链表上的归并排序

#### 单链表上的归并操作

> 首先考虑下如何将将二个有序数列合并,只要从比较二个数列的第一个数,谁小就先取谁,取了后就在对应数列中删除这个数.然后再进行比较,如果有数列为空,那直接将另一个数列的数据依次取出即可.
>
> 可以看出合并有序数列的效率是比较高的,可以达到O(n).

```c
//输入两单链表的头结点,从小到大进行归并后,返回归并后的单链表头结点
Node *merge(Node *head1, Node *head2) {
    Node *head = init();
    int length = 0, a, b;
    //任一链表为空时,则表示剩余的结点中存储的数据皆比已归并的结点中存储数据大,故可直接拼接
    while (!isEmpty(head1) && !isEmpty(head2))
    {
       //记录两单链表中首结点存储的数据
       a = selectById(head1, 1);
       b = selectById(head2, 1);
       //a,b两数,谁小谁就插入到新的单链表中,且删除原单链表中结点
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
    //拼接剩余元素
    Node *temp = locationOf(head, length);
    temp->next = isEmpty(head1)?locationOf(head2, 1):locationOf(head1, 1);
    //释放原先的单链表的头结点所占用的空间
    free(head1);
    free(head2);
    //返回进行归并操作后的新的单链表
    return head;
}
```

#### 单链表上的归并排序实现

> 再来看归并排序,其的基本思路就是将数组分成二组A,B,如果这二组组内的数据都是有序的,那么就可以很方便的将这二组数据进行排序.如何让这二组组内数据有序了？
>
> 可以将A,B组各自再分成二组.依次类推,当分出来的小组只有一个数据时,可以认为这个小组组内已经达到了有序,然后再合并相邻的二个小组就可以了.这样通过先递归的分解数列,再合并数列就完成了归并排序.

```c
//对单链表进行从小到大的归并排序
Node *mergeSort(Node *head) {
    //当单链表只有一个或没有结点时,可认为已达到组内有序,返回
    if (length(head) == 0 || length(head) == 1)
    {
       return head;
    }
    //对单链表进行二分,拆分成两个单链表
    Node *middleNode = locationOf(head, length(head) / 2);;
    Node *head2 = init();
    head2->next = middleNode->next;
    Node *head1 = head;
    middleNode->next = NULL;
    //分别对这两个单链表进行归并排序
    head1 = mergeSort(head1);
    head2 = mergeSort(head2);
    //对两个已经有序的单链表进行归并操作,合并成一个有序的单链表
    return merge(head1, head2);
}
```

### 单链表上的反转操作

#### 思路一

平常较常使用的是线性顺序表进行存储,不需要考虑怎么进行反转,只需要按照存储地址逆序输出就好.在看到这道题目的第一想法就是,先将其转为顺序表后逆序生成单链表,但本题不允许使用额外空间,故考虑可否把所有结点的前后顺序进行反转.

> 基于此思路,使用3个指针遍历单链表,逐个结点进行反转.
>
> 利用两个结点指针和一个中间结点指针`next`（用来记录当前结点的下一个结点的位置）,分别指向当前结点和前一个结点,每次循环让当前结点的指针字段指向前一个结点即可,翻转结束后,需要为该单链表添加头结点,并释放原来的头结点所占据的内存.

```c
//对链表进行反转并返回新链表的头结点
//使用3个指针遍历单链表,逐个结点进行反转
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
    //添加头结点并动态分配内存
    Node *newHead = init();
    newHead->next = prev;
    free(head);
    return newHead;
}
```

#### 思路二

除上一种思路外,还想出了一种思路更加易于理解.

> 从第1个结点到第N个结点,依次逐结点插入到头结点之后,即可完成反转.

```c
//对链表进行反转并返回新链表的头结点
//从第1个结点到第N个结点,依次逐结点插入到头结点之后,即可完成反转
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

为了方便理解,本方法使用了现成的方法,性能不高,存在较多的重复使用的现象,可以进一步改进.

## 测试

```c
int main()
{
    Node *head1 = init();
    Node *head2 = init();
    Node *head;
    for (int i = 0; i < 15; i++)
       insertById(head1, i, rand() % 100);
    for (int i = 0; i < 15; i++)
       insertById(head2, i, rand() % 100);
    printf("---排序前---\n");
    display(head1);
    display(head2);
    printf("---排序后---\n");
    head1 = mergeSort(head1);
    head2 = mergeSort(head2);
    display(head1);
    display(head2);
    printf("---合并后---\n");
    head = merge(head1,head2);
    display(head);
    printf("---反转后---\n");
    head = reverse1(head);
    display(head);
    return 0;
}
```

测试结果：

![测试结果：](https://xn--i0v668g.com/uploads/images/data-structure-singly-linked-list-2.png)

源代码下载：[下载地址](https://xn--i0v668g.com/uploads/codes/singly_linked_list.cpp)