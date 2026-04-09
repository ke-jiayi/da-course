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
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">忘记密码</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </div>
      )}
      <form onSubmit={handleReset} className="space-y-4">
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? '发送中...' : '发送重置邮件'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          返回登录
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword
