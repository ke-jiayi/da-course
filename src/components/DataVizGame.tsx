import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrophy, FaCheckCircle, FaTimesCircle, FaPlay } from 'react-icons/fa';

interface Question {
  id: number;
  dataDescription: string;
  data: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

const questions: Question[] = [
  {
    id: 1,
    dataDescription: '某公司过去12个月的销售额数据',
    data: '1月: 50万, 2月: 55万, 3月: 62万, 4月: 58万, 5月: 70万, 6月: 65万, 7月: 75万, 8月: 80万, 9月: 78万, 10月: 85万, 11月: 90万, 12月: 95万',
    question: '为了展示销售额随时间的变化趋势，最合适的图表类型是：',
    options: [
      { id: 'A', text: '折线图' },
      { id: 'B', text: '饼图' },
      { id: 'C', text: '散点图' },
      { id: 'D', text: '热力图' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 2,
    dataDescription: '某电商平台不同产品类别的销售额占比',
    data: '电子产品: 40%, 服装: 25%, 家居: 20%, 食品: 10%, 其他: 5%',
    question: '为了清晰展示各产品类别销售额的占比关系，最合适的图表类型是：',
    options: [
      { id: 'A', text: '柱状图' },
      { id: 'B', text: '饼图' },
      { id: 'C', text: '雷达图' },
      { id: 'D', text: '直方图' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 3,
    dataDescription: '不同城市的月平均收入对比',
    data: '北京: 15000, 上海: 16000, 广州: 12000, 深圳: 15500, 杭州: 13000, 成都: 10000',
    question: '为了直观比较不同城市的月平均收入差异，最合适的图表类型是：',
    options: [
      { id: 'A', text: '散点图' },
      { id: 'B', text: '折线图' },
      { id: 'C', text: '柱状图' },
      { id: 'D', text: '箱线图' }
    ],
    correctAnswer: 'C'
  },
  {
    id: 4,
    dataDescription: '学生的学习时间与考试成绩的关系',
    data: '学习时间(小时): 2, 3, 4, 5, 6, 7, 8, 9, 10; 成绩: 60, 65, 72, 75, 80, 82, 88, 90, 95',
    question: '为了探索学习时间和考试成绩之间的相关性，最合适的图表类型是：',
    options: [
      { id: 'A', text: '折线图' },
      { id: 'B', text: '散点图' },
      { id: 'C', text: '饼图' },
      { id: 'D', text: '雷达图' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 5,
    dataDescription: '某产品用户的年龄分布',
    data: '18-24岁: 25%, 25-34岁: 35%, 35-44岁: 22%, 45-54岁: 12%, 55岁以上: 6%',
    question: '为了展示用户在各个年龄段的分布情况，最合适的图表类型是：',
    options: [
      { id: 'A', text: '直方图' },
      { id: 'B', text: '折线图' },
      { id: 'C', text: '热力图' },
      { id: 'D', text: '散点图' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 6,
    dataDescription: '某公司各季度不同产品线的销售额',
    data: 'Q1: A线100万, B线80万, C线60万; Q2: A线120万, B线90万, C线70万; Q3: A线110万, B线95万, C线80万; Q4: A线130万, B线100万, C线90万',
    question: '为了同时比较不同产品线在各季度的销售额变化，最合适的图表类型是：',
    options: [
      { id: 'A', text: '饼图' },
      { id: 'B', text: '分组柱状图' },
      { id: 'C', text: '散点图' },
      { id: 'D', text: '热力图' }
    ],
    correctAnswer: 'B'
  }
];

const DataVizGame: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('dataVizGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerId: string) => {
    if (showResult) return;
    setSelectedAnswer(answerId);
    setShowResult(true);

    if (answerId === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 100);
    } else {
      setScore(prev => Math.max(0, prev - 25));
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState('end');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('dataVizGameHighScore', score.toString());
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-6">🎨</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">数据可视化大赛</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            测试你对图表类型选择的理解！在这个游戏中，你将面对各种数据场景，需要选择最合适的图表类型来可视化数据。
          </p>
          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-purple-800 mb-2">游戏规则</h3>
            <ul className="text-left text-gray-700 space-y-2">
              <li>• 共 6 道题目，每题 100 分</li>
              <li>• 答对 +100 分，答错 -25 分</li>
              <li>• 最高分将自动保存</li>
            </ul>
          </div>
          {highScore > 0 && (
            <div className="bg-yellow-50 rounded-xl p-4 mb-6 flex items-center justify-center">
              <FaTrophy className="text-yellow-500 mr-2" size={20} />
              <span className="text-yellow-800 font-semibold">历史最高分: {highScore}</span>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              返回
            </button>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <FaPlay className="mr-2" />
              开始游戏
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const question = questions[currentQuestion];
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/games')}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors flex items-center shadow-sm"
            >
              <FaArrowLeft className="mr-2" />
              返回
            </button>
            <div className="bg-white px-6 py-2 rounded-full shadow-sm">
              <span className="font-semibold text-purple-600">题目 {currentQuestion + 1}/{questions.length}</span>
            </div>
            <div className="bg-white px-6 py-2 rounded-full shadow-sm">
              <span className="font-semibold text-blue-600">分数: {score}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">数据场景</h3>
              <p className="text-gray-700 mb-3">{question.dataDescription}</p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-600 font-mono text-sm">{question.data}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h2>

            <div className="space-y-3 mb-6">
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrect = option.id === question.correctAnswer;
                const showCorrectness = showResult;

                let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ';
                
                if (showCorrectness) {
                  if (isCorrect) {
                    buttonClass += 'border-green-500 bg-green-50 text-green-800';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'border-red-500 bg-red-50 text-red-800';
                  } else {
                    buttonClass += 'border-gray-200 bg-gray-50 text-gray-500';
                  }
                } else if (isSelected) {
                  buttonClass += 'border-purple-500 bg-purple-50 text-purple-800';
                } else {
                  buttonClass += 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700';
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {option.id}. {option.text}
                      </span>
                      {showCorrectness && isCorrect && (
                        <FaCheckCircle className="text-green-500" />
                      )}
                      {showCorrectness && isSelected && !isCorrect && (
                        <FaTimesCircle className="text-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={nextQuestion}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  {currentQuestion < questions.length - 1 ? '下一题' : '查看结果'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'end') {
    const isNewHighScore = score > 0 && score >= highScore;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-6">{isNewHighScore ? '🏆' : '🎉'}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">游戏结束！</h1>
          
          {isNewHighScore && (
            <div className="bg-yellow-100 text-yellow-800 rounded-xl p-4 mb-6">
              <p className="font-bold text-lg">恭喜！创造了新纪录！</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 rounded-xl p-6">
              <p className="text-gray-600 mb-1">本次得分</p>
              <p className="text-3xl font-bold text-purple-600">{score}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-6">
              <p className="text-gray-600 mb-1">历史最高</p>
              <p className="text-3xl font-bold text-blue-600">{highScore}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-700">
              {score >= 500 ? '太棒了！你是数据可视化大师！' :
               score >= 300 ? '不错！你的数据可视化知识很棒！' :
               '继续加油！多学习数据可视化知识！'}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              返回
            </button>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <FaPlay className="mr-2" />
              再玩一次
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DataVizGame;
