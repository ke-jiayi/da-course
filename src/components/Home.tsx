import React from 'react';
import LazyImage from './LazyImage';

const Home: React.FC = () => {
  // 课程分类数据
  const courseCategories = [
    {
      id: 1,
      title: "数据可视化",
      description: "学习如何使用各种工具创建直观、有效的数据可视化",
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20visualization%20dashboard%20with%20pastel%20colors%20and%20cute%20design&image_size=square",
      link: "/data-visualization"
    },
    {
      id: 2,
      title: "机器学习",
      description: "掌握机器学习算法和模型，解决实际业务问题",
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20concept%20with%20pastel%20colors%20and%20cute%20design&image_size=square",
      link: "/machine-learning"
    },
    {
      id: 3,
      title: "数据挖掘",
      description: "学习从大量数据中提取有价值信息的技术和方法",
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20mining%20concept%20with%20pastel%20colors%20and%20cute%20design&image_size=square",
      link: "/data-mining"
    },
    {
      id: 4,
      title: "商业分析",
      description: "利用数据分析技能解决商业问题，制定决策",
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20analytics%20dashboard%20with%20pastel%20colors%20and%20cute%20design&image_size=square",
      link: "/business-analysis"
    }
  ]

  // 最新动态数据
  const latestNews = [
    {
      id: 1,
      title: "平台新增10门数据分析课程",
      date: "2026-04-01",
      description: "我们新增了10门数据分析相关课程，涵盖数据可视化、机器学习等多个领域。"
    },
    {
      id: 2,
      title: "数据学院与知名企业达成合作",
      date: "2026-03-15",
      description: "我们与多家知名企业达成合作，为学员提供更多实战项目和就业机会。"
    },
    {
      id: 3,
      title: "2026年数据分析行业趋势报告发布",
      date: "2026-03-01",
      description: "我们发布了2026年数据分析行业趋势报告，为学员提供行业洞察。"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* 平台介绍 */}
      <section className="bg-primary text-white py-16 md:py-24 rounded-b-3xl shadow-cute">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight animate-bounce-slow">数据学院</h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-10 leading-relaxed">
              专注于数据分析教育的在线学习平台，提供高质量的课程和实战项目，
              帮助学员掌握数据分析技能，开启职业新篇章。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#courses" className="bg-white text-primary py-3 px-6 sm:px-8 rounded-full font-bold hover:bg-yellow transition-all duration-300 shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5">
                浏览课程
              </a>
              <a href="#about" className="bg-transparent border-2 border-white text-white py-3 px-6 sm:px-8 rounded-full font-bold hover:bg-white hover:text-primary transition-all duration-300 shadow-button transform hover:-translate-y-0.5">
                了解更多
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 课程分类 */}
      <section id="courses" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 md:mb-16 text-center text-text">课程分类</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {courseCategories.map((category) => (
              <div key={category.id} className="bg-yellow rounded-2xl overflow-hidden shadow-cute hover:shadow-cute-hover transition-all duration-300 transform hover:-translate-y-2">
                <LazyImage 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-48 sm:h-56 rounded-t-2xl"
                />
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-text">{category.title}</h3>
                  <p className="text-text mb-4 sm:mb-6 leading-relaxed">{category.description}</p>
                  <a href={category.link} className="inline-flex items-center text-primary font-medium hover:underline transition-all duration-300 group">
                    查看课程
                    <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最新动态 */}
      <section id="news" className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 md:mb-16 text-center text-text">最新动态</h2>
          <div className="max-w-3xl mx-auto">
            {latestNews.map((news) => (
              <div key={news.id} className="bg-white rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-cute hover:shadow-cute-hover transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-text">{news.title}</h3>
                  <span className="text-gray-500 text-sm bg-purple px-3 py-1 rounded-full inline-flex items-center">
                    {news.date}
                  </span>
                </div>
                <p className="text-text leading-relaxed">{news.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 关于我们 */}
      <section id="about" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 md:mb-16 text-center text-text">关于我们</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-text mb-8 sm:mb-12 leading-relaxed">
              数据学院成立于2020年，是一家专注于数据分析教育的在线学习平台。我们的使命是通过高质量的教育内容，
              帮助更多人掌握数据分析技能，实现职业发展。我们拥有一支由行业专家组成的教师团队，
              为学员提供理论与实践相结合的学习体验。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-accent p-6 sm:p-8 rounded-2xl shadow-cute hover:shadow-cute-hover transition-all duration-300 transform hover:scale-105">
                <div className="text-primary text-3xl sm:text-4xl font-bold mb-3">50+</div>
                <div className="text-text text-base sm:text-lg">精品课程</div>
              </div>
              <div className="bg-secondary p-6 sm:p-8 rounded-2xl shadow-cute hover:shadow-cute-hover transition-all duration-300 transform hover:scale-105">
                <div className="text-primary text-3xl sm:text-4xl font-bold mb-3">10,000+</div>
                <div className="text-text text-base sm:text-lg">注册学员</div>
              </div>
              <div className="bg-yellow p-6 sm:p-8 rounded-2xl shadow-cute hover:shadow-cute-hover transition-all duration-300 transform hover:scale-105">
                <div className="text-primary text-3xl sm:text-4xl font-bold mb-3">95%</div>
                <div className="text-text text-base sm:text-lg">学员满意度</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home