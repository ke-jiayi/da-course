import { useState } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  user: any
  onLogout: () => void
  onLoginClick: () => void
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onLoginClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white rounded-b-2xl shadow-cute">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* 品牌标识 */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-primary text-2xl font-bold animate-bounce-slow">数据学院</Link>
          </div>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-text hover:text-primary font-medium transition-all duration-300">首页</Link>
            <Link to="/courses" className="text-text hover:text-primary font-medium transition-all duration-300">课程</Link>
            <Link to="/practice" className="text-text hover:text-primary font-medium transition-all duration-300">练习</Link>
            <Link to="/test" className="text-text hover:text-primary font-medium transition-all duration-300">测试</Link>
            <Link to="/games" className="text-text hover:text-primary font-medium transition-all duration-300">游戏</Link>
            <Link to="/achievements" className="text-text hover:text-primary font-medium transition-all duration-300">成就</Link>
            <Link to="/leaderboard" className="text-text hover:text-primary font-medium transition-all duration-300">排行榜</Link>
            <Link to="/learning-record" className="text-text hover:text-primary font-medium transition-all duration-300">学习记录</Link>
            <Link to="/notifications" className="text-text hover:text-primary font-medium transition-all duration-300">通知</Link>
            <Link to="/settings" className="text-text hover:text-primary font-medium transition-all duration-300">设置</Link>
            <Link to="/data-analysis-test" className="text-text hover:text-primary font-medium transition-all duration-300">思维测试</Link>
          </nav>

          {/* 用户菜单 */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none px-3 py-2 rounded-full bg-yellow hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                  <span className="text-text font-medium">{user.email}</span>
                  <svg className="w-4 h-4 text-text transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-cute py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <a href="#profile" className="block px-4 py-2 text-sm text-text hover:bg-primary hover:text-white transition-all duration-300 rounded-lg mx-1 my-0.5">个人资料</a>
                  <a href="#settings" className="block px-4 py-2 text-sm text-text hover:bg-primary hover:text-white transition-all duration-300 rounded-lg mx-1 my-0.5">设置</a>
                  <button 
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-primary hover:text-white transition-all duration-300 rounded-lg mx-1 my-0.5"
                  >
                    登出
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-primary text-white py-2 px-6 rounded-full hover:bg-secondary transition-all duration-300 font-medium shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                登录
              </button>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden text-text focus:outline-none p-3 rounded-full bg-yellow hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
          >
            <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 移动端菜单 */}
        <div className={`md:hidden mt-4 py-4 border-t border-gray-200 rounded-xl bg-white shadow-cute transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {mobileMenuOpen && (
            <div className="animate-slide-up">
              <nav className="flex flex-col space-y-2">
                <Link to="/" className="text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                  首页
                </Link>
                <Link to="/courses" className="text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                  课程
                </Link>
                <Link to="/practice" className="text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                  练习
                </Link>
                <Link to="/test" className="text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                  测试
                </Link>
                <Link to="/games" className="text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                  游戏
                </Link>
                <Link to="/achievements" className="text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                  成就
                </Link>
                <Link to="/leaderboard" className="text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                  排行榜
                </Link>
                <Link to="/learning-record" className="text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                  学习记录
                </Link>
                <Link to="/notifications" className="text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                  通知
                </Link>
                <Link to="/settings" className="text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                  设置
                </Link>
                <Link to="/data-analysis-test" className="text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                  思维测试
                </Link>
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-4">
                      <span className="text-text font-medium">{user.email}</span>
                    </div>
                    <a href="#profile" className="block text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10">
                      个人资料
                    </a>
                    <a href="#settings" className="block text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10">
                      设置
                    </a>
                    <button 
                      onClick={onLogout}
                      className="block w-full text-left text-text hover:text-primary font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10"
                    >
                      登出
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={onLoginClick}
                    className="block bg-primary text-white py-3 px-6 rounded-full hover:bg-secondary transition-all duration-300 font-medium text-center shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5 w-full"
                  >
                    登录
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header