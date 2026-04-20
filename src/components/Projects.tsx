import React from 'react';

const Projects: React.FC = () => {
  const projects = [
    {
      id: 1,
      title: "项目1：基础数据处理",
      description: "学习使用pandas进行基本的数据处理和分析",
      difficulty: "初级",
      estimatedTime: "30分钟",
      link: "/project/1"
    },
    {
      id: 2,
      title: "项目2：数据可视化",
      description: "学习使用matplotlib和seaborn创建各种图表",
      difficulty: "初级",
      estimatedTime: "45分钟",
      link: "/project/2"
    },
    {
      id: 3,
      title: "项目3：统计分析",
      description: "学习使用numpy和scipy进行基本的统计分析",
      difficulty: "中级",
      estimatedTime: "60分钟",
      link: "/project/3"
    },
    {
      id: 4,
      title: "项目4：数据挖掘",
      description: "学习使用scikit-learn进行数据挖掘",
      difficulty: "中级",
      estimatedTime: "90分钟",
      link: "/project/4"
    },
    {
      id: 5,
      title: "项目5：机器学习基础",
      description: "学习机器学习的基本概念和算法",
      difficulty: "中级",
      estimatedTime: "120分钟",
      link: "/project/5"
    },
    {
      id: 6,
      title: "项目6：分类算法",
      description: "学习使用分类算法解决实际问题",
      difficulty: "中级",
      estimatedTime: "120分钟",
      link: "/project/6"
    },
    {
      id: 7,
      title: "项目7：回归分析",
      description: "学习使用回归算法进行预测",
      difficulty: "高级",
      estimatedTime: "150分钟",
      link: "/project/7"
    },
    {
      id: 8,
      title: "项目8：聚类分析",
      description: "学习使用聚类算法分析数据",
      difficulty: "高级",
      estimatedTime: "150分钟",
      link: "/project/8"
    },
    {
      id: 9,
      title: "项目9：时间序列分析",
      description: "学习分析和预测时间序列数据",
      difficulty: "高级",
      estimatedTime: "180分钟",
      link: "/project/9"
    },
    {
      id: 10,
      title: "项目10：商业分析实战",
      description: "综合运用所学技能进行商业分析",
      difficulty: "高级",
      estimatedTime: "240分钟",
      link: "/project/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-12 text-center text-primary">梯度项目列表</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-cute hover:shadow-cute-hover transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-text">{project.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.difficulty === '初级' ? 'bg-green text-white' : project.difficulty === '中级' ? 'bg-blue text-white' : 'bg-red text-white'}`}>
                    {project.difficulty}
                  </span>
                </div>
                <p className="text-text mb-4 leading-relaxed">{project.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {project.estimatedTime}
                  </span>
                  <span className="text-primary font-medium">项目 {project.id}/10</span>
                </div>
                <a 
                  href={project.link} 
                  className="block w-full bg-primary text-white py-3 px-6 rounded-full font-bold hover:bg-secondary transition-all duration-300 shadow-button hover:shadow-button-hover text-center"
                >
                  开始学习
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
