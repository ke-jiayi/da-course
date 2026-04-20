import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface RegisterProps {
  onRegisterSuccess: () => void
  onSwitchToLogin: () => void
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setError(error.message)
    } else {
      onRegisterSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-cute">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">注册</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1 transition-all duration-300">
            邮箱
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:border-primary/50 focus:border-primary"
          />
        </div>
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-text mb-1 transition-all duration-300">
            密码
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:border-primary/50 focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 px-4 rounded-full hover:bg-secondary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5 font-medium"
        >
          {loading ? '注册中...' : '注册'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-primary hover:text-secondary text-sm transition-all duration-300"
        >
          已有账号？立即登录
        </button>
      </div>
    </div>
  )
}

export default Register
