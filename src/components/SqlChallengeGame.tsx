import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaClock, FaTrophy, FaCheckCircle, FaTimesCircle, FaPlay, FaRedo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  description: string;
  table: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    description: '从 users 表中选择所有用户的姓名和邮箱，应该使用哪个查询？',
    table: 'users (id, name, email, age)',
    options: [
      'SELECT * FROM users;',
      'SELECT name, email FROM users;',
      'SELECT name AND email FROM users;',
      'GET name, email FROM users;'
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    description: '从 products 表中查找价格大于 100 的所有产品，正确的查询是？',
    table: 'products (id, name, price, category)',
    options: [
      'SELECT * FROM products WHERE price > 100;',
      'SELECT * FROM products WHERE price >= 100;',
      'SELECT * FROM products HAVING price > 100;',
      'SELECT price > 100 FROM products;'
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    description: '统计 orders 表中的订单总数，应该使用哪个查询？',
    table: 'orders (id, user_id, total, created_at)',
    options: [
      'SELECT COUNT() FROM orders;',
      'SELECT SUM() FROM orders;',
      'SELECT COUNT(*) FROM orders;',
      'SELECT TOTAL(*) FROM orders;'
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    description: '从 users 表和 orders 表中连接查询，获取用户姓名和他们的订单总额，正确的 JOIN 查询是？',
    table: 'users (id, name, email) | orders (id, user_id, total)',
    options: [
      'SELECT users.name, orders.total FROM users, orders;',
      'SELECT name, total FROM users INNER JOIN orders ON users.id = orders.user_id;',
      'SELECT users.name, orders.total FROM users INNER JOIN orders ON users.id = orders.user_id;',
      'SELECT users.name, orders.total WHERE users.id = orders.user_id;'
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    description: '按类别分组统计 products 表中每个类别的平均价格，正确的查询是？',
    table: 'products (id, name, price, category)',
    options: [
      'SELECT category, AVG(price) FROM products GROUP BY category;',
      'SELECT category, AVERAGE(price) FROM products GROUP BY category;',
      'SELECT category, AVG(price) FROM products ORDER BY category;',
      'SELECT category, AVG(price) FROM products GROUP BY price;'
    ],
    correctAnswer: 0
  }
];

const GAME_DURATION = 90;
const TOTAL_QUESTIONS = 5;
const CORRECT_SCORE = 20;
const WRONG_SCORE = -5;

const SqlChallengeGame: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'ended'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('sqlChallengeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  }, []);

  const endGame = useCallback(() => {
    setGameState('ended');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('sqlChallengeHighScore', score.toString());
    }
  }, [score, highScore]);

  const handleSelectAnswer = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerChecked(true);
    const question = questions[currentQuestionIndex];
    if (selectedAnswer === question.correctAnswer) {
      setScore(prev => prev + CORRECT_SCORE);
    } else {
      setScore(prev => Math.max(0, prev + WRONG_SCORE));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      endGame();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/games')}
          className="flex items-center text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          返回游戏列表
        </button>

        {gameState === 'start' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">🗃️</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">SQL挑战</h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                在限时 {GAME_DURATION} 秒内回答 {TOTAL_QUESTIONS} 道 SQL 题目，测试你的 SQL 查询能力！
              </p>
              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-purple-800 mb-2">游戏规则</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• 答对 +{CORRECT_SCORE} 分</li>
                  <li>• 答错 {WRONG_SCORE} 分</li>
                  <li>• 在 {GAME_DURATION} 秒内完成所有题目</li>
                </ul>
              </div>
              {highScore > 0 && (
                <div className="mb-6 flex items-center justify-center text-yellow-600">
                  <FaTrophy className="mr-2" />
                  <span className="font-semibold">最高分：{highScore}</span>
                </div>
              )}
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <FaPlay className="mr-2" />
                开始游戏
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">题目</span>
                <span className="font-bold text-purple-600 text-xl">{currentQuestionIndex + 1}/{TOTAL_QUESTIONS}</span>
              </div>
              <div className="flex items-center">
                <FaTrophy className="text-yellow-500 mr-2" />
                <span className="font-bold text-xl text-gray-800">{score} 分</span>
              </div>
              <div className={`flex items-center ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-800'}`}>
                <FaClock className="mr-2" />
                <span className="font-bold text-xl">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">{currentQuestion.description}</h2>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm text-gray-700">
                  表结构：{currentQuestion.table}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={isAnswerChecked}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isAnswerChecked
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : index === selectedAnswer
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-white'
                        : selectedAnswer === index
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold mr-3 ${
                        isAnswerChecked
                          ? index === currentQuestion.correctAnswer
                            ? 'bg-green-500 text-white'
                            : index === selectedAnswer
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                          : selectedAnswer === index
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-mono text-sm flex-1">{option}</span>
                      {isAnswerChecked && index === currentQuestion.correctAnswer && (
                        <FaCheckCircle className="text-green-500 ml-2" />
                      )}
                      {isAnswerChecked && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                        <FaTimesCircle className="text-red-500 ml-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    selectedAnswer === null
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  确认答案
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  {currentQuestionIndex < TOTAL_QUESTIONS - 1 ? '下一题' : '完成游戏'}
                </button>
              )}
            </div>
          </div>
        )}

        {gameState === 'ended' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">
                {score >= 60 ? '🎉' : score >= 30 ? '👍' : '💪'}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">游戏结束！</h1>
              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <div className="text-5xl font-bold text-purple-600 mb-2">{score} 分</div>
                <div className="text-gray-600">
                  {score >= 80 ? '太棒了！你是SQL高手！' :
                   score >= 60 ? '很不错！继续加油！' :
                   score >= 40 ? '还可以，再练习一下吧！' :
                   '需要多练习哦！'}
                </div>
              </div>
              {score >= highScore && score > 0 && (
                <div className="mb-6 flex items-center justify-center text-yellow-600 bg-yellow-50 rounded-lg p-3">
                  <FaTrophy className="mr-2" />
                  <span className="font-semibold">新纪录！</span>
                </div>
              )}
              {highScore > 0 && (
                <div className="mb-6 text-gray-600">
                  最高分：<span className="font-bold text-purple-600">{highScore}</span>
                </div>
              )}
              <div className="space-y-3">
                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 px-8 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <FaRedo className="mr-2" />
                  再玩一次
                </button>
                <button
                  onClick={() => navigate('/games')}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-8 rounded-xl font-semibold transition-all flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-2" />
                  返回游戏列表
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SqlChallengeGame;
