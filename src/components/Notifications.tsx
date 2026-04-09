import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaBell, FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTrash } from 'react-icons/fa';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        // 模拟获取通知数据
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: '课程更新',
            message: 'Python基础编程课程已更新，新增了3个实战项目',
            type: 'info',
            read: false,
            createdAt: '2024-01-20T10:30:00Z'
          },
          {
            id: '2',
            title: '学习提醒',
            message: '您有3天未学习，继续保持学习进度哦！',
            type: 'warning',
            read: false,
            createdAt: '2024-01-18T09:15:00Z'
          },
          {
            id: '3',
            title: '成就解锁',
            message: '恭喜您解锁了「学习达人」成就！',
            type: 'success',
            read: true,
            createdAt: '2024-01-15T16:45:00Z'
          },
          {
            id: '4',
            title: '系统通知',
            message: '平台将于本周日进行维护，预计停机2小时',
            type: 'info',
            read: true,
            createdAt: '2024-01-10T11:20:00Z'
          }
        ];
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // 提供默认数据作为后备
      setNotifications([
        {
          id: '1',
          title: '课程更新',
          message: 'Python基础编程课程已更新，新增了3个实战项目',
          type: 'info',
          read: false,
          createdAt: '2024-01-20T10:30:00Z'
        },
        {
          id: '2',
          title: '学习提醒',
          message: '您有3天未学习，继续保持学习进度哦！',
          type: 'warning',
          read: false,
          createdAt: '2024-01-18T09:15:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(notification => !notification.read)
    : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">通知管理</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              全部通知
            </button>
            <button 
              onClick={() => setFilter('unread')} 
              className={`px-4 py-2 rounded-md ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              未读通知
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={markAllAsRead} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={notifications.filter(n => !n.read).length === 0}
            >
              全部标记为已读
            </button>
            <button 
              onClick={deleteAll} 
              className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
              disabled={notifications.length === 0}
            >
              清空所有
            </button>
          </div>
        </div>
        
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">暂无通知</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border rounded-lg ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{notification.title}</h3>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)} 
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="标记为已读"
                      >
                        <FaCheckCircle size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification.id)} 
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="删除通知"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;