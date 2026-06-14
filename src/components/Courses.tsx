import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: '入门' | '进阶' | '高级';
  duration: string;
  icon: string;
  dataset: string;
  gradient: string;
}

const courses: Course[] = [
  { id: 'data-visualization', title: '数据可视化', description: '学习使用图表和可视化工具展示数据，掌握数据可视化的核心技巧', difficulty: '入门', duration: '30分钟', icon: '📊', dataset: '零售订单数据集', gradient: 'from-blue-400 to-purple-500' },
  { id: 'machine-learning', title: '机器学习', description: '了解机器学习的基本原理和算法，掌握常用机器学习方法', difficulty: '进阶', duration: '45分钟', icon: '🤖', dataset: '客户特征数据集', gradient: 'from-purple-400 to-pink-500' },
  { id: 'data-mining', title: '数据挖掘', description: '学习数据挖掘的核心技术和方法，发现数据中的隐藏模式', difficulty: '进阶', duration: '45分钟', icon: '⛏️', dataset: '购物篮数据集', gradient: 'from-amber-400 to-orange-500' },
  { id: 'business-analysis', title: '商业分析', description: '运用数据分析解决商业问题，提升商业决策能力', difficulty: '进阶', duration: '45分钟', icon: '💼', dataset: 'A/B测试数据集', gradient: 'from-emerald-400 to-teal-500' },
  { id: 'data-cleaning', title: '数据清洗实战', description: '掌握数据清洗的核心技术，处理缺失值、异常值和重复数据', difficulty: '入门', duration: '30分钟', icon: '🧹', dataset: '有问题的订单数据', gradient: 'from-cyan-400 to-blue-500' },
  { id: 'group-aggregation', title: '分组聚合分析', description: '学习数据分组和聚合操作，掌握 SQL 和 Pandas 中的聚合技巧', difficulty: '入门', duration: '30分钟', icon: '📈', dataset: '订单数据集', gradient: 'from-green-400 to-emerald-500' },
  { id: 'market-basket', title: '购物篮分析', description: '学习关联规则挖掘，发现商品之间的关联关系', difficulty: '进阶', duration: '45分钟', icon: '🛒', dataset: '购物记录数据集', gradient: 'from-rose-400 to-pink-500' },
  { id: 'ab-testing', title: 'A/B测试分析', description: '掌握A/B测试的设计与分析方法，做出数据驱动的决策', difficulty: '进阶', duration: '45分钟', icon: '🧪', dataset: 'A/B测试数据集', gradient: 'from-violet-400 to-purple-500' },
  { id: 'time-series', title: '时间序列分析', description: '学习时间序列数据的分析方法，掌握预测和趋势分析技术', difficulty: '高级', duration: '60分钟', icon: '📉', dataset: '月度销售数据', gradient: 'from-indigo-400 to-blue-500' },
  { id: 'anomaly-detection', title: '异常值检测', description: '学习异常检测算法，识别数据中的异常模式和离群点', difficulty: '高级', duration: '60分钟', icon: '🔍', dataset: '客户行为数据', gradient: 'from-red-400 to-orange-500' },
];

const difficultyStyles: Record<Course['difficulty'], string> = {
  '入门': 'bg-green-100 text-green-700',
  '进阶': 'bg-yellow-100 text-yellow-700',
  '高级': 'bg-red-100 text-red-700',
};

const Courses: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | Course['difficulty']>('all');

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        searchQuery === '' ||
        course.title.includes(searchQuery) ||
        course.description.includes(searchQuery) ||
        course.dataset.includes(searchQuery);
      const matchesDifficulty = filterDifficulty === 'all' || course.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [searchQuery, filterDifficulty]);

  return (
    <div className="min-h-screen bg-background py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-primary">📚 课程中心</h1>
          <p className="text-gray-600 text-base md:text-lg">选择一门课程，开始你的数据分析之旅</p>
        </div>

        {/* 搜索和筛选 */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="🔍 搜索课程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as 'all' | Course['difficulty'])}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option value="all">所有难度</option>
              <option value="入门">入门</option>
              <option value="进阶">进阶</option>
              <option value="高级">高级</option>
            </select>
          </div>
        </div>

        {/* 课程卡片 */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-6xl mb-4">🔎</div>
            <p>没有找到匹配的课程，请尝试其他关键词。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                to={`/${course.id}`}
                className="group bg-white rounded-2xl p-5 shadow-cute hover:shadow-cute-hover transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
              >
                <div className="flex justify-center mb-4">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${course.gradient} flex items-center justify-center text-4xl shadow-md`}>
                    <span>{course.icon}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-text text-center mb-3">{course.title}</h3>
                <p className="text-sm text-gray-600 text-center mb-3 line-clamp-2">{course.description}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyStyles[course.difficulty]}`}>
                    {course.difficulty}
                  </span>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">⏱ {course.duration}</span>
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded mb-4 text-center">
                  📁 {course.dataset}
                </div>
                <div className="mt-auto text-center">
                  <span className="inline-flex items-center justify-center bg-primary text-white text-sm font-medium px-4 py-2 rounded-full shadow-button group-hover:shadow-button-hover group-hover:-translate-y-0.5 transition-all duration-300">
                    开始学习 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
