// 学习进度类型定义
export interface ProjectProgress {
  code: string; // 用户编写的代码
  completed: boolean; // 是否完成
  lastUpdated: number; // 最后更新时间
}

// 存储单个项目进度
export const saveProjectProgress = (projectId: string, progress: Omit<ProjectProgress, 'lastUpdated'>) => {
  const allProgress = JSON.parse(localStorage.getItem('learningProgress') || '{}');
  allProgress[projectId] = {
    ...progress,
    lastUpdated: Date.now()
  };
  localStorage.setItem('learningProgress', JSON.stringify(allProgress));
};

// 获取单个项目进度
export const getProjectProgress = (projectId: string): ProjectProgress => {
  const allProgress = JSON.parse(localStorage.getItem('learningProgress') || '{}');
  return allProgress[projectId] || { code: '', completed: false, lastUpdated: 0 };
};

// 获取所有项目进度
export const getAllProgress = (): Record<string, ProjectProgress> => {
  return JSON.parse(localStorage.getItem('learningProgress') || '{}');
};

// 存储AI聊天记录
export const saveChatHistory = (projectId: string, messages: any[]) => {
  const allChats = JSON.parse(localStorage.getItem('chatHistory') || '{}');
  allChats[projectId] = messages;
  localStorage.setItem('chatHistory', JSON.stringify(allChats));
};

// 获取AI聊天记录
export const getChatHistory = (projectId: string): any[] => {
  const allChats = JSON.parse(localStorage.getItem('chatHistory') || '{}');
  return allChats[projectId] || [];
};
