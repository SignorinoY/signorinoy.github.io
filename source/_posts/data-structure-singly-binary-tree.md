---
title: 数据结构学习笔记：二叉树 
tags: [数据结构, 顺序表, 二叉树]
date: 2018-11-23 21:02:01
permalink: data-structure-binary-tree
---

在计算机科学中,二叉树（英语：Binary tree）是每个节点最多只有两个分支（即不存在分支度大于2的节点）的树结构.通常分支被称作“左子树”或“右子树”.二叉树的分支具有左右次序,不能随意颠倒.
<!--more-->

## 二叉树

### 二叉树链式存储结构结点类

在二叉链表结构中,二叉树中的每一个结点设置有3个域：数据域、左指针域、右指针域,其中,数据域用来存放结点的值；左、右指针域分别用来存放该结点的左、右孩子结点的存储地址.

二叉树链式存储结构的结点类的描述如下：

```java
public class BinaryTreeNode {
    //数据域
    public Object data;
    //左指针域
    BinaryTree.BinaryTreeNode left;
    //右指针域
    BinaryTree.BinaryTreeNode right;

    public BinaryTreeNode() {
        this(null);
    }

    public BinaryTreeNode(Object item) {
        this(item, null, null);
    }

    public BinaryTreeNode(Object item, BinaryTree.BinaryTreeNode left, BinaryTree.BinaryTreeNode right) {
        this.data = item;
        this.left = left;
        this.right = right;
    }
}
```

### 二叉链式存储结构二叉树类

在二叉链表结构中,每一个二叉树以其根结点唯一标识.

二叉树链式存储结构的二叉树类的描述如下：

```java
import java.util.LinkedList;
import java.util.Queue;

public class BinaryTree {
    public BinaryTreeNode root;

    public BinaryTree() {
        this.root = null;
    }

    public BinaryTree(BinaryTreeNode root) {
        this.root = root;
    }
    ...
}
```

### 建立二叉树

#### 由先根和中根遍历序列建立二叉树

```java
/**
 * 由先根和中根序列建立一棵二叉树
 **/
public BinaryTree(String preOrder, String inOrder) {
    this(preOrder, inOrder, 0, 0, inOrder.length());
}

private BinaryTree(String preOrder, String inOrder, int preStart, int inStart, int count) {
    if (count > 0) {
        char node = preOrder.charAt(preStart);
        root = new BinaryTreeNode(node);
        int nodeIndex;
        for (nodeIndex = 0; nodeIndex < count; nodeIndex++)
            if (node == inOrder.charAt(inStart + nodeIndex)) break;
        root.left = new BinaryTree(preOrder, inOrder, preStart + 1, inStart, nodeIndex).root;
        root.right = new BinaryTree(preOrder, inOrder, preStart + nodeIndex + 1, inStart + nodeIndex + 1, count - nodeIndex - 1).root;
    }
}
```

#### 由标明空子树的先根遍历序列建立二叉树

在本算法中以`#`标明为空子树.

```java
/**
 * 利用标明空子树的先根遍历建立一棵二叉树
 **/
public BinaryTree(String preOrder) {
    this(preOrder, 0);
}

private BinaryTree(String preOrder, int preIndex) {
    char node = preOrder.charAt(preIndex++);
    if (node != '#') {
        root = new BinaryTreeNode(node);
        root.left = new BinaryTree(preOrder, preIndex).root;
        root.right = new BinaryTree(preOrder, preIndex).root;
    } else
        root = null;
}
```

### 统计二叉树深度

```java
/**
 * 返回一棵二叉树的深度
 **/
public int getDepth() {
    return getDepth(root);
}

private int getDepth(BinaryTreeNode node) {
    if (node == null) {
        return 0;
    } else if (node.left == null && node.right == null) {
        return 1;
    } else {
        int rDepth = getDepth(node.right);
        int lDepth = getDepth(node.left);
        int depth = (lDepth > rDepth ? lDepth : rDepth) + 1;
        return depth;
    }
}
```

### 统计二叉树叶结点数目

```java
/**
 * 返回一棵二叉树的叶节点个数
 **/
public int countLeafNode() {
    return countLeafNode(root);
}

private int countLeafNode(BinaryTreeNode node) {
    if (node == null) {
        return 0;
    } else if (node.left == null && node.right == null) {
        return 1;
    } else {
        return countLeafNode(node.left) + countLeafNode(node.right);
    }
}
```

### 图形化输出二叉树

在本算法中,需要按层进行打印,但是无论是用层次遍历还是先（中、后）根遍历都无法很方便地获得每一个结点的数据与位置,但是,如果我们使用顺序结构进行存储,那么我们可以很容易地获得每一个结点的数据与所处位置,在该算法中,仍然是使用层次遍历的方法,但是对空子树使用 ` ` 进行标识,将链式存储结构转换为顺序存储结构的具体算法如下：

```java
/**
 * 将二叉树链式存储结构转换为二叉树顺序存储结构
 **/
public Object[] toSequence() {
    BinaryTreeNode node = root;
    int depth = getDepth();
    int length = (1 << depth) - 1;
    Object[] Sequence = new Object[length];
    int index = 0;
    Queue queue = new LinkedList();
    queue.offer(node);
    Sequence[index++] = node.data;
    while (index != length) {
        node = (BinaryTreeNode) queue.poll();
        if (node.left != null) {
            queue.offer(node.left);
            Sequence[index++] = node.left.data;
        } else
            Sequence[index++] = ' ';
        if (node.right != null) {
            queue.offer(node.right);
            Sequence[index++] = node.right.data;
        } else
            Sequence[index++] = ' ';
    }
    return Sequence;
}
```

因为二叉树知道其深度,就可以知道该二叉树的最大宽度,所以我们可以根据这一性质,来图形化输出二叉树.在该算法中,需要判断每一层的结点是否存在,根据是否存在来判断是否输出每一棵树的枝干.

```java
/**
 * 图形化输出二叉树
 **/
public void repeatPrint(int count, char ch) {
    for (int i = 0; i < count; i++) {
        System.out.print(ch);
    }
}

public void printTree() {
    int depth = getDepth();
    Object[] sequence = toSequence();
    for (int i = 0; i < depth; i++) {
        for (int j = 0; j < 1 << i; j++) {
            repeatPrint((1 << depth - i - 1), ' ');
            System.out.print(sequence[(1 << i) + j - 1]);
            repeatPrint((1 << depth - i - 1) - 1, ' ');
        }
        System.out.println();
        if (i != depth - 1) {
            for (int j = 0; j < 1 << i; j++) {
                repeatPrint((1 << depth - i - 1), ' ');
                if (!sequence[(1 << i + 1) + j - 1].toString().equals(" ") || !sequence[(1 << i + 1) + j].toString().equals(" ")) {
                    System.out.print('|');
                } else {
                    System.out.print(' ');
                }
                repeatPrint((1 << depth - i - 1) - 1, ' ');
            }
            System.out.println();
        }
        if (i != depth - 1) {
            for (int j = 0; j < 1 << i + 1; j++) {
                if (j % 2 == 0 && !sequence[(1 << i + 1) + j - 1].toString().equals(" ")) {
                    repeatPrint((1 << depth - i - 2), ' ');
                    repeatPrint((1 << depth - i - 2), '-');
                } else if (j % 2 == 0 && sequence[(1 << i + 1) + j - 1].toString().equals(" ")) {
                    repeatPrint((1 << depth - i - 1), ' ');
                } else if (j % 2 == 1 && !sequence[(1 << i + 1) + j - 1].toString().equals(" ")) {
                    repeatPrint((1 << depth - i - 2), '-');
                    repeatPrint((1 << depth - i - 2) - 1, ' ');
                } else if (j % 2 == 1 && sequence[(1 << i + 1) + j - 1].toString().equals(" ")) {
                    repeatPrint((1 << depth - i - 1) - 1, ' ');
                }
                if (j % 2 == 0) {
                    if (!sequence[(1 << i + 1) + j - 1].toString().equals(" ") || !sequence[(1 << i + 1) + j].toString().equals(" ")) {
                        System.out.print('-');
                    } else {
                        System.out.print(' ');
                    }
                }
            }
            System.out.println();
        }
    }
}
```

## 线索二叉树

### 线索二叉树结点类

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

### 线索二叉树线索二叉树类

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

### 由二叉树创建线索二叉树

如果,我们需要从二叉树类复制为线索二叉树,可以通过对二叉树的遍历的方法来进行复制,此处通过将二叉树链式存储结构先转换为顺序存储结构,再由顺序存储结构创建线索二叉树的方法创建线索二叉树.

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

由于线索化的实质是将二叉链表中的空指针改为指向前驱或后继的线索,而前驱或后继的信息只有在遍历时才能得到,因此线索化的过程即为在遍历的过程中修改空指针的过程.为了下遍历过程中访问结点的先后关系,设置了一个指针指向刚刚访问过的结点.

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
    //左指针为空,将左指针指向前驱节点
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

### 非递归地输出先序遍历序列

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

## 实验结果

- 二叉树测试类

```java
import org.junit.Test;

/**
 * BinaryTree Tester.
 *
 * @author Ziyang
 * @since 2018/11/28
 */
public class BinaryTreeTest {
    @Test
    public void testGetDepth() throws Exception {
        BinaryTree binaryTree = new BinaryTree("ABDEGCFH", "DBGEAFHC");
        System.out.println(binaryTree.getDepth());
    }

    @Test
    public void testCountLeafNode() throws Exception {
        BinaryTree binaryTree = new BinaryTree("ABDEGCFH", "DBGEAFHC");
        System.out.println(binaryTree.countLeafNode());
    }

    @Test
    public void testPrintTree() throws Exception {
        BinaryTree binaryTree = new BinaryTree("ABDEGCFH", "DBGEAFHC");
        binaryTree.printTree();
    }
}
```

- 运行结果：

```java
        A
        |
    ---------
    B       C
    |       |
  -----   ---
  D   E   F
      |   |
     --   --
     G     H
3
4
```

- 线索二叉树测试类

```java
import org.junit.Test;
import org.junit.Before;
import org.junit.After;

/**
 * ThreadBinaryTree Tester.
 *
 */
public class ThreadBinaryTreeTest {
    @Test
    public void testCreateThreadBinaryTreeSequence() throws Exception {
        BinaryTree binaryTree = new BinaryTree("ABDEGCFH", "DBGEAFHC");
        ThreadBinaryTree threadBinaryTree = new ThreadBinaryTree(binaryTree);
        threadBinaryTree.preThreadList();
    }
}
```

- 运行结果：

```java
ABDEGCFH
```