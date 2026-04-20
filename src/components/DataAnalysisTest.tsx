import React, { useState } from 'react';

interface Question {
  id: number;
  title: string;
  stem: string;
  options: string[];
  correctAnswer: string;
  feedback: string;
  followUp: string;
  isSubjective?: boolean;
  correctThinking?: string;
}

const DataAnalysisTest: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});
  const [showFollowUps, setShowFollowUps] = useState<Record<number, boolean>>({});

  const questions: Question[] = [
    {
      id: 1,
      title: "第1题：指标异动归因",
      stem: "你在分析某电商App近一周的日活数据时，发现周四的\"支付转化率\"突然从平时的3%飙升到15%，但周四的\"访问人数\"并未明显增加。你的Python脚本直接拉取了`订单总数/访问人数`得到了这个15%。作为分析师，你不应该立刻兴奋地汇报，而应该先用Python重点排查哪两类数据？",
      options: [
        "A. 检查周四是否有营销活动，并排查是否有爬虫流量导致访问人数虚低。",
        "B. 检查订单表是否有重复数据，并查看周四是否只有极少数高客单价用户访问。",
        "C. 检查数据库同步时间戳，并查看`订单总数`和`访问人数`的时间归因口径是否一致。",
        "D. 重新训练预测模型，看15%是否在置信区间内。"
      ],
      correctAnswer: "C",
      feedback: "C",
      followUp: "你以为Python算出结果就结束了？数据清洗阶段最致命的错误是什么？`pandas`在做除法时，如果分母字段（访问人数）因为代码Bug被`dropna()`误删了一部分，Python会报错吗？"
    },
    {
      id: 2,
      title: "第2题：`groupby`的哲学",
      stem: "你要分析不同省份的\"客单价\"，Python代码为：`df.groupby('省份')['实付金额'].mean().sort_values()`。你发现\"上海市\"的客单价是9.9元，\"青海省\"的客单价是199元。第一反应是：",
      options: [
        "A. 青海省人民消费能力极强，建议立刻在青海投放高端广告。",
        "B. 上海市数据肯定错了，因为大城市不可能只有9.9元。",
        "C. 怀疑上海市数据中包含大量\"一分钱秒杀/试用装\"订单，需要先按`订单类型`过滤或计算`中位数`验证。",
        "D. 使用`seaborn`画一个更炫酷的柱状图，让老板看清楚这个差异。"
      ],
      correctAnswer: "C",
      feedback: "C",
      followUp: "`mean()`（均值）在面对长尾分布时是无力的。在Python里，一行什么代码可以立刻验证数据是否被\"9.9元包邮\"刷屏了？"
    },
    {
      id: 3,
      title: "第3题：模型应用误区题：线性回归的边界",
      stem: "你用了`from sklearn.linear_model import LinearRegression`建立了一个\"广告费 -> 销售额\"的模型。公司决定下个月投历史最高预算的5倍广告费。你用训练好的`model.predict([[5倍预算]])`算出了预期销售额。这个预测值最可能存在的问题是：",
      options: [
        "A. Python算力不足，内存溢出。",
        "B. 存在过拟合或外推失效风险，因为5倍预算超出了训练集的范围，且边际效应递减定律失效。",
        "C. 没有对数据进行`StandardScaler`标准化，导致模型不收敛。",
        "D. 特征矩阵没有转化为`numpy.array`格式。"
      ],
      correctAnswer: "B",
      feedback: "B",
      followUp: "模型不是算命。如果你必须用Python给出一个相对科学的区间预测而不是一个精确值，你应该调用`sklearn`里的哪个方法或参数？"
    },
    {
      id: 4,
      title: "第4题：统计陷阱题：辛普森悖论",
      stem: "你在Python中用`df.corr()`计算得出：\"客户浏览页面数\"与\"最终购买金额\"呈负相关（-0.3）。这意味着客户看得越多买得越少，应当砍掉推荐页吗？真正理解分析的人会怎么做？",
      options: [
        "A. 接受负相关结论，用`matplotlib`画散点图证明给老板看。",
        "B. 引入第三个变量\"客户来源渠道\"进行分层分析（Groupby），观察是否在不同渠道下相关性反转。",
        "C. 把负号删掉，汇报成正相关。",
        "D. 换成斯皮尔曼相关系数`method='spearman'`再看一遍。"
      ],
      correctAnswer: "B",
      feedback: "B",
      followUp: "如何用一行`pandas`代码（包含`groupby`和`corr`）来确诊这个悖论？"
    },
    {
      id: 5,
      title: "第5题：流失预警之争：样本不平衡的处理",
      stem: "关于流失用户预测，一派专家坚持用SMOTE过采样，另一派反对，认为应该用调整分类阈值。你的测试集有10万条数据，流失率只有1%。用Python跑完逻辑回归后，`accuracy_score`显示准确率99%。你会采纳这个模型上线吗？为什么？",
      options: [
        "A. 采纳，99%的准确率说明Python模型训练得极好。",
        "B. 不采纳，只看准确率是愚蠢的。需要马上输出`classification_report`查看召回率（Recall）和F1-Score。",
        "C. 尝试换用XGBoost重跑一遍，哪个准确率高用哪个。",
        "D. 不采纳，因为Python的`sklearn`不支持处理这么大的不平衡数据。"
      ],
      correctAnswer: "B",
      feedback: "B",
      followUp: "假如你调用`confusion_matrix`，那个`[0, 1]`位置（FN，把流失用户预测为留存）的数字大，对公司意味着什么损失？"
    },
    {
      id: 6,
      title: "第6题：RFM模型中的争议：分箱是艺术还是科学？",
      stem: "在做用户价值分层时，你用`pd.qcut(df['消费间隔'], 5)`将R值五等分打分。另一位专家说这是错的，应该用`pd.cut`按固定业务间隔（如30天、60天）分箱。你选择哪一方？理由是什么？",
      options: [
        "A. 坚决用`qcut`，因为Python自动计算分位数省事且每层样本数一致。",
        "B. 坚决用`cut`，因为业务逻辑大于算法逻辑，30天流失周期的定义不能因为数据变化而变。",
        "C. 根据业务目的权衡：探索性分析用`qcut`找分布，固化运营SOP用`cut`定义标准。",
        "D. 不用Python，导出Excel手动打标签。"
      ],
      correctAnswer: "C",
      feedback: "C",
      followUp: "如果你用`qcut`导致昨天的\"重要价值客户\"今天因为数据波动掉到了\"一般客户\"，老板质问为什么，你的Python依据站得住脚吗？"
    },
    {
      id: 7,
      title: "第7题：因果推断实战：相关性真的没用吗？",
      stem: "公司做了大促，销售额涨了20%。你写`df[df['是否参与大促']==1]['销售额'].mean()`发现参与用户确实更高。老板问：\"这是不是因为大促只吸引了原本就要买的高意向用户，而不是大促导致了增长？\"要回答这个问题，懂Python的分析师下一步该写什么代码？",
      options: [
        "A. 计算两组用户的`t-test` P值。",
        "B. 尝试构建PSM（倾向性得分匹配）寻找对照组，或者写一个简单的DID（双重差分）逻辑。",
        "C. 用`seaborn`画两组对比的核密度估计图。",
        "D. 告诉老板这是哲学问题，Python解决不了。"
      ],
      correctAnswer: "B",
      feedback: "B",
      followUp: "在Python里，`psmpy`库或`causalml`库的核心作用是什么？"
    },
    {
      id: 8,
      title: "第8题：代码纠错与业务直觉题",
      stem: "同事写的Python代码片段如下，目的是找出高频购买但从不退货的优质客户。这里藏着一个巨大的业务逻辑Bug，不是语法错误，指出它。\n```python\n# orders: 订单表 (order_id, user_id, amount)\n# returns: 退货表 (return_id, order_id)\n\nmerged = pd.merge(orders, returns, on='order_id', how='left')\nmerged['is_return'] = merged['return_id'].notnull()\nresult = merged.groupby('user_id').agg(\n    total_orders=('order_id', 'count'),\n    return_orders=('is_return', 'sum')\n)\ngood_users = result[result['return_orders'] == 0]\n```",
      options: [
        "A. 代码没有Bug，逻辑正确。",
        "B. 逻辑Bug：只要用户退过任意一单，就会被永远排除在优质用户之外，这不符合业务常理。",
        "C. 应该用`how='inner'`。",
        "D. `sum`函数无法对布尔值求和。"
      ],
      correctAnswer: "B",
      feedback: "B",
      followUp: "如果一个用户买了100单，退过1单，他在这个逻辑里是`good_users`吗？这不是业务Bug吗？难道退过货就永远不能算优质？"
    },
    {
      id: 9,
      title: "第9题：帕累托分析（二八定律）的Python实现检验",
      stem: "给你一个SKU销售表，让你用Python找出贡献80%销售额的核心SKU数量。请在心里默想核心步骤。如果我不给你看代码，你能否口述出`cumsum`和`pct`这两个函数在这里的先后顺序及其索引位置的意义？",
      options: ["正确思路：先按销售额降序排序，计算累计销售额占比`cumsum / sum`，找到第一个占比≥0.8的索引位置。"],
      correctAnswer: "主观题",
      feedback: "",
      followUp: "你脑子里是先排序还是先累计求和？如果写反了，找出来的核心商品数量是多了还是少了？",
      isSubjective: true,
      correctThinking: "正确思路：先按销售额降序排序，计算累计销售额占比`cumsum / sum`，找到第一个占比≥0.8的索引位置。"
    },
    {
      id: 10,
      title: "第10题：开放性假设题：数据不足时的应对",
      stem: "老板让你用Python预测下个月双十一的GMV，但公司刚成立一年，去年双十一数据没有（数据库为空）。你无法使用ARIMA或Prophet。这时你应该打开Jupyter Notebook，写的第一行有效分析代码是什么？（提示：不是`import pandas`）",
      options: [
        "A. `print('数据不足，无法预测')`",
        "B. 获取行业大盘的历史双十一增长率数据（假如有API），基于大盘基线进行加权估算。",
        "C. `df = pd.DataFrame({'month': [11], 'gmv': [猜测值]})`",
        "D. 写爬虫去竞品网站爬数据。"
      ],
      correctAnswer: "B",
      feedback: "B",
      followUp: "如果我坚持让你用Python模拟\"最差情况\"和\"最好情况\"的区间估计，不用机器学习，只用`numpy.random`，你会用`normal`还是`uniform`？为什么？"
    }
  ];

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = (questionId: number) => {
    setShowResults(prev => ({ ...prev, [questionId]: true }));
  };

  const handleToggleFollowUp = (questionId: number) => {
    setShowFollowUps(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary">商务数据分析与Python · 实战思维测试</h1>
        
        <div className="space-y-8">
          {questions.map((question) => (
            <div key={question.id} className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-primary">{question.title}</h2>
              <p className="text-text mb-6 leading-relaxed">{question.stem}</p>
              
              {!question.isSubjective ? (
                <div className="space-y-4 mb-6">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`q${question.id}_${index}`}
                        name={`q${question.id}`}
                        value={option.charAt(0)}
                        checked={answers[question.id] === option.charAt(0)}
                        onChange={() => handleAnswerChange(question.id, option.charAt(0))}
                        className="mr-3 h-4 w-4 text-primary"
                      />
                      <label htmlFor={`q${question.id}_${index}`} className="text-text cursor-pointer">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <p className="text-text italic">{question.options[0]}</p>
                </div>
              )}
              
              {!question.isSubjective && (
                <button
                  onClick={() => handleSubmit(question.id)}
                  disabled={!answers[question.id]}
                  className="bg-primary text-white py-2 px-6 rounded-full font-bold hover:bg-secondary transition-all duration-300 disabled:opacity-50 mb-4"
                >
                  提交答案
                </button>
              )}
              
              {showResults[question.id] && !question.isSubjective && (
                <div className={`p-4 rounded-lg mb-4 ${answers[question.id] === question.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {answers[question.id] === question.correctAnswer ? (
                    <p>✅ 回答正确！你的思维很严谨。</p>
                  ) : (
                    <p>❌ 回答错误。点击下方按钮查看追问，暴露你的知识盲区。</p>
                  )}
                </div>
              )}
              
              <button
                onClick={() => handleToggleFollowUp(question.id)}
                className="text-primary font-medium hover:underline mb-4 flex items-center"
              >
                {showFollowUps[question.id] ? '收起追问' : '查看追问'}
                <svg className={`ml-2 transition-transform ${showFollowUps[question.id] ? 'rotate-180' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              
              {showFollowUps[question.id] && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-text">{question.followUp}</p>
                  {question.correctThinking && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-text font-medium">正确思路：</p>
                      <p className="text-text mt-2">{question.correctThinking}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataAnalysisTest;