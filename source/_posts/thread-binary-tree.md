---
title: 线索二叉树 
categories: 数据结构
tags: [二叉树, 线索二叉树]
date: 2018-11-23 23:05:00
---

二叉树的遍历本质上是将一个复杂的非线性结构转换为线性结构，使每个结点都有了唯一前驱和后继（第一个结点无前驱，最后一个结点无后继）。对于二叉树的一个结点，查找其左右子女是方便的，其前驱后继只有在遍历中得到。为了容易找到前驱和后继，有两种方法。一是在结点结构中增加向前和向后的指针，这种方法增加了存储开销，不可取；二是利用二叉树的空链指针，即线索二叉树。

<!--more-->

- 利用线索二叉树进行中序遍历时，不必采用堆栈处理，速度较一般二叉树的遍历速度快，且节约存储空间
- 任意一个结点都能直接找到它的前驱和后继结点

## 线索二叉树结点类

线索二叉树的结点类的描述如下：

```java
public class ThreadBinaryTreeNode {
    //数据域
    public Object data;
    //左指针域
    ThreadBinaryTreeNode left;
    //右指针域
    ThreadBinaryTreeNode right;
    //左指针域类型  false：指向子节点、true：前驱或后继线索
    boolean isLeftThread;
    //右指针域类型  false：指向子节点、true：前驱或后继线索
    boolean isRightThread;

    public ThreadBinaryTreeNode() {
        this(null);
    }

    public ThreadBinaryTreeNode(Object data) {
        this(data, null, null, false, false);
    }

    public ThreadBinaryTreeNode(Object data, ThreadBinaryTreeNode left, ThreadBinaryTreeNode right) {
        this(data, left, right, false, false);
    }

    public ThreadBinaryTreeNode(Object data, ThreadBinaryTreeNode left, ThreadBinaryTreeNode right, boolean isLeftThread, boolean isRightThread) {
        this.data = data;
        this.left = left;
        this.right = right;
        this.isLeftThread = isLeftThread;
        this.isRightThread = isRightThread;
    }
}
```

## 线索二叉树线索二叉树类

线索二叉树的线索二叉树的描述如下：

```java
public class ThreadBinaryTree {
        private ThreadBinaryTreeNode root;

    public ThreadBinaryTree() {
        this.root = null;
    }

    public ThreadBinaryTree(ThreadBinaryTreeNode root) {
        this.root = root;
    }
    ...
}
```

## 由二叉树创建线索二叉树

如果，我们需要从二叉树类复制为线索二叉树，可以通过对二叉树的遍历的方法来进行复制，此处通过将二叉树链式存储结构先转换为顺序存储结构，再由顺序存储结构创建线索二叉树的方法创建线索二叉树。

```java
/**
 * 由二叉树创建线索二叉树
 **/
public ThreadBinaryTree(BinaryTree tree) {
    if (tree != null) {
        Object[] sequence = tree.toSequence();
        this.root = createFromSequence(sequence);
        preThreadOrder(this.root);
    }
}

public ThreadBinaryTreeNode createFromSequence(Object[] sequence) {
    return createFromSequence(sequence, 0);
}

private ThreadBinaryTreeNode createFromSequence(Object[] sequence, int index) {
    ThreadBinaryTreeNode node = null;
    if (index < sequence.length) {
        if (!sequence[index].toString().equals(" ")) {
            node = new ThreadBinaryTreeNode(sequence[index]);
            node.left = createFromSequence(sequence, index * 2 + 1);
            node.right = createFromSequence(sequence, index * 2 + 2);
        } else {
            node = null;
        }
    }
    return node;
}
```

由于线索化的实质是将二叉链表中的空指针改为指向前驱或后继的线索，而前驱或后继的信息只有在遍历时才能得到，因此线索化的过程即为在遍历的过程中修改空指针的过程。为了下遍历过程中访问结点的先后关系，设置了一个指针指向刚刚访问过的结点。

```java
/**
  * 前序线索化二叉树
  */

//线索化时记录前一个节点
private ThreadBinaryTreeNode preNode;

private void preThreadOrder() {
    this.preThreadOrder(root);
}

private void preThreadOrder(ThreadBinaryTreeNode node) {
    if (node == null) return;
    //左指针为空，将左指针指向前驱节点
    if (node.left == null) {
        node.left = preNode;
        node.isLeftThread = true;
    }
    //前一个节点的后继节点指向当前节点
    if (preNode != null && preNode.right == null) {
        preNode.right = node;
        preNode.isRightThread = true;
    }
    preNode = node;
    if (!node.isLeftThread) {
        preThreadOrder(node.left);
    }
    if (!node.isRightThread) {
        preThreadOrder(node.right);
    }
}
```

## 非递归地输出先序遍历序列

```java
/**
 * 前序遍历线索二叉树（按照后继线索遍历）
 */
public void preThreadList() {
    ThreadBinaryTreeNode node = root;
    while (node != null) {
        while (!node.isLeftThread) {
            System.out.print(node.data);
            node = node.left;
        }
        System.out.print(node.data);
        node = node.right;
    }
}
```

## 线索二叉树测试类

```java
import org.junit.Test;
import org.junit.Before;
import org.junit.After;

/**
 * ThreadBinaryTree Tester.
 **/
public class ThreadBinaryTreeTest {
    @Test
    public void testCreateThreadBinaryTreeSequence() throws Exception {
        BinaryTree binaryTree = new BinaryTree("ABDEGCFH", "DBGEAFHC");
        ThreadBinaryTree threadBinaryTree = new ThreadBinaryTree(binaryTree);
        threadBinaryTree.preThreadList();
    }
}
```

```text
ABDEGCFH
```