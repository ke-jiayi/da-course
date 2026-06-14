import React from 'react'

interface Course {
  title: string
  difficulty: '入门' | '进阶' | '高级'
  duration: string
  icon: string
  dataset: string
  link: string
  gradient: string
}

const courses: Course[] = [
  { title: '数据可视化', difficulty: '入门', duration: '30分钟', icon: '📊', dataset: 'retail_orders.csv', link: '/data-visualization', gradient: 'from-blue-400 to-purple-500' },
  { title: '机器学习', difficulty: '入门', duration: '30分钟', icon: '🤖', dataset: 'customer_features.csv', link: '/machine-learning', gradient: 'from-purple-400 to-pink-500' },
  { title: '数据挖掘', difficulty: '入门', duration: '30分钟', icon: '⛏️', dataset: 'market_basket.csv', link: '/data-mining', gradient: 'from-amber-400 to-orange-500' },
  { title: '商业分析', difficulty: '进阶', duration: '45分钟', icon: '💼', dataset: 'ab_test.csv', link: '/business-analysis', gradient: 'from-emerald-400 to-teal-500' },
  { title: '数据清洗实战', difficulty: '入门', duration: '30分钟', icon: '🧹', dataset: 'retail_orders.csv', link: '/data-cleaning', gradient: 'from-cyan-400 to-blue-500' },
  { title: '分组聚合分析', difficulty: '入门', duration: '30分钟', icon: '📈', dataset: 'retail_orders.csv', link: '/group-aggregation', gradient: 'from-green-400 to-emerald-500' },
  { title: '购物篮分析', difficulty: '进阶', duration: '45分钟', icon: '🛒', dataset: 'market_basket.csv', link: '/market-basket', gradient: 'from-rose-400 to-pink-500' },
  { title: 'A/B测试分析', difficulty: '进阶', duration: '45分钟', icon: '🧪', dataset: 'ab_test.csv', link: '/ab-testing', gradient: 'from-violet-400 to-purple-500' },
  { title: '时间序列分析', difficulty: '进阶', duration: '45分钟', icon: '📉', dataset: 'time_series_sales.csv', link: '/time-series', gradient: 'from-indigo-400 to-blue-500' },
  { title: '异常值检测', difficulty: '高级', duration: '60分钟', icon: '🔍', dataset: 'customer_features.csv', link: '/anomaly-detection', gradient: 'from-red-400 to-orange-500' },
]

const badges = [
  { icon: '📦', label: '真实数据集' },
  { icon: '⚡', label: '实时运行代码' },
  { icon: '📚', label: '循序渐进' },
  { icon: '🏅', label: '徽章认证' },
]

const difficultyStyles: Record<Course['difficulty'], string> = {
  入门: 'bg-green-100 text-green-700',
  进阶: 'bg-yellow-100 text-yellow-700',
  高级: 'bg-red-100 text-red-700',
}

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary via-secondary to-accent text-white py-16 md:py-24 rounded-b-[2.5rem] shadow-cute">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              🐍 数据学院
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 leading-relaxed opacity-95">
              10个精选实战项目，从入门到进阶，完全在浏览器中运行代码
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm sm:text-base px-4 py-2 rounded-full font-medium shadow-cute"
                >
                  <span className="mr-1">{badge.icon}</span>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center text-text">
            精选课程
          </h2>
          <p className="text-center text-gray-600 mb-12 md:mb-16 text-base sm:text-lg">
            选择一门课程，开启你的数据分析之旅
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {courses.map((course) => (
              <a
                key={course.link}
                href={course.link}
                className="group bg-white rounded-2xl p-5 shadow-cute hover:shadow-cute-hover transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
              >
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${course.gradient} flex items-center justify-center text-3xl shadow-md`}>
                    <span>{course.icon}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-text text-center mb-3">
                  {course.title}
                </h3>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyStyles[course.difficulty]}`}>
                    {course.difficulty}
                  </span>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      ⏱ {course.duration}
                    </span>
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded mb-4 text-center">
                  📁 {course.dataset}
                </div>
                <div className="mt-auto text-center">
                  <span className="inline-flex items-center justify-center bg-primary text-white text-sm font-medium px-4 py-2 rounded-full shadow-button group-hover:shadow-button-hover group-hover:-translate-y-0.5 transition-all duration-300">
                    开始学习 →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-base sm:text-lg">
            让数据分析学习更直观有趣 ✨
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
