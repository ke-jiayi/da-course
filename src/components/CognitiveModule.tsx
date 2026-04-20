import React, { useState } from 'react';
import { getHint } from '../services/aiService';
import { saveChatHistory, getChatHistory } from '../services/storageService';

const CognitiveModule: React.FC = () => {
  const [activeSection, setActiveSection] = useState('thinking');
  const [chatMessages, setChatMessages] = useState<any[]>(getChatHistory('cognitive'));
  const [userMessage, setUserMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // 思维模型数据
  const thinkingModels = [
    {
      id: 1,
      title: '数据思维模型',
      description: '通过数据驱动决策，从数据中发现规律和洞察',
      content: `数据思维模型是一种基于数据的决策方法，它包括以下步骤：
1. 定义问题：明确需要解决的问题
2. 收集数据：获取相关数据
3. 分析数据：使用统计方法和可视化工具分析数据
4. 得出结论：基于数据分析结果做出决策
5. 验证结果：验证决策的有效性`
    },
    {
      id: 2,
      title: '业务思维模型',
      description: '将数据分析与业务目标相结合，创造商业价值',
      content: `业务思维模型强调数据与业务的结合：
1. 理解业务目标：明确业务需求和目标
2. 识别关键指标：确定衡量业务成功的关键指标
3. 分析业务数据：分析与业务相关的数据
4. 提供业务洞察：基于数据为业务决策提供支持
5. 优化业务流程：通过数据优化业务流程`
    },
    {
      id: 3,
      title: '分析思维模型',
      description: '系统性地分析问题，提供科学的解决方案',
      content: `分析思维模型包括：
1. 分解问题：将复杂问题分解为简单部分
2. 提出假设：基于现有信息提出可能的解释
3. 收集证据：收集支持或反驳假设的证据
4. 验证假设：通过数据分析验证假设
5. 得出结论：基于验证结果得出结论`
    }
  ];

  // 行业争议数据
  const industryControversies = [
    {
      id: 1,
      title: '数据隐私 vs 数据分析',
      description: '如何在保护用户隐私的同时进行有效的数据分析',
      pros: [
        '数据分析可以为用户提供更好的服务',
        '数据分析可以帮助企业优化产品',
        '数据分析可以促进行业创新'
      ],
      cons: [
        '可能侵犯用户隐私',
        '数据泄露风险',
        '用户对数据使用的担忧'
      ]
    },
    {
      id: 2,
      title: '算法偏见问题',
      description: '如何避免算法中的偏见，确保公平性',
      pros: [
        '算法可以减少人为偏见',
        '算法可以处理大量数据',
        '算法决策更加客观'
      ],
      cons: [
        '算法可能反映训练数据中的偏见',
        '算法决策过程不透明',
        '可能对特定群体造成歧视'
      ]
    },
    {
      id: 3,
      title: '自动化 vs 人工分析',
      description: '自动化分析工具与人工分析的平衡',
      pros: [
        '自动化分析效率高',
        '自动化分析可以处理大规模数据',
        '减少人为错误'
      ],
      cons: [
        '缺乏人类的直觉和创造力',
        '可能错过非结构化信息',
        '需要人工监督和解释'
      ]
    }
  ];

  // 辨析题数据
  const quizQuestions = [
    {
      id: 1,
      question: '数据分析的核心是统计方法，不需要了解业务背景。',
      options: [
        { id: 'A', text: '正确', explanation: '错误。数据分析需要结合业务背景才能产生有价值的洞察。' },
        { id: 'B', text: '错误', explanation: '正确。数据分析必须与业务背景相结合，否则分析结果可能没有实际意义。' }
      ],
      correctAnswer: 'B'
    },
    {
      id: 2,
      question: '数据可视化的主要目的是使数据看起来更美观。',
      options: [
        { id: 'A', text: '正确', explanation: '错误。数据可视化的主要目的是帮助理解数据，发现数据中的模式和趋势。' },
        { id: 'B', text: '错误', explanation: '正确。数据可视化的核心价值在于提高数据理解效率，而不仅仅是美观。' }
      ],
      correctAnswer: 'B'
    },
    {
      id: 3,
      question: '机器学习算法可以完全替代人类分析师。',
      options: [
        { id: 'A', text: '正确', explanation: '错误。机器学习算法是工具，需要人类分析师的指导和解释。' },
        { id: 'B', text: '错误', explanation: '正确。机器学习算法可以处理大量数据，但仍需要人类的专业知识来指导分析方向和解释结果。' }
      ],
      correctAnswer: 'B'
    }
  ];

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    
    const newMessage = { role: 'user', content: userMessage };
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setUserMessage('');
    setAiLoading(true);
    
    try {
      const aiResponse = await getHint(userMessage);
      const aiMessage = { 
        role: 'assistant', 
        content: aiResponse.choices[0].message.content 
      };
      const finalMessages = [...updatedMessages, aiMessage];
      setChatMessages(finalMessages);
      saveChatHistory('cognitive', finalMessages);
    } catch (err) {
      console.error('AI请求错误:', err);
      const errorMessage = { 
        role: 'assistant', 
        content: '抱歉，AI服务暂时不可用，请稍后再试。' 
      };
      setChatMessages([...updatedMessages, errorMessage]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-12 text-center text-primary">第一天认知模块</h1>
        
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8 mb-8">
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setActiveSection('thinking')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${activeSection === 'thinking' ? 'bg-primary text-white' : 'bg-gray-200 text-text hover:bg-gray-300'}`}
            >
              思维模型
            </button>
            <button
              onClick={() => setActiveSection('controversy')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${activeSection === 'controversy' ? 'bg-primary text-white' : 'bg-gray-200 text-text hover:bg-gray-300'}`}
            >
              行业争议
            </button>
            <button
              onClick={() => setActiveSection('quiz')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${activeSection === 'quiz' ? 'bg-primary text-white' : 'bg-gray-200 text-text hover:bg-gray-300'}`}
            >
              辨析题
            </button>
          </div>

          {/* 思维模型部分 */}
          {activeSection === 'thinking' && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold mb-6 text-primary">思维模型</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {thinkingModels.map((model) => (
                  <div key={model.id} className="bg-yellow rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-2 text-primary">{model.title}</h3>
                    <p className="text-text mb-4">{model.description}</p>
                    <div className="bg-white p-4 rounded-lg">
                      <pre className="font-mono text-sm whitespace-pre-wrap">{model.content}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 行业争议部分 */}
          {activeSection === 'controversy' && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold mb-6 text-primary">行业争议</h2>
              {industryControversies.map((controversy) => (
                <div key={controversy.id} className="bg-blue rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary">{controversy.title}</h3>
                  <p className="text-text mb-6">{controversy.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-green">支持观点</h4>
                      <ul className="list-disc pl-6 space-y-2 text-text">
                        {controversy.pros.map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-red">反对观点</h4>
                      <ul className="list-disc pl-6 space-y-2 text-text">
                        {controversy.cons.map((con, index) => (
                          <li key={index}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 辨析题部分 */}
          {activeSection === 'quiz' && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold mb-6 text-primary">辨析题</h2>
              {quizQuestions.map((question) => (
                <div key={question.id} className="bg-purple rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary">问题 {question.id}: {question.question}</h3>
                  <div className="space-y-4 mb-6">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(option.id)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${selectedAnswer === option.id ? (option.id === question.correctAnswer ? 'bg-green text-white' : 'bg-red text-white') : 'bg-white text-text hover:bg-gray-100'}`}
                      >
                        {option.id}. {option.text}
                      </button>
                    ))}
                  </div>
                  {showExplanation && (
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-primary">解析</h4>
                      <p className="text-text">
                        {question.options.find(opt => opt.id === selectedAnswer)?.explanation}
                      </p>
                      <button
                        onClick={resetQuiz}
                        className="mt-4 bg-primary text-white py-2 px-6 rounded-full font-bold hover:bg-secondary transition-all duration-300"
                      >
                        重置
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI陪练部分 */}
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4 text-primary">AI陪练</h2>
          <div className="bg-gray-100 rounded-xl p-4 mb-4 max-h-60 overflow-y-auto">
            {chatMessages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg max-w-[80%] ${message.role === 'user' ? 'bg-primary text-white' : 'bg-white text-text'}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-white text-text">
                  AI正在思考...
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="输入你的问题..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={aiLoading || !userMessage.trim()}
              className="bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-secondary transition-all duration-300 disabled:opacity-50"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CognitiveModule;