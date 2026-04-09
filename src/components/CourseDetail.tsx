import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  image: string;
  modules: CourseModule[];
  instructor: Instructor;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  order_index: number;
  progress: number;
  completed: boolean;
}

interface Instructor {
  name: string;
  bio: string;
  avatar: string;
  expertise: string[];
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  // 模拟课程数据
  const mockCourses: Record<string, Course> = {
    '1': {
      id: '1',
      title: '数据分析基础',
      description: '本课程将介绍数据分析的基本概念、方法和工具，帮助学员掌握数据分析的核心技能。通过理论学习和实践练习，学员将学会如何收集、处理、分析和可视化数据，为业务决策提供支持。',
      difficulty: 'beginner',
      duration: 10,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20analysis%20fundamentals%20course%20cover&image_size=landscape_16_9',
      instructor: {
        name: '张教授',
        bio: '拥有10年数据分析教学经验，曾在多家知名企业担任数据分析师。',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20instructor%20portrait&image_size=square',
        expertise: ['数据分析', '统计学', '数据可视化']
      },
      modules: [
        {
          id: 'm1',
          title: '数据分析概述',
          description: '了解数据分析的定义、重要性和应用场景',
          order_index: 1,
          progress: 100,
          completed: true
        },
        {
          id: 'm2',
          title: '数据收集与预处理',
          description: '学习如何收集和清洗数据',
          order_index: 2,
          progress: 50,
          completed: false
        },
        {
          id: 'm3',
          title: '数据可视化',
          description: '掌握数据可视化的基本原理和工具',
          order_index: 3,
          progress: 0,
          completed: false
        },
        {
          id: 'm4',
          title: '数据分析实战',
          description: '通过实际案例练习数据分析技能',
          order_index: 4,
          progress: 0,
          completed: false
        }
      ]
    },
    '2': {
      id: '2',
      title: 'Python数据分析',
      description: '本课程将教授使用Python进行数据分析的核心技能，包括NumPy、Pandas、Matplotlib等库的使用。学员将通过实际项目学习如何处理和分析数据，构建数据模型，以及生成有洞察力的报告。',
      difficulty: 'intermediate',
      duration: 15,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20data%20analysis%20course%20cover&image_size=landscape_16_9',
      instructor: {
        name: '李老师',
        bio: 'Python专家，数据科学领域资深讲师，拥有丰富的教学和实战经验。',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20female%20instructor%20portrait&image_size=square',
        expertise: ['Python', '数据分析', '机器学习']
      },
      modules: [
        {
          id: 'm1',
          title: 'Python基础回顾',
          description: '复习Python的基本语法和数据结构',
          order_index: 1,
          progress: 0,
          completed: false
        },
        {
          id: 'm2',
          title: 'NumPy与Pandas',
          description: '学习使用NumPy和Pandas进行数据处理',
          order_index: 2,
          progress: 0,
          completed: false
        },
        {
          id: 'm3',
          title: '数据可视化',
          description: '使用Matplotlib和Seaborn创建数据可视化',
          order_index: 3,
          progress: 0,
          completed: false
        },
        {
          id: 'm4',
          title: '数据分析项目实战',
          description: '完成一个完整的数据分析项目',
          order_index: 4,
          progress: 0,
          completed: false
        }
      ]
    },
    '3': {
      id: '3',
      title: '机器学习入门',
      description: '本课程将介绍机器学习的基本原理和应用，包括监督学习、无监督学习和强化学习等核心概念。学员将学习如何构建和训练机器学习模型，以及如何评估模型性能。',
      difficulty: 'intermediate',
      duration: 20,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Machine%20learning%20introduction%20course%20cover&image_size=landscape_16_9',
      instructor: {
        name: '王博士',
        bio: '机器学习专家，拥有多年研究和教学经验，发表过多篇相关领域的学术论文。',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20PhD%20instructor%20portrait&image_size=square',
        expertise: ['机器学习', '人工智能', '数据挖掘']
      },
      modules: [
        {
          id: 'm1',
          title: '机器学习概述',
          description: '了解机器学习的基本概念和应用场景',
          order_index: 1,
          progress: 0,
          completed: false
        },
        {
          id: 'm2',
          title: '监督学习',
          description: '学习线性回归、逻辑回归、决策树等监督学习算法',
          order_index: 2,
          progress: 0,
          completed: false
        },
        {
          id: 'm3',
          title: '无监督学习',
          description: '了解聚类、降维等无监督学习算法',
          order_index: 3,
          progress: 0,
          completed: false
        },
        {
          id: 'm4',
          title: '模型评估与优化',
          description: '学习如何评估和优化机器学习模型',
          order_index: 4,
          progress: 0,
          completed: false
        }
      ]
    },
    '4': {
      id: '4',
      title: '深度学习高级',
      description: '本课程将深入介绍深度学习的高级概念和技术，包括卷积神经网络、循环神经网络、生成对抗网络等。学员将学习如何构建和训练复杂的深度学习模型，以及如何应用这些模型解决实际问题。',
      difficulty: 'advanced',
      duration: 25,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Advanced%20deep%20learning%20course%20cover&image_size=landscape_16_9',
      instructor: {
        name: '刘教授',
        bio: '深度学习领域专家，曾在国际知名研究机构工作，拥有丰富的教学和研究经验。',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20female%20professor%20portrait&image_size=square',
        expertise: ['深度学习', '神经网络', '人工智能']
      },
      modules: [
        {
          id: 'm1',
          title: '深度学习基础',
          description: '复习深度学习的基本概念和数学基础',
          order_index: 1,
          progress: 0,
          completed: false
        },
        {
          id: 'm2',
          title: '卷积神经网络',
          description: '学习CNN的原理和应用',
          order_index: 2,
          progress: 0,
          completed: false
        },
        {
          id: 'm3',
          title: '循环神经网络',
          description: '了解RNN、LSTM等序列模型',
          order_index: 3,
          progress: 0,
          completed: false
        },
        {
          id: 'm4',
          title: '生成对抗网络',
          description: '学习GAN的原理和应用',
          order_index: 4,
          progress: 0,
          completed: false
        }
      ]
    }
  };

  useEffect(() => {
    // 模拟获取课程详情
    if (id) {
      setTimeout(() => {
        const courseData = mockCourses[id];
        setCourse(courseData);
        
        // 计算总体进度
        if (courseData) {
          const totalProgress = courseData.modules.reduce((sum, module) => sum + module.progress, 0);
          const avgProgress = totalProgress / courseData.modules.length;
          setOverallProgress(avgProgress);
        }
        
        setLoading(false);
      }, 500);
    }
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">加载课程详情中...</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center h-64">课程不存在</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 课程封面 */}
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="container mx-auto px-4 py-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm ${course.difficulty === 'beginner' ? 'bg-green-500' : course.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {course.difficulty === 'beginner' ? '初级' : course.difficulty === 'intermediate' ? '中级' : '高级'}
              </span>
              <span className="text-sm">{course.duration} 小时</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 课程信息 */}
          <div className="lg:col-span-2">
            {/* 课程描述 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">课程介绍</h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>

            {/* 课程大纲 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">课程大纲</h2>
              <div className="space-y-4">
                {course.modules.map(module => (
                  <div key={module.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{module.order_index}. {module.title}</h3>
                      <span className="text-sm text-gray-500">
                        {module.completed ? '已完成' : `${module.progress}%`}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{module.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-2">
                      <Link 
                        to={`/learn/${course.id}/${module.id}`} 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        开始学习
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            {/* 课程进度 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">学习进度</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">总体进度</span>
                  <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                继续学习
              </button>
            </div>

            {/* 讲师信息 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">讲师信息</h2>
              <div className="flex items-center mb-4">
                <img 
                  src={course.instructor.avatar} 
                  alt={course.instructor.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium">{course.instructor.name}</h3>
                  <p className="text-sm text-gray-600">{course.instructor.bio}</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">专业领域</h4>
                <div className="flex flex-wrap gap-2">
                  {course.instructor.expertise.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;