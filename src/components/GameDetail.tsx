import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGamepad, FaTrophy, FaFire, FaArrowLeft, FaPlay } from 'react-icons/fa';
import DataVizGame from './DataVizGame';
import SqlChallengeGame from './SqlChallengeGame';
import DataDetectiveGame from './DataDetectiveGame';

interface Game {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  playCount: number;
  icon: string;
  rules: string[];
  objectives: string[];
}

const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const mockGames: Record<string, Game> = {
    '1': {
      id: '1',
      title: '数据侦探',
      description: '通过分析数据找出隐藏的模式。在这个游戏中，你将扮演数据侦探的角色，通过分析各种数据集来解决谜题，发现隐藏的模式和趋势。',
      difficulty: 'easy',
      playCount: 1250,
      icon: '🔍',
      rules: [
        '仔细阅读每个关卡的描述和任务',
        '分析提供的数据集，找出关键线索',
        '根据提示进行推理，找出正确答案',
        '完成所有关卡即可通关'
      ],
      objectives: [
        '学习数据分析的基本方法',
        '培养数据敏感性',
        '提升逻辑推理能力',
        '掌握数据模式识别技巧'
      ]
    },
    '2': {
      id: '2',
      title: 'SQL挑战',
      description: '在限定时间内解决SQL问题。通过这个游戏，你将锻炼编写SQL查询的能力，从基础的SELECT语句到复杂的JOIN和子查询。',
      difficulty: 'medium',
      playCount: 876,
      icon: '🗃️',
      rules: [
        '每个关卡提供一个数据库和查询任务',
        '编写正确的SQL查询语句',
        '运行查询并验证结果',
        '在规定时间内完成所有挑战'
      ],
      objectives: [
        '掌握SQL基础语法',
        '学会使用JOIN操作',
        '理解子查询和聚合函数',
        '提升SQL查询优化能力'
      ]
    },
    '3': {
      id: '3',
      title: '数据可视化大赛',
      description: '创建最具创意的数据可视化作品。在这个游戏中，你将学习如何选择合适的图表类型，并创建美观且有洞察力的数据可视化作品。',
      difficulty: 'hard',
      playCount: 432,
      icon: '🎨',
      rules: [
        '根据给定的数据集选择合适的可视化方式',
        '设计清晰、美观的图表',
        '确保可视化能够有效传达信息',
        '完成所有设计任务'
      ],
      objectives: [
        '学习各种图表类型的应用场景',
        '掌握数据可视化设计原则',
        '培养数据讲故事的能力',
        '提升审美和设计能力'
      ]
    }
  };

  useEffect(() => {
    if (id) {
      setTimeout(() => {
        const gameData = mockGames[id];
        setGame(gameData);
        setLoading(false);
      }, 500);
    }
  }, [id]);

  if (isPlaying && id === '1') {
    return <DataDetectiveGame />;
  }

  if (isPlaying && id === '2') {
    return <SqlChallengeGame />;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">加载游戏详情中...</div>;
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">游戏不存在</h2>
          <Link 
            to="/games" 
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            返回游戏列表
          </Link>
        </div>
      </div>
    );
  }

  // 如果是游戏3且已开始游戏，直接渲染 DataVizGame
  if (id === '3' && isPlaying) {
    return <DataVizGame />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 游戏头部 */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <Link 
            to="/games" 
            className="text-white hover:text-gray-200 flex items-center mb-6 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            返回游戏列表
          </Link>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="text-6xl sm:text-8xl">{game.icon}</div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{game.title}</h1>
              <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  game.difficulty === 'easy' ? 'bg-green-500' : 
                  game.difficulty === 'medium' ? 'bg-yellow-500' : 
                  'bg-red-500'
                } text-white`}>
                  {game.difficulty === 'easy' ? '简单' : 
                   game.difficulty === 'medium' ? '中等' : '困难'}
                </span>
                <span className="text-white flex items-center">
                  <FaFire className="mr-1" />
                  {game.playCount} 人已玩
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* 左侧内容 */}
          <div className="lg:col-span-2">
            {/* 游戏描述 */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                <FaGamepad className="mr-2 text-purple-600" />
                游戏介绍
              </h2>
              <p className="text-gray-700 leading-relaxed">{game.description}</p>
            </div>

            {/* 游戏规则 */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                <FaGamepad className="mr-2 text-blue-600" />
                游戏规则
              </h2>
              <ul className="space-y-3">
                {game.rules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 font-medium text-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 学习目标 */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                <FaTrophy className="mr-2 text-yellow-600" />
                学习目标
              </h2>
              <ul className="space-y-3">
                {game.objectives.map((objective, index) => (
                  <li key={index} className="flex items-center">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="lg:col-span-1">
            {/* 开始游戏 */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <button 
                onClick={() => (id === '1' || id === '2' || id === '3') && setIsPlaying(true)}
                className={`w-full ${(id === '1' || id === '2' || id === '3') ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'} text-white py-4 rounded-lg font-medium transition-colors text-lg flex items-center justify-center`}
              >
                {id === '1' || id === '2' || id === '3' ? (
                  <>
                    <FaPlay className="mr-2" />
                    开始游戏
                  </>
                ) : (
                  <>
                    <FaGamepad className="mr-2" />
                    敬请期待
                  </>
                )}
              </button>
            </div>

            {/* 游戏信息 */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">游戏信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">难度</span>
                  <span className={`font-medium ${
                    game.difficulty === 'easy' ? 'text-green-600' : 
                    game.difficulty === 'medium' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {game.difficulty === 'easy' ? '简单' : 
                     game.difficulty === 'medium' ? '中等' : '困难'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">游玩人数</span>
                  <span className="font-medium">{game.playCount}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-center text-gray-600">
                    <FaFire className="mr-2 text-orange-500" />
                    <span>热门游戏</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
