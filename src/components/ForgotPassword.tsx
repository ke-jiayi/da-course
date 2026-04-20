import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface ForgotPasswordProps {
  onSwitchToLogin: () => void
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('密码重置邮件已发送，请查收邮箱')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-cute">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">忘记密码</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 animate-fade-in">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 animate-fade-in animate-success-pulse">
          {success}
        </div>
      )}
      <form onSubmit={handleReset} className="space-y-4">
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 px-4 rounded-full hover:bg-secondary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5 font-medium"
        >
          {loading ? '发送中...' : '发送重置邮件'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-primary hover:text-secondary text-sm transition-all duration-300"
        >
          返回登录
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword
