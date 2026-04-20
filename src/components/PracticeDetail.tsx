import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { FaCheck, FaTimes, FaLightbulb, FaBook, FaCode, FaChartBar } from 'react-icons/fa';

interface Task {
  id: string;
  title: string;
  description: string;
  data?: string;
  analysis?: string[];
}

interface TestCase {
  input: string;
  expected: string;
  passed?: boolean;
  actual?: string;
  error?: string;
}

interface CodeAnalysis {
  codeQuality: number;
  performance: number;
  style: number;
  suggestions: string[];
}

interface LearningResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course';
  url: string;
  description: string;
}

interface ExerciseDetail {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  testCases: TestCase[];
}

const PracticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis | null>(null);
  const [learningResources, setLearningResources] = useState<LearningResource[]>([]);
  const [activeTab, setActiveTab] = useState('task'); // 'task', 'code', 'analysis', 'feedback'

  useEffect(() => {
    // 模拟获取练习详情数据
    const fetchExerciseDetail = async () => {
      // 实际项目中，这里应该调用API获取数据
      const mockExercise: ExerciseDetail = {
        id: id || '1',
        title: '数据清洗与预处理',
        description: '在这个练习中，你将学习如何清洗和预处理数据，包括处理缺失值、异常值等。你将使用一个真实的数据集来实践这些技能。',
        tasks: [
          {
            id: '1',
            title: '加载数据',
            description: '加载提供的数据集，并查看前几行数据以了解数据结构。',
            data: '数据集包含了电商平台的用户购买记录，包括用户ID、购买时间、商品类别、购买金额等信息。',
            analysis: [
              '数据集中有多少行和列？',
              '数据的基本统计信息是什么？',
              '数据中是否存在缺失值？'
            ]
          },
          {
            id: '2',
            title: '处理缺失值',
            description: '识别并处理数据中的缺失值。',
            analysis: [
              '哪些列存在缺失值？',
              '缺失值的比例是多少？',
              '你会如何处理这些缺失值？'
            ]
          },
          {
            id: '3',
            title: '处理异常值',
            description: '识别并处理数据中的异常值。',
            analysis: [
              '如何识别异常值？',
              '数据中存在哪些异常值？',
              '你会如何处理这些异常值？'
            ]
          },
          {
            id: '4',
            title: '数据转换',
            description: '对数据进行必要的转换，以便后续分析。',
            analysis: [
              '需要进行哪些数据转换？',
              '转换后的数据结构是什么样的？',
              '转换后的数据是否满足分析需求？'
            ]
          }
        ],
        testCases: [
          {
            input: '加载数据并显示前5行',
            expected: '成功加载数据并显示前5行'
          },
          {
            input: '处理缺失值',
            expected: '成功处理所有缺失值'
          },
          {
            input: '处理异常值',
            expected: '成功处理所有异常值'
          },
          {
            input: '数据转换',
            expected: '成功完成数据转换'
          }
        ]
      };
      
      setTimeout(() => {
        setExercise(mockExercise);
        setLoading(false);
        // 设置默认代码
        setCode(`import pandas as pd
import numpy as np

# 加载数据
df = pd.read_csv('data.csv')

# 查看数据结构
print(df.head())
print(df.info())

# 处理缺失值
# TODO: 实现缺失值处理逻辑

# 处理异常值
# TODO: 实现异常值处理逻辑

# 数据转换
# TODO: 实现数据转换逻辑
`);
      }, 500);
    };

    fetchExerciseDetail();
  }, [id]);

  const handleSubmit = () => {
    // 模拟提交和评分
    setSubmitted(true);
    setScore(85);
    setFeedback('你的代码基本正确，但在处理异常值方面还有改进空间。建议使用IQR方法来识别异常值。');
    
    // 模拟测试用例结果
    setTestResults([
      {
        input: '加载数据并显示前5行',
        expected: '成功加载数据并显示前5行',
        actual: '成功加载数据并显示前5行',
        passed: true
      },
      {
        input: '处理缺失值',
        expected: '成功处理所有缺失值',
        actual: '成功处理所有缺失值',
        passed: true
      },
      {
        input: '处理异常值',
        expected: '成功处理所有异常值',
        actual: '部分异常值未处理',
        passed: false,
        error: '建议使用IQR方法来识别异常值'
      },
      {
        input: '数据转换',
        expected: '成功完成数据转换',
        actual: '成功完成数据转换',
        passed: true
      }
    ]);
    
    // 模拟代码分析
    setCodeAnalysis({
      codeQuality: 85,
      performance: 75,
      style: 90,
      suggestions: [
        '建议添加注释以提高代码可读性',
        '考虑使用更高效的数据处理方法',
        '变量命名可以更清晰',
        '异常处理可以更加完善'
      ]
    });
    
    // 模拟学习资源推荐
    setLearningResources([
      {
        id: '1',
        title: 'Python数据清洗最佳实践',
        type: 'article',
        url: '#',
        description: '学习如何高效地清洗和预处理数据'
      },
      {
        id: '2',
        title: '异常值检测与处理',
        type: 'video',
        url: '#',
        description: '详细讲解各种异常值检测方法'
      },
      {
        id: '3',
        title: '数据分析实战课程',
        type: 'course',
        url: '#',
        description: '通过实际项目学习数据分析技能'
      }
    ]);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  if (!exercise) {
    return <div className="flex items-center justify-center h-screen">练习不存在</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/practice')}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          ← 返回练习列表
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{exercise.title}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-700 mb-4">{exercise.description}</p>

        <div className="border-b border-gray-200 mb-4">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('task')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'task' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                任务描述
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('code')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'code' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                代码编辑器
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'analysis' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                案例分析
              </button>
            </li>
            {submitted && (
              <li>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'feedback' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                >
                  详细反馈
                </button>
              </li>
            )}
          </ul>
        </div>

        {activeTab === 'task' && (
          <div className="space-y-6">
            {exercise.tasks.map((task) => (
              <div key={task.id} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">任务 {task.id}: {task.title}</h3>
                <p className="text-gray-700 mb-3">{task.description}</p>
                {task.data && (
                  <div className="bg-white p-3 rounded-md border border-gray-200 mb-3">
                    <h4 className="font-medium text-gray-700 mb-1">数据集信息:</h4>
                    <p className="text-gray-600">{task.data}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="h-96">
              <AceEditor
                mode="python"
                theme="monokai"
                onChange={setCode}
                value={code}
                name="code-editor"
                editorProps={{
                  $blockScrolling: true
                }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 4
                }}
                className="w-full h-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                提交练习
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {exercise.tasks.map((task) => (
              <div key={task.id} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">任务 {task.id}: {task.title}</h3>
                {task.analysis && task.analysis.map((question, qIndex) => (
                  <div key={qIndex} className="mb-3">
                    <p className="text-gray-700 mb-2">{qIndex + 1}. {question}</p>
                    <div className="bg-white p-3 rounded-md border border-gray-200">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="请输入你的分析..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-8">
            {/* 总体评分 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                  {score}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">总体评分</h3>
                  <p className="text-gray-600">{score >= 90 ? '优秀' : score >= 70 ? '良好' : score >= 60 ? '及格' : '需要改进'}</p>
                </div>
              </div>
              <p className="text-gray-700">{feedback}</p>
            </div>

            {/* 测试用例结果 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaCode className="mr-2 text-blue-600" />
                测试用例结果
              </h3>
              <div className="space-y-4">
                {testResults.map((test, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${test.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">测试 {index + 1}: {test.input}</h4>
                        <div className="mt-2 space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-600">期望结果:</span>
                            <p className="text-gray-700">{test.expected}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">实际结果:</span>
                            <p className={`${test.passed ? 'text-green-600' : 'text-red-600'}`}>{test.actual}</p>
                          </div>
                          {!test.passed && test.error && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">错误信息:</span>
                              <p className="text-red-600">{test.error}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`p-2 rounded-full ${test.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {test.passed ? <FaCheck /> : <FaTimes />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 代码分析 */}
            {codeAnalysis && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaChartBar className="mr-2 text-purple-600" />
                  代码分析
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">代码质量</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${codeAnalysis.codeQuality}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold">{codeAnalysis.codeQuality}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">性能</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${codeAnalysis.performance}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold">{codeAnalysis.performance}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">代码风格</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${codeAnalysis.style}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold">{codeAnalysis.style}%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                    <FaLightbulb className="mr-2 text-yellow-500" />
                    改进建议
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {codeAnalysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-gray-700">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 学习资源推荐 */}
            {learningResources.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaBook className="mr-2 text-green-600" />
                  推荐学习资源
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {learningResources.map((resource) => (
                    <div key={resource.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${resource.type === 'article' ? 'bg-blue-100 text-blue-800' : resource.type === 'video' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {resource.type === 'article' ? '文章' : resource.type === 'video' ? '视频' : '课程'}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      <a href={resource.url} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        查看资源
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>


    </div>
  );
};

export default PracticeDetail;