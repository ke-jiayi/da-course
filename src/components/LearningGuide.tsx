import React from 'react';

const LearningGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-cute p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-primary">学习引导</h1>
          
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-primary">学习路径</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-text">第一天：底层认知</h3>
                  <p className="text-text mb-4">学习数据分析的思维模型、行业争议和基本概念，建立正确的认知框架。</p>
                  <ul className="list-disc pl-6 space-y-2 text-text">
                    <li>思维模型：数据分析的核心思维方式</li>
                    <li>行业争议：数据分析领域的常见误区</li>
                    <li>辨析题：巩固基础概念</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-text">梯度项目实操</h3>
                  <p className="text-text mb-4">通过10个梯度项目，从基础到高级，逐步掌握数据分析技能。</p>
                  <ul className="list-disc pl-6 space-y-2 text-text">
                    <li>项目1-3：基础数据处理和可视化</li>
                    <li>项目4-6：数据挖掘和统计分析</li>
                    <li>项目7-10：机器学习和商业分析</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-text">AI错题倒逼</h3>
                  <p className="text-text mb-4">通过AI陪练功能，针对错题进行深入分析，强化学习效果。</p>
                  <ul className="list-disc pl-6 space-y-2 text-text">
                    <li>代码纠错：分析代码错误原因</li>
                    <li>思路点拨：提供解决问题的思路</li>
                    <li>知识点巩固：针对薄弱环节进行强化</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-primary">前置准备</h2>
            <div className="bg-yellow rounded-xl p-6">
              <h3 className="font-semibold mb-3 text-text">需要的基础知识</h3>
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>Python 基础语法</li>
                <li>基本的数学知识（统计学基础）</li>
                <li>逻辑思维能力</li>
              </ul>
              <h3 className="font-semibold mb-3 mt-4 text-text">推荐的学习资源</h3>
              <ul className="list-disc pl-6 space-y-2 text-text">
                <li>Python官方文档</li>
                <li>《Python数据分析》- Wes McKinney</li>
                <li>网络教程和视频课程</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-6 text-primary">开始学习</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/courses" className="bg-primary text-white py-3 px-8 rounded-full font-bold hover:bg-secondary transition-all duration-300 shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5 text-center">
                浏览课程
              </a>
              <a href="/pyodide-test" className="bg-transparent border-2 border-primary text-primary py-3 px-8 rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-button transform hover:-translate-y-0.5 text-center">
                测试Python环境
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningGuide;
