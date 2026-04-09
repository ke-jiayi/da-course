import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Exercise {
  id: string;
  title: string;
  difficulty: string;
  description: string;
}

const Practice: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取练习列表数据
    const fetchExercises = async () => {
      // 实际项目中，这里应该调用API获取数据
      const mockExercises: Exercise[] = [
        {
          id: '1',
          title: '数据清洗与预处理',
          difficulty: '中等',
          description: '学习如何清洗和预处理数据，包括处理缺失值、异常值等'
        },
        {
          id: '2',
          title: '数据可视化',
          difficulty: '简单',
          description: '使用Matplotlib或Seaborn创建各种数据可视化图表'
        },
        {
          id: '3',
          title: '机器学习模型训练',
          difficulty: '困难',
          description: '训练一个分类模型并评估其性能'
        },
        {
          id: '4',
          title: '时间序列分析',
          difficulty: '中等',
          description: '分析时间序列数据并进行预测'
        }
      ];
      
      setTimeout(() => {
        setExercises(mockExercises);
        setLoading(false);
      }, 500);
    };

    fetchExercises();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">编程练习</h1>
        <p className="text-lg text-gray-600">通过实际项目练习提升你的数据分析技能</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{exercise.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                exercise.difficulty === '简单' ? 'bg-green-100 text-green-800' :
                exercise.difficulty === '中等' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {exercise.difficulty}
              </span>
            </div>
            <p className="text-gray-600 mb-6">{exercise.description}</p>
            <Link
              to={`/practice/${exercise.id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              开始练习
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Practice;