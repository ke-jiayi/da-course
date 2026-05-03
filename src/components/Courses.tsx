import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  image?: string;
  gradient: string;
  icon: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'duration' | 'difficulty' | 'title'>('title');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 模拟课程数据
  const mockCourses: Course[] = [
    {
      id: 'data-visualization',
      title: '数据可视化',
      description: '学习使用图表和可视化工具展示数据，掌握数据可视化的核心技巧',
      difficulty: 'beginner',
      duration: 12,
      gradient: 'from-blue-400 to-purple-500',
      icon: '📊'
    },
    {
      id: 'machine-learning',
      title: '机器学习',
      description: '了解机器学习的基本原理和算法，掌握常用机器学习方法',
      difficulty: 'intermediate',
      duration: 20,
      gradient: 'from-purple-400 to-pink-500',
      icon: '🤖'
    },
    {
      id: 'data-mining',
      title: '数据挖掘',
      description: '学习数据挖掘的核心技术和方法，发现数据中的隐藏模式',
      difficulty: 'intermediate',
      duration: 18,
      gradient: 'from-amber-400 to-orange-500',
      icon: '⛏️'
    },
    {
      id: 'business-analysis',
      title: '商业分析',
      description: '运用数据分析解决商业问题，提升商业决策能力',
      difficulty: 'intermediate',
      duration: 15,
      gradient: 'from-emerald-400 to-teal-500',
      icon: '💼'
    },
    {
      id: 'data-cleaning',
      title: '数据清洗实战',
      description: '掌握数据清洗的核心技术，处理缺失值、异常值和重复数据',
      difficulty: 'beginner',
      duration: 10,
      gradient: 'from-cyan-400 to-blue-500',
      icon: '🧹'
    },
    {
      id: 'group-aggregation',
      title: '分组聚合分析',
      description: '学习数据分组和聚合操作，掌握SQL和Pandas中的聚合技巧',
      difficulty: 'beginner',
      duration: 8,
      gradient: 'from-green-400 to-emerald-500',
      icon: '📈'
    },
    {
      id: 'market-basket',
      title: '购物篮分析',
      description: '学习关联规则挖掘，发现商品之间的关联关系',
      difficulty: 'intermediate',
      duration: 12,
      gradient: 'from-rose-400 to-pink-500',
      icon: '🛒'
    },
    {
      id: 'ab-testing',
      title: 'A/B测试分析',
      description: '掌握A/B测试的设计与分析方法，做出数据驱动的决策',
      difficulty: 'intermediate',
      duration: 14,
      gradient: 'from-violet-400 to-purple-500',
      icon: '🧪'
    },
    {
      id: 'time-series',
      title: '时间序列分析',
      description: '学习时间序列数据的分析方法，掌握预测和趋势分析技术',
      difficulty: 'advanced',
      duration: 16,
      gradient: 'from-indigo-400 to-blue-500',
      icon: '📉'
    },
    {
      id: 'anomaly-detection',
      title: '异常值检测',
      description: '学习异常检测算法，识别数据中的异常模式和离群点',
      difficulty: 'advanced',
      duration: 14,
      gradient: 'from-red-400 to-orange-500',
      icon: '🔍'
    }
  ];

  useEffect(() => {
    // 模拟获取课程数据
    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 500);
  }, []);

  // 过滤和排序课程
  const filteredAndSortedCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = filterDifficulty === 'all' || course.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'duration') {
        return a.duration - b.duration;
      } else if (sortBy === 'difficulty') {
        const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
               difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      }
      return 0;
    });

  if (loading) {
    return <div className="flex items-center justify-center h-64">加载课程中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">课程中心</h1>
      
      {/* 搜索和筛选区域 */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="sm:col-span-1">
          <input
            type="text"
            placeholder="搜索课程..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="sm:col-span-1">
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">所有难度</option>
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
        </div>
        <div className="sm:col-span-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'duration' | 'difficulty' | 'title')}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="title">按标题</option>
            <option value="duration">按时长</option>
            <option value="difficulty">按难度</option>
          </select>
        </div>
      </div>

      {/* 课程列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredAndSortedCourses.map(course => (
          <Link to={`/courses/${course.id}`} key={course.id} className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`relative w-full h-40 sm:h-48 bg-gradient-to-br ${course.gradient} flex items-center justify-center`}>
                <div className="text-center">
                  <div className="text-6xl sm:text-7xl drop-shadow-lg">{course.icon}</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-xs ${course.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {course.difficulty === 'beginner' ? '初级' : course.difficulty === 'intermediate' ? '中级' : '高级'}
                  </span>
                  <span className="text-gray-500 text-sm">{course.duration} 小时</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;