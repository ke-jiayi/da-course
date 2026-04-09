import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface LoginProps {
  onLoginSuccess: () => void
  onSwitchToRegister: () => void
  onSwitchToForgotPassword: () => void
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
    } else {
      onLoginSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">登录</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            邮箱
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            密码
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          没有账号？立即注册
        </button>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToForgotPassword}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          忘记密码？
        </button>
      </div>
    </div>
  )
}

export default Login
