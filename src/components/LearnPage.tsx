import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';

interface Exercise {
  id: string;
  type: 'multiple-choice' | 'code';
  question: string;
  options?: string[];
  correct_answer?: string;
  code_template?: string;
  expected_output?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  video_url: string;
  code_example: string;
  exercises: Exercise[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

const LearnPage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('1');
  const [selectedModule, setSelectedModule] = useState<string>('m1');
  const [activeTab, setActiveTab] = useState<string>('video');
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  // 课程数据
  const courses: Course[] = [
    {
      id: '1',
      title: '机器学习基础',
      description: '学习机器学习的基本概念和算法',
      modules: [
        {
          id: 'm1',
          title: '机器学习基础概念',
          description: '了解机器学习的基本概念和应用场景',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code_example: '# 机器学习基础概念示例\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# 生成示例数据\nnp.random.seed(42)\nx = np.linspace(0, 10, 100)\ny = 2 * x + 1 + np.random.normal(0, 1, 100)\n\n# 可视化数据\nplt.figure(figsize=(10, 6))\nplt.scatter(x, y, alpha=0.6)\nplt.title("示例数据")\nplt.xlabel("X")\nplt.ylabel("Y")\nplt.grid(True)\nplt.show()\n\nprint("机器学习基础概念示例")\nprint("1. 监督学习: 从标记数据中学习")\nprint("2. 无监督学习: 从未标记数据中学习")\nprint("3. 强化学习: 通过与环境交互学习")',
          exercises: [
            {
              id: 'ex1',
              type: 'multiple-choice',
              question: '以下哪种学习类型需要标记数据？',
              options: [
                '监督学习',
                '无监督学习',
                '强化学习',
                '半监督学习'
              ],
              correct_answer: '监督学习'
            },
            {
              id: 'ex2',
              type: 'multiple-choice',
              question: '聚类属于哪种学习类型？',
              options: [
                '监督学习',
                '无监督学习',
                '强化学习',
                '半监督学习'
              ],
              correct_answer: '无监督学习'
            }
          ]
        },
        {
          id: 'm2',
          title: 'Python编程基础',
          description: '学习Numpy、Pandas数据预处理方法和Scikit-learn机器学习库语法',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code_example: '# Python编程基础示例\nimport numpy as np\nimport pandas as pd\nfrom sklearn.preprocessing import StandardScaler, LabelEncoder\n\n# Numpy基础操作\nprint("=== Numpy基础操作 ===")\n# 创建数组\na = np.array([1, 2, 3, 4, 5])\nb = np.array([[1, 2, 3], [4, 5, 6]])\nprint(f"一维数组: {a}")\nprint(f"二维数组:\n{b}")\nprint(f"数组形状: {b.shape}")\n\n# 数组运算\nc = a + 1\nd = a * 2\nprint(f"a + 1: {c}")\nprint(f"a * 2: {d}")\n\n# Pandas数据预处理\nprint("\n=== Pandas数据预处理 ===")\n# 创建DataFrame\ndata = {\n    "age": [25, 30, None, 40, 45],\n    "gender": ["M", "F", "M", "F", "M"],\n    "income": [50000, 60000, 70000, None, 90000],\n    "purchase": [1, 0, 1, 1, 0]\n}\n\ndf = pd.DataFrame(data)\nprint("原始数据:\n", df)\n\n# 处理缺失值\ndf["age"].fillna(df["age"].mean(), inplace=True)\ndf["income"].fillna(df["income"].median(), inplace=True)\nprint("\n处理缺失值后:\n", df)\n\n# 标签编码\nlabel_encoder = LabelEncoder()\ndf["gender"] = label_encoder.fit_transform(df["gender"])\nprint("\n标签编码后:\n", df)\n\n# 特征缩放\nscaler = StandardScaler()\ndf[["age", "income"]] = scaler.fit_transform(df[["age", "income"]])\nprint("\n特征缩放后:\n", df)\n\n# Scikit-learn基础\nprint("\n=== Scikit-learn基础 ===")\nprint("数据预处理完成，可用于机器学习模型训练")',
          exercises: [
            {
              id: 'ex1',
              type: 'multiple-choice',
              question: '以下哪个库用于数据预处理和分析？',
              options: [
                'Numpy',
                'Pandas',
                'Matplotlib',
                'Scikit-learn'
              ],
              correct_answer: 'Pandas'
            },
            {
              id: 'ex2',
              type: 'multiple-choice',
              question: '以下哪个方法用于填充缺失值？',
              options: [
                'fillna()',
                'dropna()',
                'replace()',
                'interpolate()'
              ],
              correct_answer: 'fillna()'
            }
          ]
        },
        {
          id: 'm3',
          title: '核心知识点',
          description: '学习线性回归、逻辑回归、KNN分类和聚类算法基础',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code_example: '# 核心知识点示例\nimport numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.linear_model import LinearRegression, LogisticRegression\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.cluster import KMeans\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, r2_score\n\n# 线性回归\nprint("=== 线性回归 ===")\nnp.random.seed(42)\nx = np.linspace(0, 10, 100).reshape(-1, 1)\ny = 2 * x + 1 + np.random.normal(0, 1, 100).reshape(-1, 1)\n\nx_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)\n\nlinear_model = LinearRegression()\nlinear_model.fit(x_train, y_train)\ny_pred = linear_model.predict(x_test)\nprint(f"线性回归R² score: {r2_score(y_test, y_pred):.2f}")\n\n# 逻辑回归\nprint("\n=== 逻辑回归 ===")\n# 生成二分类数据\nx = np.random.randn(100, 2)\ny = (x[:, 0] + x[:, 1] > 0).astype(int)\n\nx_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)\n\nlogistic_model = LogisticRegression()\nlogistic_model.fit(x_train, y_train)\ny_pred = logistic_model.predict(x_test)\nprint(f"逻辑回归准确率: {accuracy_score(y_test, y_pred):.2f}")\n\n# KNN分类\nprint("\n=== KNN分类 ===")\nknn_model = KNeighborsClassifier(n_neighbors=3)\nknn_model.fit(x_train, y_train)\ny_pred = knn_model.predict(x_test)\nprint(f"KNN准确率: {accuracy_score(y_test, y_pred):.2f}")\n\n# K-means聚类\nprint("\n=== K-means聚类 ===")\n# 生成聚类数据\nx = np.random.randn(100, 2)\nkmeans = KMeans(n_clusters=3, random_state=42)\ny_pred = kmeans.fit_predict(x)\nprint(f"聚类结果形状: {y_pred.shape}")\nprint(f"聚类中心:\n{kmeans.cluster_centers_}")\n\n# 可视化聚类结果\nplt.figure(figsize=(8, 6))\nplt.scatter(x[:, 0], x[:, 1], c=y_pred, cmap="viridis")\nplt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], s=300, c="red", marker="*")\nplt.title("K-means聚类结果")\nplt.show()',
          exercises: [
            {
              id: 'ex1',
              type: 'multiple-choice',
              question: '以下哪种算法用于回归问题？',
              options: [
                '线性回归',
                '逻辑回归',
                'KNN分类',
                'K-means聚类'
              ],
              correct_answer: '线性回归'
            },
            {
              id: 'ex2',
              type: 'multiple-choice',
              question: '以下哪种算法属于无监督学习？',
              options: [
                '线性回归',
                '逻辑回归',
                'KNN分类',
                'K-means聚类'
              ],
              correct_answer: 'K-means聚类'
            }
          ]
        },
        {
          id: 'm4',
          title: '行业应用',
          description: '学习用户流失预测、商品销量预估等业务场景的应用',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code_example: '# 行业应用示例\nimport numpy as np\nimport pandas as pd\nfrom sklearn.linear_model import LogisticRegression, LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, r2_score\n\n# 用户流失预测\nprint("=== 用户流失预测 ===")\n# 生成用户数据\nnp.random.seed(42)\nn_users = 1000\ndata = {\n    "usage": np.random.normal(50, 20, n_users),\n    "support_tickets": np.random.randint(0, 10, n_users),\n    "contract_duration": np.random.randint(1, 24, n_users),\n    "churn": np.random.randint(0, 2, n_users)\n}\n\ndf = pd.DataFrame(data)\nX = df[["usage", "support_tickets", "contract_duration"]]\ny = df["churn"]\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n\nchurn_model = LogisticRegression()\nchurn_model.fit(X_train, y_train)\ny_pred = churn_model.predict(X_test)\nprint(f"用户流失预测准确率: {accuracy_score(y_test, y_pred):.2f}")\n\n# 商品销量预估\nprint("\n=== 商品销量预估 ===")\n# 生成销售数据\nnp.random.seed(42)\nmonths = 12\nad_spend = np.random.normal(10000, 2000, months)\nprice = np.random.normal(50, 10, months)\nsales = 1000 + 0.05 * ad_spend - 2 * price + np.random.normal(0, 50, months)\n\ndf = pd.DataFrame({"ad_spend": ad_spend, "price": price, "sales": sales})\nX = df[["ad_spend", "price"]]\ny = df["sales"]\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)\n\nsales_model = LinearRegression()\nsales_model.fit(X_train, y_train)\ny_pred = sales_model.predict(X_test)\nprint(f"商品销量预估R² score: {r2_score(y_test, y_pred):.2f}")\nprint(f"模型系数: {sales_model.coef_}")\nprint(f"截距: {sales_model.intercept_}")',
          exercises: [
            {
              id: 'ex1',
              type: 'multiple-choice',
              question: '用户流失预测属于哪种机器学习任务？',
              options: [
                '回归',
                '分类',
                '聚类',
                '降维'
              ],
              correct_answer: '分类'
            },
            {
              id: 'ex2',
              type: 'multiple-choice',
              question: '商品销量预估属于哪种机器学习任务？',
              options: [
                '回归',
                '分类',
                '聚类',
                '降维'
              ],
              correct_answer: '回归'
            }
          ]
        }
      ]
    }
  ];

  // 获取当前选中的课程和模块
  const currentCourse = courses.find(course => course.id === selectedCourse);
  const currentModule = currentCourse?.modules.find(module => module.id === selectedModule);

  // 处理答案提交
  const handleAnswerSubmit = (exerciseId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [exerciseId]: answer
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 课程选择 */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-2xl shadow-cute p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-text">课程选择</h2>
              <ul className="space-y-2">
                {courses.map(course => (
                  <li key={course.id}>
                    <button
                      onClick={() => setSelectedCourse(course.id)}
                      className={`w-full text-left py-2 px-4 rounded-xl transition-all duration-300 ${selectedCourse === course.id ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100'}`}
                    >
                      {course.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 模块列表 */}
            <div className="bg-white rounded-2xl shadow-cute p-6">
              <h2 className="text-xl font-bold mb-4 text-text">课程模块</h2>
              <ul className="space-y-2">
                {currentCourse?.modules.map(module => (
                  <li key={module.id}>
                    <button
                      onClick={() => setSelectedModule(module.id)}
                      className={`w-full text-left py-2 px-4 rounded-xl transition-all duration-300 ${selectedModule === module.id ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100'}`}
                    >
                      {module.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 主要内容 */}
          <div className="w-full md:w-3/4">
            {currentModule && (
              <div className="bg-white rounded-2xl shadow-cute p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2 text-text">{currentModule.title}</h2>
                <p className="text-text mb-6">{currentModule.description}</p>

                {/* 标签页 */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`py-2 px-4 border-b-2 font-medium transition-all duration-300 ${activeTab === 'video' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    视频讲解
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`py-2 px-4 border-b-2 font-medium transition-all duration-300 ${activeTab === 'code' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    代码示例
                  </button>
                  <button
                    onClick={() => setActiveTab('exercises')}
                    className={`py-2 px-4 border-b-2 font-medium transition-all duration-300 ${activeTab === 'exercises' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    练习测评
                  </button>
                </div>

                {/* 标签页内容 */}
                <div>
                  {/* 视频讲解 */}
                  {activeTab === 'video' && (
                    <div className="rounded-xl overflow-hidden bg-gray-100 p-8 text-center">
                      <p className="text-text">视频讲解功能开发中...</p>
                    </div>
                  )}

                  {/* 代码示例 */}
                  {activeTab === 'code' && (
                    <div>
                      <AceEditor
                        mode="python"
                        theme="github"
                        value={currentModule.code_example}
                        readOnly={true}
                        width="100%"
                        height="500px"
                        fontSize={14}
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        setOptions={{
                          enableBasicAutocompletion: false,
                          enableLiveAutocompletion: false,
                          enableSnippets: false,
                          enableSpellcheck: false,
                          tabSize: 4
                        }}
                      />
                    </div>
                  )}

                  {/* 练习测评 */}
                  {activeTab === 'exercises' && (
                    <div className="space-y-6">
                      {currentModule.exercises.map(exercise => (
                        <div key={exercise.id} className="bg-gray-50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold mb-4 text-text">{exercise.question}</h3>
                          
                          {exercise.type === 'multiple-choice' && (
                            <div className="space-y-2">
                              {exercise.options?.map((option, index) => (
                                <div key={index} className="flex items-center">
                                  <input
                                    type="radio"
                                    id={`${exercise.id}_${index}`}
                                    name={exercise.id}
                                    value={option}
                                    checked={answers[exercise.id] === option}
                                    onChange={(e) => handleAnswerSubmit(exercise.id, e.target.value)}
                                    className="mr-2"
                                  />
                                  <label htmlFor={`${exercise.id}_${index}`} className="text-text">
                                    {option}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {exercise.type === 'code' && (
                            <div>
                              <AceEditor
                                mode="python"
                                theme="github"
                                value={exercise.code_template || ''}
                                onChange={(value) => handleAnswerSubmit(exercise.id, value)}
                                width="100%"
                                height="300px"
                                fontSize={14}
                                showPrintMargin={false}
                                showGutter={true}
                                highlightActiveLine={true}
                                setOptions={{
                                  enableBasicAutocompletion: true,
                                  enableLiveAutocompletion: true,
                                  enableSnippets: true,
                                  enableSpellcheck: false,
                                  tabSize: 4
                                }}
                              />
                              {exercise.expected_output && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                  <h4 className="font-medium mb-2">预期输出:</h4>
                                  <pre className="text-sm text-gray-700">{exercise.expected_output}</pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;