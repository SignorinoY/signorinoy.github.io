---
title: Hadoop学习笔记：MapReduce基础编程
tags: [Hadoop, MapReduce, java]
date: 2018-10-29 15:43:07
permalink: 'hadoop-mapreduce'
---

MapReduce采用”分而治之”的思想,把对大规模数据集的操作,分发给一个主节点管理下的各个分节点共同完成,然后通过整合各个节点的中间结果,得到最终结果.简单地说,MapReduce就是”任务的分解与结果的汇总”.

在Hadoop中,用于执行MapReduce任务的机器角色有两个：

- JobTracker用于调度工作的,一个Hadoop集群中只有一个JobTracker,位于master.
- TaskTracker用于执行工作,位于各slave上.

在分布式计算中,MapReduce框架负责处理了并行编程中分布式存储、工作调度、负载均衡、容错均衡、容错处理以及网络通信等复杂问题,把处理过程高度抽象为两个函数：map和reduce,map负责把任务分解成多个任务,reduce负责把分解后多任务处理的结果汇总起来.

需要注意的是,用MapReduce来处理的数据集（或任务）必须具备这样的特点：待处理的数据集可以分解成许多小的数据集,而且每一个小数据集都可以完全并行地进行处理.
<!-- more -->

## WordCount 实例

修改WordCount源代码,使得输出的词频统计满足

- 数据清洗： 对每个词的格式进行规范化（去除不以英文字母开头的所有词）
- 词频少于3次的数据不在结果中显示
- 结果以有限数量的“+”表示词频统计

### 实验思路

- 为了实现第一点要求,在map函数中进行修改,只有当单词以英文字母开头（此处可考虑使用正则表达式进行匹配）时,才将其输出；
- 为实现第二点要求,在reduce中进行判断,只有当reduce函数的Key的Value之和大于3,才将其作为reduce函数的输出；
- 为实现第三点要求,那么reduce所输出的Key与Value的类型均为Text类型,需要修改reduce函数的输出类型,并修改配置文件中的输出类型.

### 运行程序

我们这里采用的是古德堡项目中的部分英文小说,部分运行结果如下：

```xml
abaft    +++
abandon    +++++
abandoned    +++++++++++++++++++++
abandoning    +++
abandonment    ++++
abated    +++++
abbey    +++
abed    ++++
abhorred    ++++
abide    ++++++++++++++++++
ability    ++++
abject    +++

```

```java
import java.io.IOException;
import java.util.Arrays;
import java.util.StringTokenizer;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.GenericOptionsParser;

public class WordCount {

  public static void main(String[] args) throws Exception {
    Configuration conf = new Configuration();
    String[] otherArgs = (new GenericOptionsParser(conf, args)).getRemainingArgs();
    if (otherArgs.length < 2) {
      System.err.println("Usage: wordcount <in> [<in>...] <out>");
      System.exit(2);
    }
    Job job = Job.getInstance(conf, "word count");
    job.setJarByClass(WordCount.class);
    job.setMapperClass(WordCount.TokenizerMapper.class);
    job.setReducerClass(WordCount.IntSumReducer.class);
    job.setMapOutputKeyClass(Text.class);
    job.setMapOutputValueClass(IntWritable.class);
    job.setOutputKeyClass(Text.class);
    job.setOutputValueClass(Text.class);
    for (int i = 0; i < otherArgs.length - 1; ++i) {
      FileInputFormat.addInputPath(job, new Path(otherArgs[i]));
    }
    FileOutputFormat.setOutputPath(job, new Path(otherArgs[otherArgs.length - 1]));
    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }

  public static class TokenizerMapper extends Mapper<Object, Text, Text, IntWritable> {

    private final static IntWritable ONE = new IntWritable(1);
    private Text word = new Text();

    @Override
    public void map(Object key, Text value, Context context)
        throws IOException, InterruptedException {
      StringTokenizer itr = new StringTokenizer(value.toString());
      while (itr.hasMoreTokens()) {
        String text = itr.nextToken();
        if (text.matches("^[A-Za-z]+$")) {
          word.set(text.toLowerCase());
          context.write(word, ONE);
        }
      }
    }
  }

  public static class IntSumReducer extends Reducer<Text, IntWritable, Text, Text> {

    private Text result = new Text();

    @Override
    public void reduce(Text key, Iterable<IntWritable> values, Context context)
        throws IOException, InterruptedException {
      int sum = 0;
      for (IntWritable val : values) {
        sum += val.get();
      }
      if (sum >= 3) {
        char[] chars = new char[sum];
        Arrays.fill(chars, '+');
        result.set(new String(chars));
        context.write(key, result);
      }
    }
  }
}
```

## InvertedIndex 实例

倒排索引是目前几乎所有支持全文检索的搜索引擎都需要依赖的一个数据结构,该索引结构用来存储某个单词在一个文档或一组文档中存储位置的映射,即提供了一种根据内容来查找文档的方式.

改进WordCount代码：Map函数输出<单词,文件名@位置>,Reduce函数输出<单词,list<文件名@位置>>即可.

- 清洗一部分明显不合理的单词的统计
- 根据上述要求,完成真实环境中文档倒排索引的MapReduce框架代码.
- 生成一个input文件夹,搜索一个文本文件的集合,拷贝到input文件夹中.
- 运行MapReduce框架将生成的倒排文档索引放入目标文件中.

### 实验思路

- 为实现第一个要求,通过查询相关文献,我们采取删除在StopWords的单词的方法.我们还是与在WordCount修改版中一样,只有当单词不在StopWords列表中时,才将其输出.
- 在此处若直接将键值对<单词,文件名>作为Reduce的输入,在数据量极大时,会因为网络带宽,对性能造成极大地降低,那么我们是否可以先在map服务器上对键值对进行合并,那么传递给Reduce的输入的数据量就会大大减少.基于这个思想,我们在此处使用Combiner函数对map的输出进行预先的合并.
- 此处还需要注意一点,这里要求输出单词在文件中的位置,而map是按行进行读入的,并不像我们平常使用的Java读入文件那样,可以可以根据换行符来判断他在第几行.这里,由于文件名或者说文件的存储路径是不同的,我们可以使用其来进行判断他是否属于同一个文件,若属于同一个文件,我们对行数加一,若不属于同一个文件,我们将行数归为1.因此,我们就实现了判断单词在文件中的位置.

### 运行程序

我们这里采用的是古德堡项目中的部分英文小说,部分运行结果如下：

```xml
aback    98-0.txt@70690;pg345.txt@55123;2701-0.txt@12402;2701-0.txt@5472;
abaft    2701-0.txt@15814;2701-0.txt@9732;pg345.txt@51608;pg345.txt@51265;
abandon    pg345.txt@55383;2701-0.txt@8558;2701-0.txt@944;2701-0.txt@15471;98-0.txt@69667;
```

### 所遇到的问题

在编写代码时,我遇到了这样一个问题,就是因为Combiner的输入与输出类型与map的输出和reduce的输入不同,而报错.通过查阅相关资料,了解到**combiner的输入和reduce的完全一致,输出和map的完全一致**.

### 后续思考

在结果中,我们看到因为英语有单复数、时态等,相同的单词可能被认为是不同的,查阅相关资料,我们了解到可以用词干提取与词干还原等方式将单词变为原型.

> 我此处尝试使用比较著名的Stanford NLP的CoreNlp包对文本进行处理,不过,因为pronbuf包与hadoop中的存在版本冲突,没有成功运行.

```java
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.StringTokenizer;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.FileSplit;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.GenericOptionsParser;

public class InvertedIndex {

  private static int lineNum = 1;
  private static String tempFileName = "-1";

  public static void main(String[] args) throws Exception {
    Configuration conf = new Configuration();
    String[] otherArgs = (new GenericOptionsParser(conf, args)).getRemainingArgs();
    if (otherArgs.length < 2) {
      System.err.println("Usage: wordcount <in> [<in>...] <out>");
      System.exit(2);
    }
    Job job = Job.getInstance(conf, "key count");
    job.setJarByClass(InvertedIndex.class);
    job.setMapperClass(TokenizerMapper.class);
    job.setCombinerClass(InvertedIndexCombiner.class);
    job.setReducerClass(InvertedIndexReducer.class);
    job.setOutputKeyClass(Text.class);
    job.setOutputValueClass(Text.class);
    for (int i = 0; i < otherArgs.length - 1; ++i) {
      FileInputFormat.addInputPath(job, new Path(otherArgs[i]));
    }
    FileOutputFormat.setOutputPath(job, new Path(otherArgs[otherArgs.length - 1]));
    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }


  public static class TokenizerMapper extends Mapper<Object, Text, Text, Text> {

    private Text iKey = new Text();
    private Text iValue = new Text();

    @Override
    public void map(Object key, Text value, Context context)
        throws IOException, InterruptedException {
      FileSplit fileSplit = (FileSplit) context.getInputSplit();
      String fileName = fileSplit.getPath().getName();
      if (!fileName.equals(tempFileName)) {
        lineNum = 1;
        tempFileName = fileName;
      } else if ("-1".equals(tempFileName)) {
        tempFileName = fileName;
      }
      StringTokenizer itr = new StringTokenizer(
          value.toString().replaceAll("[\\p{P}+~$`^=|<>～｀＄＾＋＝｜＜＞￥×]", " "));
      while (itr.hasMoreTokens()) {
        String text = itr.nextToken().toLowerCase();
        if (!isStopword(text)) {
          iKey.set(text);
          iValue.set(fileName + '@' + lineNum);
          context.write(iKey, iValue);
        }
      }
      lineNum++;
    }
  }

  public static class InvertedIndexCombiner extends Reducer<Text, Text, Text, Text> {

    private Text result = new Text();

    @Override
    public void reduce(Text key, Iterable<Text> values, Context context)
        throws IOException, InterruptedException {
      StringBuilder fileList = new StringBuilder();
      for (Text value : values) {
        fileList.append(value.toString()).append(";");
      }
      result.set(fileList.toString());
      context.write(key, result);
    }
  }

  public static class InvertedIndexReducer extends Reducer<Text, Text, Text, Text> {

    private Text result = new Text();

    @Override
    public void reduce(Text key, Iterable<Text> values, Context context)
        throws IOException, InterruptedException {
      StringBuilder fileList = new StringBuilder();
      for (Text value : values) {
        fileList.append(value.toString());
      }
      result.set(fileList.toString());
      context.write(key, result);
    }
  }

  private static String[] stopwords = {"a", "as", "able", "about", "above", "according",
      "accordingly", "across", "actually", "after", "afterwards", "again", "against", "aint", "all",
      "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am",
      "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything",
      "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are",
      "arent", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away",
      "awfully", "be", "became", "because", "become", "becomes", "becoming", "been", "before",
      "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best", "better",
      "between", "beyond", "both", "brief", "but", "by", "cmon", "cs", "came", "can", "cant",
      "cannot", "cant", "cause", "causes", "certain", "certainly", "changes", "clearly", "co",
      "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain",
      "containing", "contains", "corresponding", "could", "couldnt", "course", "currently",
      "definitely", "described", "despite", "did", "didnt", "different", "do", "does", "doesnt",
      "doing", "dont", "done", "down", "downwards", "during", "each", "edu", "eg", "eight",
      "either", "else", "elsewhere", "enough", "entirely", "especially", "et", "etc", "even",
      "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly",
      "example", "except", "far", "few", "ff", "fifth", "first", "five", "followed", "following",
      "follows", "for", "former", "formerly", "forth", "four", "from", "further", "furthermore",
      "get", "gets", "getting", "given", "gives", "go", "goes", "going", "gone", "got", "gotten",
      "greetings", "had", "hadnt", "happens", "hardly", "has", "hasnt", "have", "havent", "having",
      "he", "hes", "hello", "help", "hence", "her", "here", "heres", "hereafter", "hereby",
      "herein", "hereupon", "hers", "herself", "hi", "him", "himself", "his", "hither", "hopefully",
      "how", "howbeit", "however", "i", "id", "ill", "im", "ive", "ie", "if", "ignored",
      "immediate", "in", "inasmuch", "inc", "indeed", "indicate", "indicated", "indicates", "inner",
      "insofar", "instead", "into", "inward", "is", "isnt", "it", "itd", "itll", "its", "its",
      "itself", "just", "keep", "keeps", "kept", "know", "knows", "known", "last", "lately",
      "later", "latter", "latterly", "least", "less", "lest", "let", "lets", "like", "liked",
      "likely", "little", "look", "looking", "looks", "ltd", "mainly", "many", "may", "maybe", "me",
      "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must",
      "my", "myself", "name", "namely", "nd", "near", "nearly", "necessary", "need", "needs",
      "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none",
      "noone", "nor", "normally", "not", "nothing", "novel", "now", "nowhere", "obviously", "of",
      "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "only", "onto", "or",
      "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "out", "outside", "over",
      "overall", "own", "particular", "particularly", "per", "perhaps", "placed", "please", "plus",
      "possible", "presumably", "probably", "provides", "que", "quite", "qv", "rather", "rd", "re",
      "really", "reasonably", "regarding", "regardless", "regards", "relatively", "respectively",
      "right", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see",
      "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent",
      "serious", "seriously", "seven", "several", "shall", "she", "should", "shouldnt", "since",
      "six", "so", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes",
      "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still",
      "sub", "such", "sup", "sure", "ts", "take", "taken", "tell", "tends", "th", "than", "thank",
      "thanks", "thanx", "that", "thats", "thats", "the", "their", "theirs", "them", "themselves",
      "then", "thence", "there", "theres", "thereafter", "thereby", "therefore", "therein",
      "theres", "thereupon", "these", "they", "theyd", "theyll", "theyre", "theyve", "think",
      "third", "this", "thorough", "thoroughly", "those", "though", "three", "through",
      "throughout", "thru", "thus", "to", "together", "too", "took", "toward", "towards", "tried",
      "tries", "truly", "try", "trying", "twice", "two", "un", "under", "unfortunately", "unless",
      "unlikely", "until", "unto", "up", "upon", "us", "use", "used", "useful", "uses", "using",
      "usually", "value", "various", "very", "via", "viz", "vs", "want", "wants", "was", "wasnt",
      "way", "we", "wed", "well", "were", "weve", "welcome", "well", "went", "were", "werent",
      "what", "whats", "whatever", "when", "whence", "whenever", "where", "wheres", "whereafter",
      "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while",
      "whither", "who", "whos", "whoever", "whole", "whom", "whose", "why", "will", "willing",
      "wish", "with", "within", "without", "wont", "wonder", "would", "would", "wouldnt", "yes",
      "yet", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves",
      "zero"};

  private static Set<String> stopWordSet = new HashSet<String>(Arrays.asList(stopwords));

  public static boolean isStopword(String word) {
    if (word.length() < 2) {
      return true;
    }
    if (word.charAt(0) >= '0' && word.charAt(0) <= '9') {
      return true;
    }
    return stopWordSet.contains(word);
  }
}
```