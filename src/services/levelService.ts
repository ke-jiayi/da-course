import { supabase } from '../lib/supabaseClient';

export interface UserLevel {
  id: string;
  user_id: string;
  level: number;
  experience: number;
  last_updated: string;
}

export const getUserLevel = async (userId: string): Promise<UserLevel | null> => {
  const { data, error } = await supabase
    .from('user_levels')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user level:', error);
    return null;
  }

  return data;
};

export const updateUserExperience = async (userId: string, experience: number): Promise<UserLevel | null> => {
  // 先获取当前用户等级信息
  const currentLevel = await getUserLevel(userId);
  
  let newExperience = experience;
  let newLevel = 1;
  
  if (currentLevel) {
    newExperience = currentLevel.experience + experience;
    newLevel = currentLevel.level;
  }
  
  // 计算新等级
  while (newExperience >= newLevel * 100) {
    newExperience -= newLevel * 100;
    newLevel++;
  }
  
  const { data, error } = await supabase
    .from('user_levels')
    .upsert({
      user_id: userId,
      level: newLevel,
      experience: newExperience,
      last_updated: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating user experience:', error);
    return null;
  }

  return data;
};
