import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

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
  const [activeTab, setActiveTab] = useState('task'); // 'task', 'code', 'analysis'

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
            <li>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'analysis' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                案例分析
              </button>
            </li>
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
      </div>

      {submitted && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">评分结果</h2>
          <div className="flex items-center mb-4">
            <div className="w-24 text-lg font-medium text-gray-700">得分:</div>
            <div className="text-2xl font-bold text-blue-600">{score}/100</div>
          </div>
          <div className="mb-4">
            <div className="w-24 text-lg font-medium text-gray-700 mb-2">反馈:</div>
            <div className="bg-gray-50 p-4 rounded-md text-gray-700">{feedback}</div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setSubmitted(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              继续编辑
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeDetail;