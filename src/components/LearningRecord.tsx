import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaBookOpen, FaCheckCircle, FaClock, FaPercentage, FaArrowRight } from 'react-icons/fa';

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  lastAccessed: string;
  estimatedHours: number;
  completedHours: number;
}

const LearningRecord: React.FC = () => {
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseProgress();
  }, []);

  const fetchCourseProgress = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        // 模拟获取课程进度数据
        const mockProgress: CourseProgress[] = [
          {
            id: '1',
            title: 'Python基础编程',
            progress: 75,
            totalModules: 10,
            completedModules: 7,
            lastAccessed: '2024-01-20T14:30:00Z',
            estimatedHours: 20,
            completedHours: 15
          },
          {
            id: '2',
            title: '数据分析入门',
            progress: 45,
            totalModules: 8,
            completedModules: 3,
            lastAccessed: '2024-01-18T09:15:00Z',
            estimatedHours: 16,
            completedHours: 7.2
          },
          {
            id: '3',
            title: '机器学习基础',
            progress: 20,
            totalModules: 12,
            completedModules: 2,
            lastAccessed: '2024-01-15T16:45:00Z',
            estimatedHours: 24,
            completedHours: 4.8
          },
          {
            id: '4',
            title: '数据可视化',
            progress: 100,
            totalModules: 6,
            completedModules: 6,
            lastAccessed: '2024-01-10T11:20:00Z',
            estimatedHours: 12,
            completedHours: 12
          }
        ];
        setCourseProgress(mockProgress);
      }
    } catch (error) {
      console.error('Error fetching course progress:', error);
      // 提供默认数据作为后备
      setCourseProgress([
        {
          id: '1',
          title: 'Python基础编程',
          progress: 75,
          totalModules: 10,
          completedModules: 7,
          lastAccessed: '2024-01-20T14:30:00Z',
          estimatedHours: 20,
          completedHours: 15
        },
        {
          id: '2',
          title: '数据分析入门',
          progress: 45,
          totalModules: 8,
          completedModules: 3,
          lastAccessed: '2024-01-18T09:15:00Z',
          estimatedHours: 16,
          completedHours: 7.2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">学习记录</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">课程学习进度</h2>
        
        {courseProgress.map((course) => (
          <div key={course.id} className="mb-6 border-b pb-6 last:border-0 last:mb-0 last:pb-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FaBookOpen className="mr-1" size={14} />
                  <span>{course.completedModules}/{course.totalModules} 模块</span>
                  <span className="mx-2">•</span>
                  <FaClock className="mr-1" size={14} />
                  <span>{course.completedHours}/{course.estimatedHours} 小时</span>
                  <span className="mx-2">•</span>
                  <span>上次学习: {new Date(course.lastAccessed).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center">
                <FaPercentage className="text-blue-600 mr-1" />
                <span className="font-semibold text-blue-600">{course.progress}%</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`} 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-end mt-2">
              <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                {course.progress === 100 ? '查看课程' : '继续学习'}
                <FaArrowRight className="ml-1" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">学习统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaBookOpen className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">进行中课程</p>
                <p className="text-2xl font-bold">{courseProgress.filter(c => c.progress < 100).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">已完成课程</p>
                <p className="text-2xl font-bold">{courseProgress.filter(c => c.progress === 100).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaClock className="text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">总学习时长</p>
                <p className="text-2xl font-bold">
                  {courseProgress.reduce((total, course) => total + course.completedHours, 0).toFixed(1)}h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningRecord;