import { supabase } from '../lib/supabaseClient';

export interface LearningReport {
  id: string;
  user_id: string;
  total_courses: number;
  completed_courses: number;
  total_practices: number;
  completed_practices: number;
  total_tests: number;
  passed_tests: number;
  total_time_spent: number;
  generated_at: string;
}

export const generateLearningReport = async (userId: string): Promise<LearningReport | null> => {
  // 这里可以根据实际情况实现报告生成逻辑
  // 暂时返回模拟数据
  const report: LearningReport = {
    id: `report_${Date.now()}`,
    user_id: userId,
    total_courses: 10,
    completed_courses: 3,
    total_practices: 50,
    completed_practices: 20,
    total_tests: 15,
    passed_tests: 12,
    total_time_spent: 3600,
    generated_at: new Date().toISOString(),
  };

  return report;
};

export const getLearningReports = async (userId: string): Promise<LearningReport[]> => {
  const { data, error } = await supabase
    .from('learning_reports')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false });

  if (error) {
    console.error('Error fetching learning reports:', error);
    return [];
  }

  return data;
};
