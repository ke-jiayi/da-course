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
import PageTransition from './components/PageTransition'

// 直接导入组件，暂时不用懒加载
import Courses from './components/Courses'
import CourseDetail from './components/CourseDetail'
import Practice from './components/Practice'
import PracticeDetail from './components/PracticeDetail'
import Test from './components/Test'
import TestDetail from './components/TestDetail'
import Achievements from './components/Achievements'
import Settings from './components/Settings'
import Notifications from './components/Notifications'
import Leaderboard from './components/Leaderboard'
import DataVisualization from './components/DataVisualization'
import MachineLearning from './components/MachineLearning'
import DataMining from './components/DataMining'
import BusinessAnalysis from './components/BusinessAnalysis'
import DataCleaning from './components/DataCleaning'
import GroupAggregation from './components/GroupAggregation'
import MarketBasket from './components/MarketBasket'
import ABTesting from './components/ABTesting'
import TimeSeries from './components/TimeSeries'
import AnomalyDetection from './components/AnomalyDetection'
import PyodideTest from './components/PyodideTest'
import LearningGuide from './components/LearningGuide'
import Projects from './components/Projects'
import ProjectDetail from './components/ProjectDetail'
import CognitiveModule from './components/CognitiveModule'
import DataAnalysisTest from './components/DataAnalysisTest'

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
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/courses" element={<PageTransition><Courses /></PageTransition>} />
            <Route path="/course/:id" element={<PageTransition><CourseDetail /></PageTransition>} />
            <Route path="/practice" element={<PageTransition><Practice /></PageTransition>} />
            <Route path="/practice/:id" element={<PageTransition><PracticeDetail /></PageTransition>} />
            <Route path="/test" element={<PageTransition><Test /></PageTransition>} />
            <Route path="/test/:id" element={<PageTransition><TestDetail /></PageTransition>} />
            <Route path="/achievements" element={<PageTransition><Achievements /></PageTransition>} />
            <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            <Route path="/notifications" element={<PageTransition><Notifications /></PageTransition>} />
            <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
            <Route path="/data-visualization" element={<PageTransition><DataVisualization /></PageTransition>} />
            <Route path="/machine-learning" element={<PageTransition><MachineLearning /></PageTransition>} />
            <Route path="/data-mining" element={<PageTransition><DataMining /></PageTransition>} />
            <Route path="/business-analysis" element={<PageTransition><BusinessAnalysis /></PageTransition>} />
            <Route path="/data-cleaning" element={<PageTransition><DataCleaning /></PageTransition>} />
            <Route path="/group-aggregation" element={<PageTransition><GroupAggregation /></PageTransition>} />
            <Route path="/market-basket" element={<PageTransition><MarketBasket /></PageTransition>} />
            <Route path="/ab-testing" element={<PageTransition><ABTesting /></PageTransition>} />
            <Route path="/time-series" element={<PageTransition><TimeSeries /></PageTransition>} />
            <Route path="/anomaly-detection" element={<PageTransition><AnomalyDetection /></PageTransition>} />
            <Route path="/pyodide-test" element={<PageTransition><PyodideTest /></PageTransition>} />
            <Route path="/learning-guide" element={<PageTransition><LearningGuide /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/project/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
            <Route path="/cognitive-module" element={<PageTransition><CognitiveModule /></PageTransition>} />
            <Route path="/data-analysis-test" element={<PageTransition><DataAnalysisTest /></PageTransition>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
