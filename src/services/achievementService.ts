import { supabase } from '../lib/supabaseClient';

export interface Achievement {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string;
  unlocked_at: string;
}

export const getAchievements = async (userId: string): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }

  return data;
};

export const unlockAchievement = async (userId: string, type: string, title: string, description: string): Promise<Achievement | null> => {
  const { data, error } = await supabase
    .from('achievements')
    .insert({
      user_id: userId,
      type,
      title,
      description,
      unlocked_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error unlocking achievement:', error);
    return null;
  }

  return data;
};
