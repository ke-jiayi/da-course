export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isCourseBadge?: boolean;
  condition?: string;
}

export interface BadgeState {
  unlocked: string[];
  completedCourses: string[];
  lastUpdated: string;
}

export const COURSE_BADGES: Badge[] = [
  { id: 'course-data-visualization', name: '数据可视化艺术家', description: '完成数据可视化课程', icon: '📊', color: 'from-blue-400 to-purple-500', isCourseBadge: true },
  { id: 'course-machine-learning', name: '机器学习新星', description: '完成机器学习课程', icon: '🤖', color: 'from-purple-400 to-pink-500', isCourseBadge: true },
  { id: 'course-data-mining', name: '数据挖掘探索者', description: '完成数据挖掘课程', icon: '⛏️', color: 'from-amber-400 to-orange-500', isCourseBadge: true },
  { id: 'course-business-analysis', name: '商业分析达人', description: '完成商业分析课程', icon: '💼', color: 'from-emerald-400 to-teal-500', isCourseBadge: true },
  { id: 'course-data-cleaning', name: '数据清洁师', description: '完成数据清洗实战课程', icon: '🧹', color: 'from-cyan-400 to-blue-500', isCourseBadge: true },
  { id: 'course-group-aggregation', name: '分组分析专家', description: '完成分组聚合分析课程', icon: '📈', color: 'from-green-400 to-emerald-500', isCourseBadge: true },
  { id: 'course-market-basket', name: '购物篮分析师', description: '完成购物篮分析课程', icon: '🛒', color: 'from-rose-400 to-pink-500', isCourseBadge: true },
  { id: 'course-ab-testing', name: 'A/B测试高手', description: '完成 A/B 测试分析课程', icon: '🧪', color: 'from-violet-400 to-purple-500', isCourseBadge: true },
  { id: 'course-time-series', name: '时间序列大师', description: '完成时间序列分析课程', icon: '📉', color: 'from-indigo-400 to-blue-500', isCourseBadge: true },
  { id: 'course-anomaly-detection', name: '异常值侦探', description: '完成异常值检测课程', icon: '🔍', color: 'from-red-400 to-orange-500', isCourseBadge: true },
];

export const ADVANCED_BADGES: Badge[] = [
  { id: 'advanced-first-step', name: '初出茅庐', description: '完成第一门课程，开启数据分析之旅', icon: '🌱', color: 'from-green-300 to-yellow-400', condition: '完成至少1门课程' },
  { id: 'advanced-explorer', name: '渐入佳境', description: '完成5门课程', icon: '🚀', color: 'from-blue-400 to-cyan-500', condition: '完成5门课程' },
  { id: 'advanced-master', name: '数据分析大师', description: '完成全部10门课程', icon: '👑', color: 'from-yellow-400 to-orange-500', condition: '完成全部10门课程' },
];

export const ALL_BADGES: Badge[] = [...COURSE_BADGES, ...ADVANCED_BADGES];

const STORAGE_KEY = 'data-academy-badges';

const getDefaultState = (): BadgeState => ({
  unlocked: [],
  completedCourses: [],
  lastUpdated: new Date().toISOString(),
});

export const getBadgeState = (): BadgeState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return {
      unlocked: Array.isArray(parsed.unlocked) ? parsed.unlocked : [],
      completedCourses: Array.isArray(parsed.completedCourses) ? parsed.completedCourses : [],
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch {
    return getDefaultState();
  }
};

export const saveBadgeState = (state: BadgeState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn('Unable to save badge state to localStorage');
  }
};

export const isCourseCompleted = (courseId: string): boolean => {
  const state = getBadgeState();
  return state.completedCourses.includes(courseId);
};

export const isBadgeUnlocked = (badgeId: string): boolean => {
  const state = getBadgeState();
  return state.unlocked.includes(badgeId);
};

export const getUnlockedBadgeCount = (): number => {
  return getBadgeState().unlocked.length;
};

export const getCompletedCourseCount = (): number => {
  return getBadgeState().completedCourses.length;
};

const checkAdvancedBadges = (state: BadgeState): BadgeState => {
  const completedCount = state.completedCourses.length;
  const newUnlocked = [...state.unlocked];

  if (completedCount >= 1 && !newUnlocked.includes('advanced-first-step')) {
    newUnlocked.push('advanced-first-step');
  }
  if (completedCount >= 5 && !newUnlocked.includes('advanced-explorer')) {
    newUnlocked.push('advanced-explorer');
  }
  if (completedCount >= 10 && !newUnlocked.includes('advanced-master')) {
    newUnlocked.push('advanced-master');
  }

  return { ...state, unlocked: newUnlocked, lastUpdated: new Date().toISOString() };
};

export const markCourseCompleted = (courseId: string): { newlyUnlocked: Badge[]; allUnlocked: Badge[] } => {
  const state = getBadgeState();
  const alreadyDone = state.completedCourses.includes(courseId);

  let newState: BadgeState = {
    ...state,
    completedCourses: alreadyDone ? state.completedCourses : [...state.completedCourses, courseId],
  };

  const courseBadgeId = `course-${courseId}`;
  if (!newState.unlocked.includes(courseBadgeId)) {
    newState = { ...newState, unlocked: [...newState.unlocked, courseBadgeId] };
  }

  newState = checkAdvancedBadges(newState);
  saveBadgeState(newState);

  const newlyUnlockedIds = newState.unlocked.filter((id) => !state.unlocked.includes(id));
  const newlyUnlocked = newlyUnlockedIds
    .map((id) => ALL_BADGES.find((b) => b.id === id))
    .filter((b): b is Badge => !!b);
  const allUnlocked = newState.unlocked
    .map((id) => ALL_BADGES.find((b) => b.id === id))
    .filter((b): b is Badge => !!b);

  return { newlyUnlocked, allUnlocked };
};

export const resetBadges = (): void => {
  saveBadgeState(getDefaultState());
};
