import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaUser, FaLock, FaBell, FaLanguage, FaThemeisle, FaSave, FaUndo } from 'react-icons/fa';

interface UserInfo {
  email: string;
  fullName: string;
  avatar?: string;
}

interface Preferences {
  notifications: boolean;
  emailNotifications: boolean;
  language: string;
  theme: string;
}

const Settings: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: '',
    fullName: '',
    avatar: ''
  });
  const [preferences, setPreferences] = useState<Preferences>({
    notifications: true,
    emailNotifications: true,
    language: 'zh-CN',
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchUserInfo();
    fetchPreferences();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        setUserInfo({
          email: user.email || '',
          fullName: user.user_metadata?.full_name || '',
          avatar: user.user_metadata?.avatar || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchPreferences = async () => {
    try {
      // 模拟获取用户偏好设置
      const mockPreferences: Preferences = {
        notifications: true,
        emailNotifications: true,
        language: 'zh-CN',
        theme: 'light'
      };
      setPreferences(mockPreferences);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // 模拟保存设置
      console.log('Saving settings:', { userInfo, preferences });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleReset = () => {
    fetchUserInfo();
    fetchPreferences();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">个人设置</h1>
      
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">设置已保存！</strong>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 账号信息 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <FaUser className="text-blue-600 mr-2" size={24} />
            <h2 className="text-2xl font-semibold">账号信息</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input 
                type="email" 
                value={userInfo.email} 
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <input 
                type="text" 
                value={userInfo.fullName} 
                onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">头像</label>
              <input 
                type="file" 
                accept="image/*" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <div className="flex space-x-2">
                <input 
                  type="password" 
                  placeholder="输入新密码" 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <FaLock className="mr-1" size={14} />
                  修改
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 偏好设置 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <FaBell className="text-blue-600 mr-2" size={24} />
            <h2 className="text-2xl font-semibold">偏好设置</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">站内通知</label>
                <p className="text-xs text-gray-500">接收课程更新和系统通知</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferences.notifications} 
                  onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">邮件通知</label>
                <p className="text-xs text-gray-500">接收重要通知和课程提醒</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferences.emailNotifications} 
                  onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaLanguage className="inline mr-1" size={14} />
                语言
              </label>
              <select 
                value={preferences.language} 
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaThemeisle className="inline mr-1" size={14} />
                主题
              </label>
              <select 
                value={preferences.theme} 
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">浅色</option>
                <option value="dark">深色</option>
                <option value="system">跟随系统</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* 保存按钮 */}
      <div className="mt-8 flex justify-center space-x-4">
        <button 
          onClick={handleReset} 
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
        >
          <FaUndo className="mr-1" />
          重置
        </button>
        <button 
          onClick={handleSave} 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaSave className="mr-1" />
          保存设置
        </button>
      </div>
    </div>
  );
};

export default Settings;