import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import Header from './components/Header'
import Home from './components/Home'
import Footer from './components/Footer'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import Courses from './components/Courses'
import CourseDetail from './components/CourseDetail'
import LearnPage from './components/LearnPage'
import Practice from './components/Practice'
import PracticeDetail from './components/PracticeDetail'
import Test from './components/Test'
import TestDetail from './components/TestDetail'
import Achievements from './components/Achievements'
import LearningRecord from './components/LearningRecord'
import Settings from './components/Settings'
import Notifications from './components/Notifications'

type AuthView = 'login' | 'register' | 'forgotPassword'

function App() {
  const [user, setUser] = useState<any>(null)
  const [authView, setAuthView] = useState<AuthView | null>(null)
  const [loading, setLoading] = useState(true)

  // 监听用户会话变化
  useEffect(() => {
    let unsubscribe = () => {}
    
    // 检查supabase.auth.onAuthStateChange是否存在且返回正确的结构
    const authStateChangeResult = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user || null)
      setLoading(false)
    })
    
    if (authStateChangeResult && authStateChangeResult.data && authStateChangeResult.data.subscription) {
      unsubscribe = () => authStateChangeResult.data.subscription.unsubscribe()
    }

    // 初始检查用户状态
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user || null)
      setLoading(false)
    }

    checkUser()

    return () => unsubscribe()
  }, [])

  // 登出功能
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // 认证成功处理
  const handleAuthSuccess = () => {
    setAuthView(null)
  }

  // 打开登录模态框
  const handleOpenLogin = () => {
    setAuthView('login')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>
  }

  // 显示认证模态框
  if (authView) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {authView === 'login' && (
            <Login
              onLoginSuccess={handleAuthSuccess}
              onSwitchToRegister={() => setAuthView('register')}
              onSwitchToForgotPassword={() => setAuthView('forgotPassword')}
            />
          )}
          {authView === 'register' && (
            <Register
              onRegisterSuccess={handleAuthSuccess}
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}
          {authView === 'forgotPassword' && (
            <ForgotPassword
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}
        </div>
      </div>
    )
  }

  // 主页面
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header user={user} onLogout={handleLogout} onLoginClick={handleOpenLogin} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/learn/:courseId/:moduleId" element={<LearnPage />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/practice/:id" element={<PracticeDetail />} />
            <Route path="/test" element={<Test />} />
            <Route path="/test/:id" element={<TestDetail />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/learning-record" element={<LearningRecord />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
