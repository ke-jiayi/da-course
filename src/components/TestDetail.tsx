import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  type: 'single' | 'multiple' | 'judgment' | 'essay';
  content: string;
  options?: string[];
  correctAnswer: string | string[];
  score: number;
}

interface TestDetail {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
  type: string;
}

interface TestHistory {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  totalScore: number;
  completedAt: string;
}

const TestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [history, setHistory] = useState<TestHistory[]>([]);
  const [activeTab, setActiveTab] = useState('test'); // 'test', 'result', 'history'

  useEffect(() => {
    // 模拟获取测试详情数据
    const fetchTestDetail = async () => {
      // 实际项目中，这里应该调用API获取数据
      const mockTest: TestDetail = {
        id: id || '1',
        title: '第一章 数据基础测试',
        description: '测试你对数据基础概念的理解',
        duration: 30,
        type: '章节测试',
        questions: [
          {
            id: '1',
            type: 'single',
            content: '下列哪种数据类型不属于基本数据类型？',
            options: ['整数', '字符串', '数组', '布尔值'],
            correctAnswer: '数组',
            score: 10
          },
          {
            id: '2',
            type: 'multiple',
            content: '以下哪些是数据分析的步骤？',
            options: ['数据收集', '数据清洗', '数据可视化', '数据存储'],
            correctAnswer: ['数据收集', '数据清洗', '数据可视化'],
            score: 15
          },
          {
            id: '3',
            type: 'judgment',
            content: '数据清洗是数据分析的最后一步。',
            correctAnswer: 'false',
            score: 5
          },
          {
            id: '4',
            type: 'essay',
            content: '请简述数据预处理的重要性。',
            correctAnswer: '数据预处理是数据分析的重要步骤，它可以提高数据质量，减少噪声，确保分析结果的准确性和可靠性。',
            score: 20
          }
        ]
      };
      
      // 模拟历史记录
      const mockHistory: TestHistory[] = [
        {
          id: '1',
          testId: '1',
          testTitle: '第一章 数据基础测试',
          score: 85,
          totalScore: 100,
          completedAt: '2024-01-15 14:30:00'
        },
        {
          id: '2',
          testId: '1',
          testTitle: '第一章 数据基础测试',
          score: 92,
          totalScore: 100,
          completedAt: '2024-01-20 10:15:00'
        }
      ];
      
      setTimeout(() => {
        setTest(mockTest);
        setHistory(mockHistory);
        setTotalScore(mockTest.questions.reduce((sum, q) => sum + q.score, 0));
        setLoading(false);
      }, 500);
    };

    fetchTestDetail();
  }, [id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  const handleStartTest = () => {
    setIsStarted(true);
    setTimeLeft(test?.duration || 0 * 60);
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (!test) return;
    
    let calculatedScore = 0;
    test.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (!userAnswer) return;
      
      if (question.type === 'single' || question.type === 'judgment') {
        if (userAnswer === question.correctAnswer) {
          calculatedScore += question.score;
        }
      } else if (question.type === 'multiple') {
        const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        
        const isCorrect = correctAnswers.length === userAnswers.length && 
          correctAnswers.every(answer => userAnswers.includes(answer));
        
        if (isCorrect) {
          calculatedScore += question.score;
        }
      } else if (question.type === 'essay') {
        // 简单的非空检查，实际项目中可能需要更复杂的评分逻辑
        if (userAnswer.toString().trim().length > 0) {
          calculatedScore += question.score * 0.8; // 假设 essay 题得 80% 的分数
        }
      }
    });
    
    setScore(calculatedScore);
    setIsSubmitted(true);
    setActiveTab('result');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  if (!test) {
    return <div className="flex items-center justify-center h-screen">测试不存在</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/test')}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          ← 返回测试列表
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{test.title}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-700 mb-6">{test.description}</p>

        <div className="border-b border-gray-200 mb-4">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('test')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'test' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                开始测试
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('result')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'result' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                测试结果
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('history')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              >
                历史记录
              </button>
            </li>
          </ul>
        </div>

        {activeTab === 'test' && (
          <div className="space-y-6">
            {!isStarted ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">准备开始测试</h2>
                <p className="text-gray-600 mb-8">测试将在你点击开始后计时，请确保有足够的时间完成所有题目。</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleStartTest}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    开始测试
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-lg font-medium text-gray-800">
                    剩余时间: <span className="text-red-600 font-bold">{formatTime(timeLeft)}</span>
                  </div>
                  <div className="text-lg font-medium text-gray-800">
                    题目进度: {Object.keys(answers).length}/{test.questions.length}
                  </div>
                </div>

                <div className="space-y-8">
                  {test.questions.map((question, index) => (
                    <div key={question.id} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        第 {index + 1} 题 ({question.score}分)
                      </h3>
                      <p className="text-gray-700 mb-4">{question.content}</p>
                      
                      {question.type === 'single' && (
                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center">
                              <input
                                type="radio"
                                id={`q${question.id}_opt${optIndex}`}
                                name={`q${question.id}`}
                                value={option}
                                checked={answers[question.id] === option}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                className="mr-2"
                              />
                              <label htmlFor={`q${question.id}_opt${optIndex}`} className="text-gray-700">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'multiple' && (
                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`q${question.id}_opt${optIndex}`}
                                name={`q${question.id}`}
                                value={option}
                                checked={Array.isArray(answers[question.id]) && answers[question.id].includes(option)}
                                onChange={(e) => {
                                  const currentAnswers = Array.isArray(answers[question.id]) ? [...answers[question.id]] : [];
                                  if (e.target.checked) {
                                    currentAnswers.push(option);
                                  } else {
                                    const index = currentAnswers.indexOf(option);
                                    if (index > -1) {
                                      currentAnswers.splice(index, 1);
                                    }
                                  }
                                  handleAnswerChange(question.id, currentAnswers);
                                }}
                                className="mr-2"
                              />
                              <label htmlFor={`q${question.id}_opt${optIndex}`} className="text-gray-700">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'judgment' && (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`q${question.id}_true`}
                              name={`q${question.id}`}
                              value="true"
                              checked={answers[question.id] === 'true'}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="mr-2"
                            />
                            <label htmlFor={`q${question.id}_true`} className="text-gray-700">
                              正确
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`q${question.id}_false`}
                              name={`q${question.id}`}
                              value="false"
                              checked={answers[question.id] === 'false'}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="mr-2"
                            />
                            <label htmlFor={`q${question.id}_false`} className="text-gray-700">
                              错误
                            </label>
                          </div>
                        </div>
                      )}
                      
                      {question.type === 'essay' && (
                        <div>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={5}
                            placeholder="请输入你的答案..."
                            value={answers[question.id] as string || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    提交测试
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'result' && (
          <div className="space-y-6">
            {isSubmitted ? (
              <>
                <div className="text-center py-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">测试结果</h2>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {score}/{totalScore}
                  </div>
                  <div className="text-lg text-gray-600">
                    {score >= totalScore * 0.8 ? '优秀' : score >= totalScore * 0.6 ? '及格' : '不及格'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">答题详情</h3>
                  <div className="space-y-4">
                    {test.questions.map((question, index) => {
                      const userAnswer = answers[question.id];
                      const isCorrect = question.type === 'single' || question.type === 'judgment' 
                        ? userAnswer === question.correctAnswer
                        : question.type === 'multiple'
                          ? Array.isArray(userAnswer) && 
                            Array.isArray(question.correctAnswer) &&
                            userAnswer.length === question.correctAnswer.length &&
                            userAnswer.every(ans => question.correctAnswer.includes(ans))
                          : true; // 简答题暂不判断正确性
                      
                      return (
                        <div key={question.id} className={`p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-800">第 {index + 1} 题</h4>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {isCorrect ? '正确' : '错误'}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-2 mb-3">{question.content}</p>
                          <div className="text-sm">
                            <div className="mb-2">
                              <span className="font-medium text-gray-700">你的答案: </span>
                              <span className="text-gray-600">
                                {userAnswer ? (Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer) : '未作答'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">正确答案: </span>
                              <span className="text-gray-600">
                                {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => navigate('/test')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    返回测试列表
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setAnswers({});
                      setIsStarted(false);
                      setActiveTab('test');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    重新测试
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">还未完成测试</h2>
                <p className="text-gray-600 mb-8">请先完成测试并提交答案。</p>
                <button
                  onClick={() => setActiveTab('test')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  开始测试
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">测试历史记录</h2>
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">测试名称</th>
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">得分</th>
                      <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">完成时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b text-sm text-gray-800">{record.testTitle}</td>
                        <td className="py-3 px-4 border-b text-sm text-gray-800">{record.score}/{record.totalScore}</td>
                        <td className="py-3 px-4 border-b text-sm text-gray-800">{record.completedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">暂无测试历史记录</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDetail;