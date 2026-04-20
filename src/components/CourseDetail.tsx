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
      description: '本课程将介绍数据分析的基本概念、方法和工具，帮助学员掌握数据分析的核心技能。通过理论学习和实践练习，学员将学会如何收集、处理、分析和可视化数据，为业务决策提供支持。课程内容包括数据收集与预处理、数据可视化基础、描述性统计分析、假设检验等核心内容，并通过实际案例帮助学员巩固所学知识。',
      difficulty: 'beginner',
      duration: 10,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20analysis%20fundamentals%20course%20cover&image_size=landscape_16_9',
      instructor: {
        name: '张教授',
        bio: '拥有10年数据分析教学经验，曾在多家知名企业担任数据分析师，擅长将复杂的数据分析概念转化为易于理解的内容。',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20instructor%20portrait&image_size=square',
        expertise: ['数据分析', '统计学', '数据可视化', '商业智能']
      },
      modules: [
        {
          id: 'm1',
          title: '数据分析概述',
          description: '了解数据分析的定义、重要性和应用场景，掌握数据分析的基本流程和方法',
          order_index: 1,
          progress: 100,
          completed: true
        },
        {
          id: 'm2',
          title: '数据收集与预处理',
          description: '学习如何设计数据收集方案，处理缺失值和异常值，数据标准化和转换等预处理技术',
          order_index: 2,
          progress: 50,
          completed: false
        },
        {
          id: 'm3',
          title: '数据可视化基础',
          description: '掌握数据可视化的基本原理和工具，学习如何选择合适的图表类型展示数据',
          order_index: 3,
          progress: 0,
          completed: false
        },
        {
          id: 'm4',
          title: '描述性统计分析',
          description: '学习使用统计方法描述数据特征，包括集中趋势、离散程度和分布特征等',
          order_index: 4,
          progress: 0,
          completed: false
        },
        {
          id: 'm5',
          title: '数据分析实战案例',
          description: '通过实际案例练习数据分析技能，包括销售数据分析、用户行为分析等',
          order_index: 5,
          progress: 0,
          completed: false
        }
      ]
    },
    '2': {
      id: '2',
      title: 'Python数据分析',
      description: '本课程将教授使用Python进行数据分析的核心技能，包括NumPy、Pandas、Matplotlib等库的使用。学员将通过实际项目学习如何处理和分析数据，构建数据模型，以及生成有洞察力的报告。课程内容涵盖数据导入与导出、数据清洗与转换、数据聚合与分组、高级数据可视化等实用技能。',
      difficulty: 'intermediate',
      duration: 15,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20data%20analysis%20course%20cover&image_size=landscape_16_9',
      instructor: {
        name: '李老师',
        bio: 'Python专家，数据科学领域资深讲师，拥有丰富的教学和实战经验，曾主导多个大型数据分析项目。',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20female%20instructor%20portrait&image_size=square',
        expertise: ['Python', '数据分析', '机器学习', '数据可视化']
      },
      modules: [
        {
          id: 'm1',
          title: 'Python基础回顾',
          description: '复习Python的基本语法和数据结构，为数据分析做好准备',
          order_index: 1,
          progress: 0,
          completed: false
        },
        {
          id: 'm2',
          title: 'NumPy与Pandas',
          description: '学习使用NumPy进行数值计算，使用Pandas进行数据处理和分析',
          order_index: 2,
          progress: 0,
          completed: false
        },
        {
          id: 'm3',
          title: '数据可视化',
          description: '使用Matplotlib和Seaborn创建各种类型的数据可视化，包括折线图、柱状图、散点图等',
          order_index: 3,
          progress: 0,
          completed: false
        },
        {
          id: 'm4',
          title: '高级数据处理',
          description: '学习数据聚合、分组、透视表等高级数据处理技术',
          order_index: 4,
          progress: 0,
          completed: false
        },
        {
          id: 'm5',
          title: '数据分析项目实战',
          description: '完成一个完整的数据分析项目，从数据获取到报告生成的全流程',
          order_index: 5,
          progress: 0,
          completed: false
        }
      ]
    },
    '3': {
      id: '3',
      title: '机器学习入门',
      description: '本课程将介绍机器学习的基本原理和应用，包括监督学习、无监督学习和强化学习等核心概念。学员将学习如何构建和训练机器学习模型，以及如何评估模型性能。课程内容涵盖机器学习的数学基础、常用算法原理、模型训练与评估、特征工程等重要内容。',
      difficulty: 'intermediate',
      duration: 20,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Machine%20learning%20introduction%20course%20cover&image_size=landscape_16_9',
      instructor: {
        name: '王博士',
        bio: '机器学习专家，拥有多年研究和教学经验，发表过多篇相关领域的学术论文，曾参与多个机器学习应用项目。',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20PhD%20instructor%20portrait&image_size=square',
        expertise: ['机器学习', '人工智能', '数据挖掘', '模式识别']
      },
      modules: [
        {
          id: 'm1',
          title: '机器学习概述',
          description: '了解机器学习的基本概念、分类和应用场景，掌握机器学习的工作流程',
          order_index: 1,
          progress: 0,
          completed: false
        },
        {
          id: 'm2',
          title: '监督学习',
          description: '学习线性回归、逻辑回归、决策树、随机森林等监督学习算法的原理和应用',
          order_index: 2,
          progress: 0,
          completed: false
        },
        {
          id: 'm3',
          title: '无监督学习',
          description: '了解聚类、降维、异常检测等无监督学习算法的原理和应用',
          order_index: 3,
          progress: 0,
          completed: false
        },
        {
          id: 'm4',
          title: '模型评估与优化',
          description: '学习如何评估和优化机器学习模型，包括交叉验证、超参数调优等技术',
          order_index: 4,
          progress: 0,
          completed: false
        },
        {
          id: 'm5',
          title: '特征工程',
          description: '学习如何进行特征选择、特征提取和特征转换，提高模型性能',
          order_index: 5,
          progress: 0,
          completed: false
        }
      ]
    },
    '4': {
      id: '4',
      title: '深度学习高级',
      description: '本课程将深入介绍深度学习的高级概念和技术，包括卷积神经网络、循环神经网络、生成对抗网络等。学员将学习如何构建和训练复杂的深度学习模型，以及如何应用这些模型解决实际问题。课程内容涵盖深度学习的数学基础、各种神经网络架构、模型训练技巧、迁移学习等高级主题。',
      difficulty: 'advanced',
      duration: 25,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Advanced%20deep%20learning%20course%20cover&image_size=landscape_16_9',
      instructor: {
        name: '刘教授',
        bio: '深度学习领域专家，曾在国际知名研究机构工作，拥有丰富的教学和研究经验，发表过多篇深度学习领域的高水平论文。',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20female%20professor%20portrait&image_size=square',
        expertise: ['深度学习', '神经网络', '人工智能', '计算机视觉', '自然语言处理']
      },
      modules: [
        {
          id: 'm1',
          title: '深度学习基础',
          description: '复习深度学习的基本概念和数学基础，包括神经网络的结构和工作原理',
          order_index: 1,
          progress: 0,
          completed: false
        },
        {
          id: 'm2',
          title: '卷积神经网络',
          description: '学习CNN的原理、架构和应用，包括图像处理和计算机视觉任务',
          order_index: 2,
          progress: 0,
          completed: false
        },
        {
          id: 'm3',
          title: '循环神经网络',
          description: '了解RNN、LSTM、GRU等序列模型的原理和应用，包括自然语言处理任务',
          order_index: 3,
          progress: 0,
          completed: false
        },
        {
          id: 'm4',
          title: '生成对抗网络',
          description: '学习GAN的原理、架构和应用，包括图像生成和数据增强',
          order_index: 4,
          progress: 0,
          completed: false
        },
        {
          id: 'm5',
          title: '深度学习实践',
          description: '通过实际项目练习深度学习模型的构建、训练和部署',
          order_index: 5,
          progress: 0,
          completed: false
        }
      ]
    },
    '5': {
      id: '5',
      title: '数据可视化高级技巧',
      description: '本课程将教授高级数据可视化技术和工具，帮助学员创建专业、美观且有洞察力的数据可视化作品。课程内容包括高级图表类型、交互式可视化、数据故事讲述、可视化设计原则等，通过实际案例学习如何有效传达数据洞察。',
      difficulty: 'advanced',
      duration: 18,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Advanced%20data%20visualization%20techniques%20course%20cover&image_size=landscape_16_9',
      instructor: {
        name: '陈设计师',
        bio: '数据可视化专家，拥有多年数据可视化设计和教学经验，曾为多家企业设计数据仪表盘和可视化报告。',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20data%20visualization%20designer%20portrait&image_size=square',
        expertise: ['数据可视化', '信息设计', '数据故事讲述', '交互设计']
      },
      modules: [
        {
          id: 'm1',
          title: '数据可视化设计原则',
          description: '学习数据可视化的设计原则和最佳实践，包括色彩选择、布局设计、视觉层次等',
          order_index: 1,
          progress: 0,
          completed: false
        },
        {
          id: 'm2',
          title: '高级图表类型',
          description: '学习各种高级图表类型的应用场景和创建方法，包括热力图、树状图、桑基图等',
          order_index: 2,
          progress: 0,
          completed: false
        },
        {
          id: 'm3',
          title: '交互式可视化',
          description: '学习如何创建交互式数据可视化，包括仪表盘、动态图表等',
          order_index: 3,
          progress: 0,
          completed: false
        },
        {
          id: 'm4',
          title: '数据故事讲述',
          description: '学习如何通过数据可视化讲述有说服力的故事，有效传达数据洞察',
          order_index: 4,
          progress: 0,
          completed: false
        },
        {
          id: 'm5',
          title: '可视化工具进阶',
          description: '学习使用Tableau、Power BI等专业可视化工具创建复杂的可视化作品',
          order_index: 5,
          progress: 0,
          completed: false
        }
      ]
    },
    '6': {
      id: '6',
      title: '机器学习应用案例',
      description: '本课程通过实际案例学习机器学习在各个领域的应用，包括金融、医疗、零售、制造等行业。学员将学习如何将机器学习技术应用到实际业务问题中，从问题定义到模型部署的完整流程。课程内容包括案例分析、解决方案设计、模型实现和评估等。',
      difficulty: 'intermediate',
      duration: 22,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Machine%20learning%20application%20cases%20course%20cover&image_size=landscape_16_9',
      instructor: {
        name: '赵工程师',
        bio: '机器学习应用专家，拥有丰富的机器学习项目实战经验，曾在多个行业成功实施机器学习解决方案。',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20machine%20learning%20engineer%20portrait&image_size=square',
        expertise: ['机器学习', '数据科学', '人工智能', '行业解决方案']
      },
      modules: [
        {
          id: 'm1',
          title: '机器学习应用概述',
          description: '了解机器学习在各个行业的应用场景和价值',
          order_index: 1,
          progress: 0,
          completed: false
        },
        {
          id: 'm2',
          title: '金融行业应用',
          description: '学习机器学习在信用评分、欺诈检测、风险评估等金融领域的应用',
          order_index: 2,
          progress: 0,
          completed: false
        },
        {
          id: 'm3',
          title: '医疗健康应用',
          description: '了解机器学习在疾病诊断、药物发现、患者管理等医疗领域的应用',
          order_index: 3,
          progress: 0,
          completed: false
        },
        {
          id: 'm4',
          title: '零售与营销应用',
          description: '学习机器学习在客户 segmentation、推荐系统、需求预测等零售领域的应用',
          order_index: 4,
          progress: 0,
          completed: false
        },
        {
          id: 'm5',
          title: '智能制造应用',
          description: '了解机器学习在预测性维护、质量控制、供应链优化等制造领域的应用',
          order_index: 5,
          progress: 0,
          completed: false
        }
      ]
    },
    '7': {
      id: '7',
      title: '商业数据分析实战',
      description: '本课程将教授如何使用数据分析解决实际商业问题，包括市场分析、客户分析、运营分析、财务分析等。学员将学习如何从业务问题出发，通过数据分析找到解决方案，并有效地传达分析结果。课程内容包括商业分析框架、数据驱动决策、分析报告撰写等。',
      difficulty: 'intermediate',
      duration: 20,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Business%20data%20analysis%20case%20study%20course%20cover&image_size=landscape_16_9',
      instructor: {
        name: '孙分析师',
        bio: '商业数据分析专家，拥有多年企业数据分析经验，曾为多家企业提供数据分析咨询服务。',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20business%20data%20analyst%20portrait&image_size=square',
        expertise: ['商业分析', '数据驱动决策', '市场分析', '客户分析']
      },
      modules: [
        {
          id: 'm1',
          title: '商业数据分析基础',
          description: '了解商业数据分析的基本概念、方法和工具，掌握商业分析的流程和框架',
          order_index: 1,
          progress: 0,
          completed: false
        },
        {
          id: 'm2',
          title: '市场分析',
          description: '学习如何分析市场趋势、竞争格局、消费者行为等市场数据',
          order_index: 2,
          progress: 0,
          completed: false
        },
        {
          id: 'm3',
          title: '客户分析',
          description: '了解如何分析客户行为、客户分群、客户生命周期价值等',
          order_index: 3,
          progress: 0,
          completed: false
        },
        {
          id: 'm4',
          title: '运营分析',
          description: '学习如何分析业务运营数据，优化运营流程，提高运营效率',
          order_index: 4,
          progress: 0,
          completed: false
        },
        {
          id: 'm5',
          title: '财务分析',
          description: '了解如何分析财务数据，评估业务绩效，支持财务决策',
          order_index: 5,
          progress: 0,
          completed: false
        },
        {
          id: 'm6',
          title: '商业分析实战项目',
          description: '完成一个完整的商业数据分析项目，从问题定义到报告生成',
          order_index: 6,
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
          className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="container mx-auto px-4 py-6 sm:py-8 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm ${course.difficulty === 'beginner' ? 'bg-green-500' : course.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {course.difficulty === 'beginner' ? '初级' : course.difficulty === 'intermediate' ? '中级' : '高级'}
              </span>
              <span className="text-sm">{course.duration} 小时</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* 课程信息 */}
          <div className="lg:col-span-2">
            {/* 课程描述 */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">课程介绍</h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>

            {/* 课程大纲 */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">课程大纲</h2>
              <div className="space-y-4">
                {course.modules.map(module => (
                  <div key={module.id} className="border-b pb-4 last:border-0">
                    <div className="flex flex-wrap justify-between items-center mb-2">
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
                    <div className="mt-3">
                      <Link 
                        to={`/learn/${course.id}/${module.id}`} 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium py-2 inline-block"
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
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">学习进度</h2>
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
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                继续学习
              </button>
            </div>

            {/* 讲师信息 */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">讲师信息</h2>
              <div className="flex flex-col sm:flex-row items-center mb-4">
                <img 
                  src={course.instructor.avatar} 
                  alt={course.instructor.name} 
                  className="w-16 h-16 rounded-full object-cover mb-3 sm:mb-0 sm:mr-4"
                />
                <div className="text-center sm:text-left">
                  <h3 className="font-medium">{course.instructor.name}</h3>
                  <p className="text-sm text-gray-600">{course.instructor.bio}</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">专业领域</h4>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
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