import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaAward, FaTrophy, FaStar, FaChartLine, FaBookOpen, FaCheckCircle, FaClock, FaCalendar, FaCode, FaDatabase, FaChartBar, FaBrain } from 'react-icons/fa';
import { getAchievements } from '../services/achievementService';
import { getUserLevel } from '../services/levelService';
import { generateLearningReport } from '../services/reportService';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconType: 'cute' | 'professional' | 'fun';
  unlockedAt: string;
}

interface LevelInfo {
  currentLevel: number;
  progress: number;
  nextLevel: number;
}

interface LearningReport {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  achievements: number;
  strengths: string[];
  weaknesses: string[];
}

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [levelInfo, setLevelInfo] = useState<LevelInfo>({ currentLevel: 1, progress: 0, nextLevel: 2 });
  const [learningReport, setLearningReport] = useState<LearningReport>({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    achievements: 0,
    strengths: [],
    weaknesses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
    fetchLevelInfo();
    fetchLearningReport();
  }, []);

  const fetchAchievements = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        const userAchievements = await getAchievements(user.id);
        const formattedAchievements = userAchievements.map(ua => ({
          id: ua.id,
          name: ua.title || '未知成就',
          description: ua.description || '',
          icon: '🏆',
          iconType: 'professional' as const,
          unlockedAt: ua.unlocked_at
        }));
        setAchievements(formattedAchievements);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      // 提供默认数据作为后备
      setAchievements([
        {
          id: '1',
          name: '初学者',
          description: '完成第一门课程',
          icon: '🐣',
          iconType: 'cute',
          unlockedAt: '2024-01-01T12:00:00Z'
        },
        {
          id: '2',
          name: '代码大师',
          description: '完成10个编程练习',
          icon: '💻',
          iconType: 'professional',
          unlockedAt: '2024-01-15T14:30:00Z'
        },
        {
          id: '3',
          name: '学习达人',
          description: '连续学习7天',
          icon: '📚',
          iconType: 'fun',
          unlockedAt: '2024-01-20T09:15:00Z'
        },
        {
          id: '4',
          name: '数据探索者',
          description: '完成5个数据可视化任务',
          icon: '🔍',
          iconType: 'cute',
          unlockedAt: '2024-01-25T10:45:00Z'
        },
        {
          id: '5',
          name: '分析大师',
          description: '完成3个复杂数据分析项目',
          icon: '🧠',
          iconType: 'professional',
          unlockedAt: '2024-02-01T16:20:00Z'
        },
        {
          id: '6',
          name: '挑战王',
          description: '完成所有每日挑战',
          icon: '🏅',
          iconType: 'fun',
          unlockedAt: '2024-02-10T09:30:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLevelInfo = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        const levelInfo = await getUserLevel(user.id);
        if (levelInfo) {
          setLevelInfo({
            currentLevel: levelInfo.level,
            progress: Math.floor((levelInfo.experience / (levelInfo.level * 100)) * 100),
            nextLevel: levelInfo.level + 1
          });
        }
      }
    } catch (error) {
      console.error('Error fetching level info:', error);
      // 提供默认数据作为后备
      setLevelInfo({
        currentLevel: 3,
        progress: 65,
        nextLevel: 4
      });
    }
  };

  const fetchLearningReport = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        const report = await generateLearningReport(user.id);
        if (report) {
          setLearningReport({
            totalCourses: report.total_courses,
            completedCourses: report.completed_courses,
            totalHours: Math.floor(report.total_time_spent / 3600),
            achievements: 3,
            strengths: ['Python编程', '数据分析', '可视化'],
            weaknesses: ['机器学习', '统计学']
          });
        }
      }
    } catch (error) {
      console.error('Error fetching learning report:', error);
      // 提供默认数据作为后备
      setLearningReport({
        totalCourses: 5,
        completedCourses: 3,
        totalHours: 24,
        achievements: 3,
        strengths: ['Python编程', '数据分析', '可视化'],
        weaknesses: ['机器学习', '统计学']
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">我的成就</h1>
      
      {/* 等级信息 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaTrophy className="text-yellow-500 mr-2" size={24} />
          <h2 className="text-2xl font-semibold">等级信息</h2>
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">等级 {levelInfo.currentLevel}</span>
            <span className="font-medium">进度 {levelInfo.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full" 
              style={{ width: `${levelInfo.progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">距离等级 {levelInfo.nextLevel} 还有 {100 - levelInfo.progress}%</p>
        </div>
      </div>

      {/* 学习报告 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaChartLine className="text-blue-500 mr-2" size={24} />
          <h2 className="text-2xl font-semibold">学习报告</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaBookOpen className="text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">总课程数</p>
                <p className="text-2xl font-bold">{learningReport.totalCourses}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaCheckCircle className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">已完成课程</p>
                <p className="text-2xl font-bold">{learningReport.completedCourses}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaClock className="text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">学习时长</p>
                <p className="text-2xl font-bold">{learningReport.totalHours}h</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaAward className="text-yellow-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">获得成就</p>
                <p className="text-2xl font-bold">{learningReport.achievements}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">优势领域</h3>
            <ul className="list-disc list-inside space-y-1">
              {learningReport.strengths.map((strength, index) => (
                <li key={index} className="text-green-600">{strength}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">待提升领域</h3>
            <ul className="list-disc list-inside space-y-1">
              {learningReport.weaknesses.map((weakness, index) => (
                <li key={index} className="text-red-600">{weakness}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 学习热力图 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaCalendar className="text-green-500 mr-2" size={24} />
          <h2 className="text-2xl font-semibold">学习热力图</h2>
        </div>
        <div className="grid grid-cols-52 gap-1">
          {Array.from({ length: 364 }).map((_, index) => {
            const intensity = Math.random();
            return (
              <div 
                key={index} 
                className={`h-6 rounded-sm transition-transform hover:scale-110 ${
                  intensity > 0.7 ? 'bg-green-500' :
                  intensity > 0.4 ? 'bg-green-300' :
                  intensity > 0.1 ? 'bg-green-100' :
                  'bg-gray-100'
                }`}
                title={`学习强度: ${Math.round(intensity * 100)}%`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <span>过去一年</span>
          <div className="flex items-center space-x-2">
            <span>少</span>
            <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span>多</span>
          </div>
        </div>
      </div>

      {/* 技能树 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaBrain className="text-purple-500 mr-2" size={24} />
          <h2 className="text-2xl font-semibold">技能树</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center mb-3">
              <FaCode className="text-blue-500 mr-2" />
              <h3 className="font-semibold">编程技能</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Python</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>SQL</span>
                  <span>70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-3">
              <FaDatabase className="text-green-500 mr-2" />
              <h3 className="font-semibold">数据处理</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>数据清洗</span>
                  <span>90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>数据集成</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center mb-3">
              <FaChartBar className="text-yellow-500 mr-2" />
              <h3 className="font-semibold">数据可视化</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Matplotlib</span>
                  <span>80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Seaborn</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 成就列表 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <FaStar className="text-yellow-500 mr-2" size={24} />
          <h2 className="text-2xl font-semibold">我的徽章</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <div 
              key={achievement.id} 
              className={`p-5 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden ${
                achievement.iconType === 'cute' ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200' :
                achievement.iconType === 'professional' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' :
                'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-3">
                <div className="relative">
                  <span className="text-4xl mr-4 animate-pulse">{achievement.icon}</span>
                  <div className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    ✨
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                解锁于: {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
              <div className="absolute bottom-0 right-0 opacity-10">
                <FaAward size={60} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;