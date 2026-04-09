const Home: React.FC = () => {
  // 课程分类数据
  const courseCategories = [
    {
      id: 1,
      title: "数据可视化",
      description: "学习如何使用各种工具创建直观、有效的数据可视化",
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20visualization%20dashboard%20with%20charts%20and%20graphs&image_size=square"
    },
    {
      id: 2,
      title: "机器学习",
      description: "掌握机器学习算法和模型，解决实际业务问题",
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20concept%20with%20neural%20networks&image_size=square"
    },
    {
      id: 3,
      title: "数据挖掘",
      description: "学习从大量数据中提取有价值信息的技术和方法",
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20mining%20concept%20with%20data%20points%20and%20connections&image_size=square"
    },
    {
      id: 4,
      title: "商业分析",
      description: "利用数据分析技能解决商业问题，制定决策",
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20analytics%20dashboard%20with%20key%20metrics&image_size=square"
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
    <div className="min-h-screen bg-gray-50">
      {/* 平台介绍 */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">数据学院</h1>
            <p className="text-xl mb-8">
              专注于数据分析教育的在线学习平台，提供高质量的课程和实战项目，
              帮助学员掌握数据分析技能，开启职业新篇章。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#courses" className="bg-white text-blue-600 py-3 px-6 rounded-md font-bold hover:bg-gray-100 transition duration-300">
                浏览课程
              </a>
              <a href="#about" className="bg-transparent border-2 border-white text-white py-3 px-6 rounded-md font-bold hover:bg-white hover:text-blue-600 transition duration-300">
                了解更多
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 课程分类 */}
      <section id="courses" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">课程分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courseCategories.map((category) => (
              <div key={category.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <a href="#" className="text-blue-600 font-medium hover:underline">
                    查看课程 →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最新动态 */}
      <section id="news" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">最新动态</h2>
          <div className="max-w-3xl mx-auto">
            {latestNews.map((news) => (
              <div key={news.id} className="bg-white rounded-lg p-6 mb-6 shadow-md hover:shadow-lg transition duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{news.title}</h3>
                  <span className="text-gray-500 text-sm">{news.date}</span>
                </div>
                <p className="text-gray-600">{news.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 关于我们 */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">关于我们</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 mb-8">
              数据学院成立于2020年，是一家专注于数据分析教育的在线学习平台。我们的使命是通过高质量的教育内容，
              帮助更多人掌握数据分析技能，实现职业发展。我们拥有一支由行业专家组成的教师团队，
              为学员提供理论与实践相结合的学习体验。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-600 text-3xl font-bold mb-2">50+</div>
                <div className="text-gray-600">精品课程</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-600 text-3xl font-bold mb-2">10,000+</div>
                <div className="text-gray-600">注册学员</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-600 text-3xl font-bold mb-2">95%</div>
                <div className="text-gray-600">学员满意度</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home