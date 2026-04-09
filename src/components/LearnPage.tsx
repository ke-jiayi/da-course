import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import { FaCheck, FaPlay, FaPause, FaSave, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface CourseModule {
  id: string;
  title: string;
  description: string;
  video_url: string;
  code_example: string;
  exercises: Exercise[];
  order_index: number;
  progress: number;
  completed: boolean;
}

interface Exercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'coding';
  options?: string[];
  correct_answer?: string;
  coding_problem?: string;
  test_cases?: TestCase[];
}

interface TestCase {
  input: string;
  expected_output: string;
}

interface Course {
  id: string;
  title: string;
  modules: CourseModule[];
}

const LearnPage: React.FC = () => {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [module, setModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [code, setCode] = useState('');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [exerciseFeedback, setExerciseFeedback] = useState<Record<string, { correct: boolean; message: string }>>({});
  const [overallProgress, setOverallProgress] = useState(0);

  // 模拟课程数据
  const mockCourses: Record<string, Course> = {
    '1': {
      id: '1',
      title: '数据分析基础',
      modules: [
        {
          id: 'm1',
          title: '数据分析概述',
          description: '了解数据分析的定义、重要性和应用场景',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code_example: "import pandas as pd\nimport numpy as np\n\n# 示例数据分析代码\ndata = {\n    \"name\": [\"Alice\", \"Bob\", \"Charlie\", \"David\"],\n    \"age\": [25, 30, 35, 40],\n    \"salary\": [50000, 60000, 70000, 80000]\n}\n\ndf = pd.DataFrame(data)\nprint(df)\nprint(\"\n平均薪资:\", df['salary'].mean())",
          exercises: [
            {
              id: 'ex1',
              type: 'multiple-choice',
              question: '数据分析的主要目的是什么？',
              options: [
                '仅仅收集数据',
                '从数据中提取有价值的 insights',
                '创建美观的数据可视化',
                '编写复杂的代码'
              ],
              correct_answer: '从数据中提取有价值的 insights'
            },
            {
              id: 'ex2',
              type: 'coding',
              question: '编写代码计算以下数据的平均值',
              coding_problem: 'data = [10, 20, 30, 40, 50]\n# 计算平均值并打印结果',
              test_cases: [
                {
                  input: '',
                  expected_output: '30.0'
                }
              ]
            }
          ],
          order_index: 1,
          progress: 50,
          completed: false
        },
        {
          id: 'm2',
          title: '数据收集与预处理',
          description: '学习如何收集和清洗数据',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code_example: "import pandas as pd\n\n# 数据清洗示例\ndata = {\n    \"name\": [\"Alice\", \"Bob\", None, \"David\"],\n    \"age\": [25, None, 35, 40],\n    \"salary\": [50000, 60000, 70000, None]\n}\n\ndf = pd.DataFrame(data)\nprint(\"原始数据:\")\nprint(df)\n\n# 填充缺失值\ndf['age'].fillna(df['age'].mean(), inplace=True)\ndf['salary'].fillna(df['salary'].mean(), inplace=True)\ndf['name'].fillna('Unknown', inplace=True)\n\nprint(\"\n清洗后的数据:\")\nprint(df)",
          exercises: [
            {
              id: 'ex1',
              type: 'multiple-choice',
              question: '数据预处理的主要步骤不包括以下哪项？',
              options: [
                '数据收集',
                '数据清洗',
                '数据转换',
                '模型训练'
              ],
              correct_answer: '模型训练'
            }
          ],
          order_index: 2,
          progress: 0,
          completed: false
        }
      ]
    },
    '2': {
      id: '2',
      title: 'Python数据分析',
      modules: [
        {
          id: 'm1',
          title: 'Python基础回顾',
          description: '复习Python的基本语法和数据结构',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code_example: '# Python基础语法示例\n\n# 变量和数据类型\nname = "Alice"\nage = 30\nsalary = 50000.50\nis_employed = True\n\n# 列表\nfruits = ["apple", "banana", "cherry"]\n\n# 字典\nperson = {\n    "name": name,\n    "age": age,\n    "salary": salary,\n    "is_employed": is_employed\n}\n\n# 循环\nfor fruit in fruits:\n    print(f"I like {fruit}")\n\n# 函数\ndef calculate_bonus(salary, rate=0.1):\n    return salary * rate\n\nprint(f"Bonus: {calculate_bonus(salary)}")',
          exercises: [
            {
              id: 'ex1',
              type: 'coding',
              question: '编写一个函数计算阶乘',
              coding_problem: 'def factorial(n):\n    # 实现阶乘计算\n    pass\n\n# 测试\nprint(factorial(5))  # 应输出 120',
              test_cases: [
                {
                  input: '5',
                  expected_output: '120'
                },
                {
                  input: '3',
                  expected_output: '6'
                }
              ]
            }
          ],
          order_index: 1,
          progress: 0,
          completed: false
        }
      ]
    }
  };

  useEffect(() => {
    // 模拟获取课程和模块数据
    if (courseId && moduleId) {
      setTimeout(() => {
        const courseData = mockCourses[courseId];
        if (courseData) {
          setCourse(courseData);
          const moduleData = courseData.modules.find(m => m.id === moduleId);
          if (moduleData) {
            setModule(moduleData);
            setCode(moduleData.code_example);
            // 计算总体进度
            const totalProgress = courseData.modules.reduce((sum, m) => sum + m.progress, 0);
            const avgProgress = totalProgress / courseData.modules.length;
            setOverallProgress(avgProgress);
          }
        }
        setLoading(false);
      }, 500);
    }
  }, [courseId, moduleId]);

  const handleVideoProgress = (state: any) => {
    if (state.played) {
      const progress = Math.round(state.played * 100);
      setVideoProgress(progress);
      // 自动保存进度
      if (module) {
        saveProgress(progress);
      }
    }
  };

  const saveProgress = (progress: number) => {
    // 这里可以实现与后端的进度保存逻辑
    console.log('保存进度:', progress);
    // 模拟保存成功
    if (module) {
      const updatedModule = { ...module, progress };
      setModule(updatedModule);
    }
  };

  const handleExerciseSubmit = (exerciseId: string, answer: string) => {
    if (!module) return;

    const exercise = module.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    let isCorrect = false;
    let message = '';

    if (exercise.type === 'multiple-choice' && exercise.correct_answer) {
      isCorrect = answer === exercise.correct_answer;
      message = isCorrect ? '回答正确！' : '回答错误，请再试一次。';
    } else if (exercise.type === 'coding' && exercise.test_cases) {
      // 简单的代码执行模拟
      try {
        // 这里只是一个简单的模拟，实际项目中需要更复杂的代码执行环境
        // 模拟代码执行结果
        isCorrect = answer.includes('return') || answer.includes('print');
        message = isCorrect ? '代码执行正确！' : '代码执行有问题，请检查。';
      } catch (error) {
        isCorrect = false;
        message = '代码执行出错，请检查语法。';
      }
    }

    setUserAnswers(prev => ({ ...prev, [exerciseId]: answer }));
    setExerciseFeedback(prev => ({
      ...prev,
      [exerciseId]: { correct: isCorrect, message }
    }));

    // 检查是否所有练习都已完成
    const allExercisesCompleted = module.exercises.every(ex => 
      exerciseFeedback[ex.id]?.correct
    );

    if (allExercisesCompleted && videoProgress >= 90) {
      // 标记模块为已完成
      if (module) {
        const updatedModule = { ...module, completed: true, progress: 100 };
        setModule(updatedModule);
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">加载学习内容中...</div>;
  }

  if (!course || !module) {
    return <div className="flex items-center justify-center h-64">课程或模块不存在</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">学习平台</Link>
          <div className="flex items-center gap-4">
            <Link to={`/course/${courseId}`} className="text-gray-600 hover:text-blue-600">
              返回课程
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* 模块信息 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{module.title}</h1>
          <p className="text-gray-600 mb-4">{module.description}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${module.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>进度: {module.progress}%</span>
            <span>{module.completed ? '已完成' : '进行中'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧内容区 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 视频播放器 */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">视频教程</h2>
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <ReactPlayer
                  {...{ url: module.video_url, controls: true, playing: isPlaying, onProgress: handleVideoProgress, onPlay: () => setIsPlaying(true), onPause: () => setIsPlaying(false), width: "100%", height: "100%" } as any}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                    {isPlaying ? '暂停' : '播放'}
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  视频进度: {videoProgress}%
                </div>
              </div>
            </div>

            {/* 代码示例 */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">代码示例</h2>
              <div className="mb-4">
                <AceEditor
                  mode="python"
                  theme="github"
                  value={code}
                  onChange={setCode}
                  name="code-editor"
                  editorProps={{
                    $blockScrolling: true
                  }}
                  width="100%"
                  height="300px"
                  fontSize={14}
                  showPrintMargin={false}
                  showGutter={true}
                  highlightActiveLine={true}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2
                  }}
                />
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => console.log('保存代码')}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <FaSave size={16} />
                  保存代码
                </button>
              </div>
            </div>

            {/* 互动练习 */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">互动练习</h2>
              {module.exercises.map((exercise, index) => (
                <div key={exercise.id} className="mb-6 last:mb-0">
                  <h3 className="font-medium mb-3">练习 {index + 1}: {exercise.question}</h3>
                  
                  {exercise.type === 'multiple-choice' && exercise.options && (
                    <div className="space-y-2 mb-4">
                      {exercise.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center">
                          <input
                            type="radio"
                            id={`option-${optIndex}`}
                            name={`exercise-${exercise.id}`}
                            value={option}
                            checked={userAnswers[exercise.id] === option}
                            onChange={(e) => handleExerciseSubmit(exercise.id, e.target.value)}
                            className="mr-2"
                          />
                          <label htmlFor={`option-${optIndex}`} className="cursor-pointer">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {exercise.type === 'coding' && exercise.coding_problem && (
                    <div className="mb-4">
                      <AceEditor
                        mode="python"
                        theme="github"
                        value={userAnswers[exercise.id] || exercise.coding_problem}
                        onChange={(value) => setUserAnswers(prev => ({ ...prev, [exercise.id]: value }))}
                        name={`code-exercise-${exercise.id}`}
                        editorProps={{
                          $blockScrolling: true
                        }}
                        width="100%"
                        height="200px"
                        fontSize={14}
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        setOptions={{
                          enableBasicAutocompletion: true,
                          enableLiveAutocompletion: true,
                          enableSnippets: true,
                          showLineNumbers: true,
                          tabSize: 2
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleExerciseSubmit(exercise.id, userAnswers[exercise.id] || '')}
                      className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      提交答案
                    </button>
                  </div>
                  
                  {exerciseFeedback[exercise.id] && (
                    <div className={`mt-3 p-3 rounded-md ${exerciseFeedback[exercise.id].correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <div className="flex items-center gap-2">
                        {exerciseFeedback[exercise.id].correct ? 
                          <FaCheckCircle size={18} /> : 
                          <FaTimesCircle size={18} />
                        }
                        <span>{exerciseFeedback[exercise.id].message}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 课程进度 */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">学习进度</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">总体进度</span>
                  <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">当前模块</span>
                  <span className="text-sm font-medium">{module.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
              </div>
              {module.completed && (
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <FaCheck size={16} />
                  <span className="text-sm font-medium">本模块已完成</span>
                </div>
              )}
            </div>

            {/* 课程导航 */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">课程导航</h2>
              <div className="space-y-2">
                {course.modules.map((m) => (
                  <Link 
                    key={m.id}
                    to={`/learn/${courseId}/${m.id}`}
                    className={`flex items-center justify-between p-2 rounded-md transition-colors ${m.id === moduleId ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  >
                    <span>{m.order_index}. {m.title}</span>
                    {m.completed && <FaCheck size={16} className="text-green-500" />}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;