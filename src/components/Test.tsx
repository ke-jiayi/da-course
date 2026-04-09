import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Test {
  id: string;
  title: string;
  type: string;
  description: string;
  duration: number;
  totalQuestions: number;
}

const Test: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取测试列表数据
    const fetchTests = async () => {
      // 实际项目中，这里应该调用API获取数据
      const mockTests: Test[] = [
        {
          id: '1',
          title: '第一章 数据基础测试',
          type: '章节测试',
          description: '测试你对数据基础概念的理解',
          duration: 30,
          totalQuestions: 10
        },
        {
          id: '2',
          title: '第二章 数据分析测试',
          type: '章节测试',
          description: '测试你对数据分析方法的掌握',
          duration: 45,
          totalQuestions: 15
        },
        {
          id: '3',
          title: '综合测评 - 基础篇',
          type: '综合测评',
          description: '全面评估你的数据分析基础能力',
          duration: 60,
          totalQuestions: 20
        },
        {
          id: '4',
          title: '综合测评 - 进阶篇',
          type: '综合测评',
          description: '全面评估你的数据分析进阶能力',
          duration: 90,
          totalQuestions: 25
        }
      ];
      
      setTimeout(() => {
        setTests(mockTests);
        setLoading(false);
      }, 500);
    };

    fetchTests();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">测评中心</h1>
        <p className="text-lg text-gray-600">通过测试评估你的数据分析能力</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tests.map((test) => (
          <div key={test.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{test.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${test.type === '章节测试' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                {test.type}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{test.description}</p>
            <div className="flex justify-between text-sm text-gray-500 mb-6">
              <span>时长: {test.duration}分钟</span>
              <span>题目: {test.totalQuestions}题</span>
            </div>
            <Link
              to={`/test/${test.id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              开始测试
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Test;