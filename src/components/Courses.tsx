import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  image: string;
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
      id: '1',
      title: '数据分析基础',
      description: '学习数据分析的基本概念和方法',
      difficulty: 'beginner',
      duration: 10,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20analysis%20fundamentals%20course%20cover&image_size=square'
    },
    {
      id: '2',
      title: 'Python数据分析',
      description: '使用Python进行数据处理和分析',
      difficulty: 'intermediate',
      duration: 15,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20data%20analysis%20course%20cover&image_size=square'
    },
    {
      id: '3',
      title: '机器学习入门',
      description: '了解机器学习的基本原理和应用',
      difficulty: 'intermediate',
      duration: 20,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Machine%20learning%20introduction%20course%20cover&image_size=square'
    },
    {
      id: '4',
      title: '深度学习高级',
      description: '深入学习深度学习算法和模型',
      difficulty: 'advanced',
      duration: 25,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Advanced%20deep%20learning%20course%20cover&image_size=square'
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
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            placeholder="搜索课程..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="all">所有难度</option>
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
        </div>
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'duration' | 'difficulty' | 'title')}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="title">按标题</option>
            <option value="duration">按时长</option>
            <option value="difficulty">按难度</option>
          </select>
        </div>
      </div>

      {/* 课程列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCourses.map(course => (
          <Link to={`/courses/${course.id}`} key={course.id} className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
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