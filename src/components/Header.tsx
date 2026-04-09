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
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* 品牌标识 */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-blue-600 text-2xl font-bold">数据学院</Link>
          </div>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">首页</Link>
            <Link to="/courses" className="text-gray-700 hover:text-blue-600 font-medium">课程</Link>
            <Link to="/practice" className="text-gray-700 hover:text-blue-600 font-medium">练习</Link>
            <Link to="/test" className="text-gray-700 hover:text-blue-600 font-medium">测试</Link>
            <Link to="/achievements" className="text-gray-700 hover:text-blue-600 font-medium">成就</Link>
            <Link to="/learning-record" className="text-gray-700 hover:text-blue-600 font-medium">学习记录</Link>
            <Link to="/notifications" className="text-gray-700 hover:text-blue-600 font-medium">通知</Link>
            <Link to="/settings" className="text-gray-700 hover:text-blue-600 font-medium">设置</Link>
          </nav>

          {/* 用户菜单 */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <span className="text-gray-700 font-medium">{user.email}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">个人资料</a>
                  <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">设置</a>
                  <button 
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    登出
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
              >
                登录
              </button>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">首页</Link>
              <Link to="/courses" className="text-gray-700 hover:text-blue-600 font-medium">课程</Link>
              <Link to="/practice" className="text-gray-700 hover:text-blue-600 font-medium">练习</Link>
              <Link to="/test" className="text-gray-700 hover:text-blue-600 font-medium">测试</Link>
              <Link to="/achievements" className="text-gray-700 hover:text-blue-600 font-medium">成就</Link>
              <Link to="/learning-record" className="text-gray-700 hover:text-blue-600 font-medium">学习记录</Link>
              <Link to="/notifications" className="text-gray-700 hover:text-blue-600 font-medium">通知</Link>
              <Link to="/settings" className="text-gray-700 hover:text-blue-600 font-medium">设置</Link>
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 font-medium">{user.email}</span>
                  </div>
                  <a href="#profile" className="block text-gray-700 hover:text-blue-600 font-medium">个人资料</a>
                  <a href="#settings" className="block text-gray-700 hover:text-blue-600 font-medium">设置</a>
                  <button 
                    onClick={onLogout}
                    className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium"
                  >
                    登出
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium text-center"
                >
                  登录
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header