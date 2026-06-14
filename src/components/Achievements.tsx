import React, { useState, useEffect } from 'react';
import {
  ALL_BADGES,
  COURSE_BADGES,
  ADVANCED_BADGES,
  isBadgeUnlocked,
  getUnlockedBadgeCount,
  getCompletedCourseCount,
  resetBadges,
} from '../services/badgeService';

const Achievements: React.FC = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    // 页面加载时刷新
    setReloadKey((k) => k + 1);
  }, []);

  const totalBadges = ALL_BADGES.length;
  const unlockedCount = getUnlockedBadgeCount();
  const completedCourses = getCompletedCourseCount();
  const progressPercent = Math.round((unlockedCount / totalBadges) * 100);

  const handleReset = () => {
    resetBadges();
    setReloadKey((k) => k + 1);
    setShowConfirmReset(false);
  };

  const renderBadge = (badge: (typeof ALL_BADGES)[number]) => {
    const unlocked = isBadgeUnlocked(badge.id);
    return (
      <div
        key={badge.id}
        className={`relative rounded-2xl p-5 md:p-6 shadow-md transition-all duration-300 border-2 ${
          unlocked
            ? `bg-gradient-to-br ${badge.color} text-white border-transparent hover:shadow-xl transform hover:-translate-y-1`
            : 'bg-gray-100 text-gray-500 border-gray-200'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`text-5xl md:text-6xl mb-3 ${unlocked ? '' : 'grayscale opacity-40'}`}>{badge.icon}</div>
          <h3 className={`font-bold text-base md:text-lg mb-1 ${unlocked ? '' : ''}`}>{badge.name}</h3>
          <p className={`text-xs md:text-sm ${unlocked ? 'text-white/90' : 'text-gray-500'}`}>{badge.description}</p>
          {badge.condition && !unlocked && (
            <div className="mt-3 text-xs bg-white/50 rounded-full px-3 py-1 text-gray-600">
              条件：{badge.condition}
            </div>
          )}
          {unlocked && (
            <div className="mt-3 text-xs bg-white/30 rounded-full px-3 py-1">
              ✓ 已获得
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 py-10 md:py-16">
      <div className="container mx-auto px-4" key={reloadKey}>
        {/* 顶部标题与统计 */}
        <div className="text-center mb-10 md:mb-14">
          <div className="text-6xl md:text-7xl mb-4 inline-block animate-bounce-slow">🏆</div>
          <h1 className="text-3xl md:text-5xl font-bold text-orange-800 mb-3">我的成就</h1>
          <p className="text-gray-600 text-base md:text-lg">完成课程即可获得徽章，解锁你的数据分析之旅！</p>
        </div>

        {/* 总览卡片 */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-orange-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6">
            <div className="text-center md:border-r md:border-gray-200">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">{unlockedCount}</div>
              <div className="text-gray-600">已获得徽章</div>
            </div>
            <div className="text-center md:border-r md:border-gray-200">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{totalBadges}</div>
              <div className="text-gray-600">总徽章数</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">{completedCourses}</div>
              <div className="text-gray-600">已完成课程</div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>整体进度</span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-1000 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              重置所有徽章
            </button>
          </div>
        </div>

        {/* 进阶徽章 */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-800 mb-2 md:mb-3 text-center">⭐ 进阶徽章</h2>
          <p className="text-center text-gray-600 mb-6 md:mb-8">完成多门课程可解锁特殊徽章</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {ADVANCED_BADGES.map(renderBadge)}
          </div>
        </div>

        {/* 课程徽章 */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-800 mb-2 md:mb-3 text-center">📚 课程徽章</h2>
          <p className="text-center text-gray-600 mb-6 md:mb-8">每完成一门课程，即可解锁对应的徽章</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {COURSE_BADGES.map(renderBadge)}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          💡 徽章状态保存在浏览器本地，清除浏览器数据后会重置
        </div>

        {/* 确认重置弹窗 */}
        {showConfirmReset && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmReset(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">确认重置所有徽章？</h3>
              <p className="text-gray-600 mb-6">此操作将清除你在本课程的所有进度与徽章记录，且无法撤销。</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-all shadow-lg"
                >
                  确认重置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
