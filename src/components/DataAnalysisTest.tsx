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
  explanations?: Record<string, string>;
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
      followUp: "在数据分析中，Python计算结果只是开始。数据清洗阶段需要特别注意时间归因口径的一致性。如果分母字段（访问人数）因为代码问题被`dropna()`误删了一部分，Python在做除法时不会报错，但会导致计算结果失真。",
      explanations: {
        "A": "营销活动和爬虫流量可能会影响数据，但题目中明确提到访问人数并未明显增加，因此这两个因素不是导致转化率异常飙升的主要原因。",
        "B": "订单重复数据和高客单价用户可能会影响销售额，但不会直接导致转化率的异常变化，因为转化率是订单数与访问人数的比值。",
        "C": "正确。时间归因口径不一致是数据分析中常见的陷阱。如果订单总数和访问人数的统计时间范围不同（例如订单包含了全天数据，而访问人数只统计了部分时间），会导致计算出的转化率严重失真。这是首先需要排查的问题。",
        "D": "在未确认数据质量的情况下，重新训练模型是没有意义的。数据异常首先应该从数据本身的质量和统计口径入手，而不是直接进行模型预测。"
      }
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
      followUp: "`mean()`（均值）在面对长尾分布时容易受到极端值的影响。在Python里，可以使用`df['实付金额'].value_counts().head()`来查看是否有大量相同金额的订单，验证数据是否被特定价格的订单刷屏。",
      explanations: {
        "A": "直接根据均值差异就做出投放高端广告的决策过于草率。均值可能受到极端值或特殊订单类型的影响，需要进一步验证数据质量和分布情况。",
        "B": "虽然上海市作为大城市客单价通常较高，但直接断言数据肯定错误是不科学的。应该通过数据验证来确认，而不是仅凭经验判断。",
        "C": "正确。均值在面对长尾分布时容易被极端值影响。上海市客单价异常低可能是因为包含了大量低价值订单（如秒杀、试用装）。通过过滤订单类型或计算中位数可以更准确地反映真实客单价水平。",
        "D": "在未验证数据质量的情况下，绘制炫酷的图表是没有意义的。图表只会放大数据的表面差异，而不能解决数据质量问题。"
      }
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
      followUp: "模型预测需要考虑数据范围的局限性。如果你需要用Python给出一个相对科学的区间预测而不是一个精确值，可以考虑使用`sklearn`中的`cross_val_predict`方法结合置信区间估计，或者使用更适合预测的模型如随机森林。",
      explanations: {
        "A": "预测单个值不会导致Python算力不足或内存溢出，这不是主要问题。",
        "B": "正确。线性回归模型是基于训练数据的范围建立的，当输入值超出训练集范围时，模型的预测能力会显著下降。此外，广告费与销售额之间通常存在边际效应递减关系，即随着广告费增加，每增加一单位广告费带来的销售额增长会逐渐减少，而线性模型无法捕捉这种非线性关系。",
        "C": "StandardScaler标准化主要影响模型的收敛速度和稳定性，而不是预测值的准确性。即使没有标准化，线性回归模型也能收敛并给出预测值。",
        "D": "sklearn的LinearRegression模型可以接受列表形式的输入，不需要显式转换为numpy.array格式。"
      }
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
      followUp: "可以使用一行`pandas`代码`df.groupby('客户来源渠道').corr()`来确诊这个悖论，观察在不同渠道下的相关性。",
      explanations: {
        "A": "直接接受负相关结论并向老板汇报是不严谨的。辛普森悖论可能导致整体相关性与分层相关性方向相反，需要进一步分析。",
        "B": "正确。辛普森悖论是指在分组比较中都占优势的一方，在总评中反而成为劣势方的现象。通过引入第三个变量（如客户来源渠道）进行分层分析，可以发现不同渠道下的真实相关性，可能与整体相关性完全不同。",
        "C": "篡改数据是不道德的行为，违反了数据分析的诚信原则。",
        "D": "斯皮尔曼相关系数可以衡量非线性相关性，但不能解决辛普森悖论问题。分层分析是解决辛普森悖论的关键方法。"
      }
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
      followUp: "如果调用`confusion_matrix`，那个`[0, 1]`位置（FN，把流失用户预测为留存）的数字大，对公司意味着会错过很多可能流失的用户，无法及时采取挽留措施，导致用户流失率上升。",
      explanations: {
        "A": "在样本高度不平衡的情况下，准确率是一个误导性指标。即使模型将所有用户都预测为留存，也能获得99%的准确率，但这样的模型对识别流失用户毫无用处。",
        "B": "正确。对于不平衡分类问题，准确率不能反映模型的真实性能。需要查看召回率（Recall）来了解模型识别流失用户的能力，以及F1-Score来综合评估模型的 precision 和 recall。",
        "C": "换用XGBoost可能会提高模型性能，但仍然需要关注召回率和F1-Score等指标，而不仅仅是准确率。",
        "D": "sklearn支持处理不平衡数据，只是需要使用适当的评估指标和处理方法（如SMOTE过采样或调整分类阈值）。"
      }
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
      followUp: "如果用`qcut`导致昨天的\"重要价值客户\"今天因为数据波动掉到了\"一般客户\"，老板质问为什么，这样的Python依据不一定站得住脚，因为qcut会根据数据分布自动调整分箱边界，导致客户分层不稳定。",

      explanations: {
        "A": "qcut确实可以自动计算分位数并保持每层样本数一致，适合探索性分析，但在需要稳定的业务规则时可能会导致客户分层频繁变化。",
        "B": "cut可以根据固定业务间隔分箱，保持规则的稳定性，但可能会导致某些层的样本数极少或极多。",
        "C": "正确。qcut和cut各有优缺点，应根据具体业务场景选择：探索性分析时用qcut了解数据分布，制定运营策略时用cut保持规则稳定性。",
        "D": "手动打标签效率低下且容易出错，不符合数据分析的自动化原则。"
      }
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
      followUp: "在Python里，`psmpy`库或`causalml`库的核心作用是什么？",
      explanations: {
        "A": "t-test只能检验两组数据的均值是否存在显著差异，但不能证明因果关系，无法解决选择偏差问题。",
        "B": "正确。PSM（倾向性得分匹配）可以通过匹配相似特征的用户来控制选择偏差，DID（双重差分）可以通过比较处理组和对照组在处理前后的差异来估计因果效应。这两种方法都可以更科学地评估大促的真实效果。",
        "C": "绘制核密度估计图可以直观展示两组数据的分布差异，但同样无法解决因果推断问题。",
        "D": "因果推断是数据分析的重要任务，Python提供了多种工具和库来解决这类问题，如psmpy和causalml。"
      }
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
      followUp: "如果一个用户买了100单，退过1单，他在这个逻辑里不会被视为`good_users`。这是一个业务逻辑Bug，因为在实际业务中，有少量退货记录的用户仍然可以被视为优质客户。更合理的做法是设置一个退货率阈值，而不是完全排除有退货记录的用户。",
      explanations: {
        "A": "代码存在业务逻辑Bug，不是完全正确的。",
        "B": "正确。代码的逻辑是只要用户有任何一次退货，就会被排除在优质用户之外。但在实际业务中，一个用户可能购买了很多次，只有少数几次退货，这样的用户仍然可以被视为优质客户。更合理的做法是设置一个退货率阈值，而不是完全排除有退货记录的用户。",
        "C": "使用`how='inner'`会只保留有退货记录的订单，这与找出从不退货的用户的目标相反。",
        "D": "在Python中，`sum`函数可以对布尔值求和，True会被视为1，False会被视为0。"
      }
    },
    {
      id: 9,
      title: "第9题：帕累托分析（二八定律）的Python实现检验",
      stem: "给你一个SKU销售表，让你用Python找出贡献80%销售额的核心SKU数量。请在心里默想核心步骤。如果我不给你看代码，你能否口述出`cumsum`和`pct`这两个函数在这里的先后顺序及其索引位置的意义？",
      options: ["正确思路：先按销售额降序排序，计算累计销售额占比`cumsum / sum`，找到第一个占比≥0.8的索引位置。"],
      correctAnswer: "主观题",
      feedback: "",
      followUp: "应该先按销售额降序排序，再计算累计求和。如果写反了，找出来的核心商品数量会偏多，因为排序会打乱累计顺序。",

      isSubjective: true,
      correctThinking: "正确思路：先按销售额降序排序，计算累计销售额占比`cumsum / sum`，找到第一个占比≥0.8的索引位置。",
      explanations: {
        "解析": "帕累托分析的核心步骤是：1. 按销售额降序排序SKU，确保贡献最大的SKU排在前面；2. 计算销售额总和；3. 使用cumsum计算累计销售额；4. 计算累计销售额占比（累计销售额/总销售额）；5. 找到第一个累计占比≥80%的索引位置，该位置对应的SKU数量即为核心SKU数量。如果先累计求和再排序，会导致计算出的核心SKU数量偏多，因为排序会打乱累计顺序。"
      }
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
      followUp: "如果需要用Python模拟\"最差情况\"和\"最好情况\"的区间估计，不用机器学习，只用`numpy.random`，应该用`uniform`分布，因为uniform分布可以明确指定最小值和最大值范围，更适合模拟极端情况的区间估计。",

      explanations: {
        "A": "直接表示无法预测是消极的做法，分析师应该在数据不足的情况下寻找替代方案。",
        "B": "正确。在缺乏历史数据的情况下，使用行业大盘数据作为参考是一种合理的方法。通过获取行业双十一的历史增长率，可以基于公司当前的业务规模进行加权估算，得到一个合理的预测范围。",
        "C": "直接猜测GMV值没有任何依据，这样的预测没有参考价值。",
        "D": "爬取竞品数据可能涉及法律和道德问题，且竞品数据不一定能准确反映自身业务情况。"
      }
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
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-text font-medium mb-2">详细解析：</p>
                    {question.explanations && Object.entries(question.explanations).map(([option, explanation]) => (
                      <div key={option} className="mt-2">
                        <p className={`font-medium ${option === question.correctAnswer ? 'text-green-600' : ''}`}>{option}：{explanation}</p>
                      </div>
                    ))}
                  </div>
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
                  {question.explanations && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-text font-medium">详细解析：</p>
                      {Object.entries(question.explanations).map(([key, explanation]) => (
                        <div key={key} className="mt-2">
                          <p className="text-text">{explanation}</p>
                        </div>
                      ))}
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