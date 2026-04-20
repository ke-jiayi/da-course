import React, { useState, useEffect } from 'react';
import { FaGamepad, FaTrophy, FaStar, FaFire } from 'react-icons/fa';

interface GameChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  icon: string;
  type: 'daily' | 'weekly' | 'special';
  isCompleted: boolean;
  isActive: boolean;
}

interface LearningGame {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  playCount: number;
  icon: string;
}

const Games: React.FC = () => {
  const [challenges, setChallenges] = useState<GameChallenge[]>([]);
  const [games, setGames] = useState<LearningGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取挑战和游戏数据
    const fetchData = async () => {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 模拟挑战数据
      const mockChallenges: GameChallenge[] = [
        {
          id: '1',
          title: '每日数据分析',
          description: '完成一个数据分析任务',
          difficulty: 'easy',
          points: 10,
          icon: '📊',
          type: 'daily',
          isCompleted: false,
          isActive: true
        },
        {
          id: '2',
          title: '编程挑战',
          description: '解决3个Python编程问题',
          difficulty: 'medium',
          points: 25,
          icon: '💻',
          type: 'daily',
          isCompleted: true,
          isActive: true
        },
        {
          id: '3',
          title: '数据可视化大师',
          description: '创建5个不同类型的可视化图表',
          difficulty: 'hard',
          points: 50,
          icon: '🎨',
          type: 'weekly',
          isCompleted: false,
          isActive: true
        },
        {
          id: '4',
          title: 'SQL达人',
          description: '编写10个复杂SQL查询',
          difficulty: 'hard',
          points: 75,
          icon: '🗃️',
          type: 'special',
          isCompleted: false,
          isActive: false
        }
      ];

      // 模拟游戏数据
      const mockGames: LearningGame[] = [
        {
          id: '1',
          title: '数据侦探',
          description: '通过分析数据找出隐藏的模式',
          difficulty: 'easy',
          playCount: 1250,
          icon: '🔍'
        },
        {
          id: '2',
          title: 'SQL挑战',
          description: '在限定时间内解决SQL问题',
          difficulty: 'medium',
          playCount: 876,
          icon: '🗃️'
        },
        {
          id: '3',
          title: '数据可视化大赛',
          description: '创建最具创意的数据可视化作品',
          difficulty: 'hard',
          playCount: 432,
          icon: '🎨'
        }
      ];

      setChallenges(mockChallenges);
      setGames(mockGames);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleStartChallenge = (challengeId: string) => {
    // 处理开始挑战的逻辑
    console.log('Starting challenge:', challengeId);
  };

  const handleStartGame = (gameId: string) => {
    // 处理开始游戏的逻辑
    console.log('Starting game:', gameId);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">学习游戏与挑战</h1>
        <p className="text-lg text-gray-600">通过游戏化方式提升你的数据分析技能</p>
      </div>

      {/* 挑战部分 */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <FaTrophy className="text-yellow-500 mr-2" size={24} />
          <h2 className="text-2xl font-semibold">每日挑战</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 transform hover:scale-105 ${
                challenge.isCompleted ? 'border-2 border-green-400' :
                challenge.isActive ? 'border-2 border-blue-400' :
                'border-2 border-gray-200 opacity-70'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <span className="text-4xl mr-3">{challenge.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{challenge.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${challenge.type === 'daily' ? 'bg-blue-100 text-blue-800' : challenge.type === 'weekly' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'}`}>
                        {challenge.type === 'daily' ? '每日' : challenge.type === 'weekly' ? '每周' : '特别'}
                      </span>
                      <span className="mx-2"></span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' : challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {challenge.difficulty === 'easy' ? '简单' : challenge.difficulty === 'medium' ? '中等' : '困难'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center">
                  <FaStar className="mr-1" size={14} />
                  <span className="font-semibold">{challenge.points} 分</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6">{challenge.description}</p>
              <div className="flex justify-between items-center">
                {challenge.isCompleted ? (
                  <div className="flex items-center text-green-600">
                    ✓
                    <span className="ml-1">已完成</span>
                  </div>
                ) : challenge.isActive ? (
                  <button 
                    onClick={() => handleStartChallenge(challenge.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FaFire className="mr-1" />
                    开始挑战
                  </button>
                ) : (
                  <div className="text-gray-400">
                    即将开启
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 游戏部分 */}
      <div>
        <div className="flex items-center mb-6">
          <FaGamepad className="text-purple-500 mr-2" size={24} />
          <h2 className="text-2xl font-semibold">学习游戏</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <div 
              key={game.id} 
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-md p-6 transition-all duration-300 transform hover:scale-105 border-2 border-purple-200"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-5xl">{game.icon}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${game.difficulty === 'easy' ? 'bg-green-100 text-green-800' : game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {game.difficulty === 'easy' ? '简单' : game.difficulty === 'medium' ? '中等' : '困难'}
                </span>
              </div>
              <h3 className="font-semibold text-xl mb-2">{game.title}</h3>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-gray-600">
                  <FaFire className="mr-1" size={16} />
                  <span className="text-sm">{game.playCount} 人已玩</span>
                </div>
              </div>
              <button 
                onClick={() => handleStartGame(game.id)}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <FaGamepad className="mr-1" />
                开始游戏
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;