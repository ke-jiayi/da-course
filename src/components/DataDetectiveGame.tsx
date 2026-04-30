import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaPlay, FaCheck, FaTimes, FaTrophy, FaClock, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface DataPoint {
  id: number;
  value: number;
  isOutlier: boolean;
}

interface GameState {
  status: 'start' | 'playing' | 'ended';
  score: number;
  timeLeft: number;
  level: number;
  highScore: number;
  dataPoints: DataPoint[];
  selectedId: number | null;
  feedback: { type: 'correct' | 'wrong' | null; message: string };
}

const DataDetectiveGame: React.FC = () => {
  const navigate = useNavigate();

  const initialState: GameState = {
    status: 'start',
    score: 0,
    timeLeft: 60,
    level: 1,
    highScore: 0,
    dataPoints: [],
    selectedId: null,
    feedback: { type: null, message: '' },
  };

  const [gameState, setGameState] = useState<GameState>(initialState);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('dataDetectiveHighScore');
    if (savedHighScore) {
      setGameState(prev => ({ ...prev, highScore: parseInt(savedHighScore, 10) }));
    }
  }, []);

  const generateData = useCallback((level: number) => {
    const baseCount = Math.min(5 + Math.floor(level / 2), 12);
    const points: DataPoint[] = [];
    const baseValue = 50 + Math.random() * 50;
    const variance = 5 + level * 2;

    for (let i = 0; i < baseCount - 1; i++) {
      points.push({
        id: i,
        value: Math.round(baseValue + (Math.random() - 0.5) * variance * 2),
        isOutlier: false,
      });
    }

    const outlierValue = Math.random() > 0.5
      ? baseValue + variance * 3 + Math.random() * variance * 2
      : baseValue - variance * 3 - Math.random() * variance * 2;

    points.push({
      id: baseCount - 1,
      value: Math.round(outlierValue),
      isOutlier: true,
    });

    return points.sort(() => Math.random() - 0.5);
  }, []);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      status: 'playing',
      score: 0,
      timeLeft: 60,
      level: 1,
      dataPoints: generateData(1),
      selectedId: null,
      feedback: { type: null, message: '' },
    }));
  };

  const handleSelect = (id: number) => {
    if (gameState.status !== 'playing' || gameState.selectedId !== null) return;

    const selectedPoint = gameState.dataPoints.find(p => p.id === id);
    if (!selectedPoint) return;

    const isCorrect = selectedPoint.isOutlier;
    const newScore = isCorrect 
      ? gameState.score + 10 * gameState.level 
      : Math.max(0, gameState.score - 5);

    setGameState(prev => ({
      ...prev,
      selectedId: id,
      score: newScore,
      feedback: {
        type: isCorrect ? 'correct' : 'wrong',
        message: isCorrect ? '太棒了！找对了异常值！' : '哎呀，这不是异常值哦！',
      },
    }));

    setTimeout(() => {
      const nextLevel = isCorrect ? gameState.level + 1 : gameState.level;
      setGameState(prev => ({
        ...prev,
        level: nextLevel,
        dataPoints: generateData(nextLevel),
        selectedId: null,
        feedback: { type: null, message: '' },
      }));
    }, 1500);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.status === 'playing' && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            const newHighScore = Math.max(prev.score, prev.highScore);
            if (newHighScore > prev.highScore) {
              localStorage.setItem('dataDetectiveHighScore', newHighScore.toString());
            }
            return {
              ...prev,
              timeLeft: 0,
              status: 'ended',
              highScore: newHighScore,
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.status, gameState.timeLeft]);

  const renderStartScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">数据侦探</h1>
        <p className="text-gray-600 mb-8 text-lg">
          在数据中找出异常值，成为数据分析大师！
        </p>
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-800 mb-3">游戏规则：</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span>限时 60 秒</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span>答对加分，答错扣分</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span>难度随关卡递增</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span>最高分保存在本地</span>
            </li>
          </ul>
        </div>
        {gameState.highScore > 0 && (
          <div className="mb-6 flex items-center justify-center text-yellow-600">
            <FaTrophy className="mr-2" />
            <span className="font-semibold">最高分: {gameState.highScore}</span>
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/games')}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            返回
          </button>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center"
          >
            <FaPlay className="mr-2" />
            开始游戏
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlayingScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/games')}
            className="flex items-center hover:text-gray-200 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            返回
          </button>
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <FaStar className="mr-2 text-yellow-300" />
              <span className="font-semibold">{gameState.score} 分</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">关卡</span>
              <span className="font-semibold">{gameState.level}</span>
            </div>
            <div className="flex items-center">
              <FaClock className={`mr-2 ${gameState.timeLeft <= 10 ? 'text-red-300 animate-pulse' : ''}`} />
              <span className={`font-semibold ${gameState.timeLeft <= 10 ? 'text-red-300' : ''}`}>
                {gameState.timeLeft}秒
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">找出异常值</h2>
          <p className="text-gray-600">点击表格中与其他数据差异最大的那个值</p>
        </div>

        {gameState.feedback.type && (
          <div className={`mb-6 p-4 rounded-xl text-center font-medium ${
            gameState.feedback.type === 'correct' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {gameState.feedback.type === 'correct' ? (
              <FaCheck className="inline mr-2" />
            ) : (
              <FaTimes className="inline mr-2" />
            )}
            {gameState.feedback.message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">数值</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gameState.dataPoints.map((point, index) => {
                  const isSelected = gameState.selectedId === point.id;
                  const isCorrect = isSelected && point.isOutlier;
                  const isWrong = isSelected && !point.isOutlier;

                  return (
                    <tr
                      key={point.id}
                      onClick={() => handleSelect(point.id)}
                      className={`
                        cursor-pointer transition-all duration-200 hover:bg-blue-50
                        ${isCorrect ? 'bg-green-100' : ''}
                        ${isWrong ? 'bg-red-100' : ''}
                        ${!isSelected && gameState.selectedId !== null ? 'opacity-50' : ''}
                      `}
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`
                          text-lg font-semibold
                          ${isCorrect ? 'text-green-800' : ''}
                          ${isWrong ? 'text-red-800' : ''}
                          ${!isSelected && gameState.selectedId === null ? 'text-gray-800' : ''}
                        `}>
                          {point.value}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-3">💡 提示</h3>
          <p className="text-gray-600 text-sm">
            异常值是指与其他数据点相比显著偏大或偏小的值。仔细观察每个数值，找出那个最"不合群"的！
          </p>
        </div>
      </div>
    </div>
  );

  const renderEndScreen = () => {
    const isNewHighScore = gameState.score >= gameState.highScore && gameState.score > 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-6">
            {isNewHighScore ? '🏆' : '🎉'}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">游戏结束</h1>
          
          {isNewHighScore && (
            <div className="mb-6 p-4 bg-yellow-100 rounded-xl text-yellow-800 font-semibold">
              🎊 恭喜！刷新了最高分记录！
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-600">{gameState.score}</div>
              <div className="text-gray-600 text-sm">得分</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-600">{gameState.level}</div>
              <div className="text-gray-600 text-sm">关卡</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-yellow-600">{gameState.highScore}</div>
              <div className="text-gray-600 text-sm">最高分</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              返回
            </button>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center"
            >
              <FaPlay className="mr-2" />
              再玩一次
            </button>
          </div>
        </div>
      </div>
    );
  };

  switch (gameState.status) {
    case 'start':
      return renderStartScreen();
    case 'playing':
      return renderPlayingScreen();
    case 'ended':
      return renderEndScreen();
    default:
      return renderStartScreen();
  }
};

export default DataDetectiveGame;
