import { useState, useEffect, Suspense, lazy } from 'react'
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

// 懒加载组件
const Courses = lazy(() => import('./components/Courses'))
const CourseDetail = lazy(() => import('./components/CourseDetail'))
const LearnPage = lazy(() => import('./components/LearnPage'))
const Practice = lazy(() => import('./components/Practice'))
const PracticeDetail = lazy(() => import('./components/PracticeDetail'))
const Test = lazy(() => import('./components/Test'))
const TestDetail = lazy(() => import('./components/TestDetail'))
const Achievements = lazy(() => import('./components/Achievements'))
const LearningRecord = lazy(() => import('./components/LearningRecord'))
const Settings = lazy(() => import('./components/Settings'))
const Notifications = lazy(() => import('./components/Notifications'))
const Games = lazy(() => import('./components/Games'))
const Leaderboard = lazy(() => import('./components/Leaderboard'))
const DataVisualization = lazy(() => import('./components/DataVisualization'))
const MachineLearning = lazy(() => import('./components/MachineLearning'))
const DataMining = lazy(() => import('./components/DataMining'))
const BusinessAnalysis = lazy(() => import('./components/BusinessAnalysis'))
const PyodideTest = lazy(() => import('./components/PyodideTest'))
const LearningGuide = lazy(() => import('./components/LearningGuide'))
const Projects = lazy(() => import('./components/Projects'))
const ProjectDetail = lazy(() => import('./components/ProjectDetail'))
const CognitiveModule = lazy(() => import('./components/CognitiveModule'))
const DataAnalysisTest = lazy(() => import('./components/DataAnalysisTest'))

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
          <Suspense fallback={<div className="flex items-center justify-center h-screen">加载中...</div>}>
            <Routes>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/courses" element={<PageTransition><Courses /></PageTransition>} />
              <Route path="/course/:id" element={<PageTransition><CourseDetail /></PageTransition>} />
              <Route path="/learn/:courseId/:moduleId" element={<PageTransition><LearnPage /></PageTransition>} />
              <Route path="/practice" element={<PageTransition><Practice /></PageTransition>} />
              <Route path="/practice/:id" element={<PageTransition><PracticeDetail /></PageTransition>} />
              <Route path="/test" element={<PageTransition><Test /></PageTransition>} />
              <Route path="/test/:id" element={<PageTransition><TestDetail /></PageTransition>} />
              <Route path="/achievements" element={<PageTransition><Achievements /></PageTransition>} />
              <Route path="/learning-record" element={<PageTransition><LearningRecord /></PageTransition>} />
              <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
              <Route path="/notifications" element={<PageTransition><Notifications /></PageTransition>} />
              <Route path="/games" element={<PageTransition><Games /></PageTransition>} />
              <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
              <Route path="/data-visualization" element={<PageTransition><DataVisualization /></PageTransition>} />
              <Route path="/machine-learning" element={<PageTransition><MachineLearning /></PageTransition>} />
              <Route path="/data-mining" element={<PageTransition><DataMining /></PageTransition>} />
              <Route path="/business-analysis" element={<PageTransition><BusinessAnalysis /></PageTransition>} />
              <Route path="/pyodide-test" element={<PageTransition><PyodideTest /></PageTransition>} />
              <Route path="/learning-guide" element={<PageTransition><LearningGuide /></PageTransition>} />
              <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
              <Route path="/project/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
              <Route path="/cognitive-module" element={<PageTransition><CognitiveModule /></PageTransition>} />
              <Route path="/data-analysis-test" element={<PageTransition><DataAnalysisTest /></PageTransition>} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
