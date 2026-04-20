import React, { useState, useEffect } from 'react';
import { FaStar, FaUser, FaAward } from 'react-icons/fa';

interface UserRank {
  id: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
  level: number;
  progress: number;
  isCurrentUser: boolean;
}

const Leaderboard: React.FC = () => {
  const [ranks, setRanks] = useState<UserRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    // 模拟获取排行榜数据
    const fetchLeaderboard = async () => {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 模拟排行榜数据
      const mockRanks: UserRank[] = [
        {
          id: '1',
          username: '数据分析大师',
          avatar: '👨‍💻',
          score: 1250,
          rank: 1,
          level: 10,
          progress: 85,
          isCurrentUser: false
        },
        {
          id: '2',
          username: '数据可视化专家',
          avatar: '🎨',
          score: 1120,
          rank: 2,
          level: 9,
          progress: 65,
          isCurrentUser: false
        },
        {
          id: '3',
          username: 'Python高手',
          avatar: '🐍',
          score: 980,
          rank: 3,
          level: 8,
          progress: 45,
          isCurrentUser: false
        },
        {
          id: '4',
          username: '数据探索者',
          avatar: '🔍',
          score: 850,
          rank: 4,
          level: 7,
          progress: 75,
          isCurrentUser: true
        },
        {
          id: '5',
          username: 'SQL达人',
          avatar: '🗃️',
          score: 720,
          rank: 5,
          level: 6,
          progress: 35,
          isCurrentUser: false
        },
        {
          id: '6',
          username: '机器学习爱好者',
          avatar: '🤖',
          score: 680,
          rank: 6,
          level: 5,
          progress: 90,
          isCurrentUser: false
        },
        {
          id: '7',
          username: '数据分析师新手',
          avatar: '🐣',
          score: 450,
          rank: 7,
          level: 3,
          progress: 60,
          isCurrentUser: false
        },
        {
          id: '8',
          username: '统计学家',
          avatar: '📊',
          score: 320,
          rank: 8,
          level: 2,
          progress: 25,
          isCurrentUser: false
        }
      ];

      setRanks(mockRanks);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [timeFrame]);

  const handleTimeFrameChange = (frame: 'week' | 'month' | 'all') => {
    setTimeFrame(frame);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">积分排行榜</h1>
        <p className="text-lg text-gray-600">查看数据分析师的积分排名</p>
      </div>

      {/* 时间范围选择 */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${timeFrame === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => handleTimeFrameChange('week')}
          >
            本周
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${timeFrame === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => handleTimeFrameChange('month')}
          >
            本月
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${timeFrame === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => handleTimeFrameChange('all')}
          >
            总榜
          </button>
        </div>
      </div>

      {/* 排行榜 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">排名</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">用户</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">积分</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">等级</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">进度</th>
              </tr>
            </thead>
            <tbody>
              {ranks.map((user) => (
                <tr 
                  key={user.id} 
                  className={`border-b border-gray-200 hover:bg-gray-50 ${user.isCurrentUser ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {user.rank <= 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                          {user.rank}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 font-bold bg-gray-100">
                          {user.rank}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{user.avatar}</span>
                      <div>
                        <div className="font-medium text-gray-900">{user.username}</div>
                        {user.isCurrentUser && (
                          <div className="text-xs text-blue-600 font-medium">你</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" size={16} />
                      <span className="font-semibold text-gray-900">{user.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <FaAward className="text-blue-500 mr-1" size={16} />
                      <span className="text-gray-900">{user.level}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${user.progress}%` }}></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{user.progress}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 我的排名 */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaUser className="mr-2 text-blue-600" />
            我的排名
          </h2>
          {ranks.find(user => user.isCurrentUser) && (
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                  {ranks.find(user => user.isCurrentUser)?.rank}
                </div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">积分</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {ranks.find(user => user.isCurrentUser)?.score}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">等级</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {ranks.find(user => user.isCurrentUser)?.level}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">排名</div>
                    <div className="text-2xl font-bold text-gray-800">
                      #{ranks.find(user => user.isCurrentUser)?.rank}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">进步</div>
                    <div className="text-2xl font-bold text-green-600 flex items-center">
                      ↑
                      <span className="ml-1">+5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;