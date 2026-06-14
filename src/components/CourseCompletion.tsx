import React, { useState, useEffect } from 'react';
import { markCourseCompleted, isCourseCompleted, Badge } from '../services/badgeService';

interface CourseCompletionProps {
  courseId: string;
  courseTitle: string;
  badgeIcon: string;
  badgeName: string;
}

const CourseCompletion: React.FC<CourseCompletionProps> = ({ courseId, courseTitle, badgeIcon, badgeName }) => {
  const [completed, setCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  useEffect(() => {
    setCompleted(isCourseCompleted(courseId));
  }, [courseId]);

  const handleComplete = () => {
    const result = markCourseCompleted(courseId);
    setCompleted(true);
    if (result.newlyUnlocked.length > 0) {
      setNewBadges(result.newlyUnlocked);
    } else {
      setNewBadges([{ id: `course-${courseId}`, name: badgeName, description: `完成${courseTitle}`, icon: badgeIcon, color: 'from-primary to-secondary' }]);
    }
    setShowCelebration(true);
  };

  const closeCelebration = () => {
    setShowCelebration(false);
    setNewBadges([]);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center text-center md:text-left">
            <div className="text-6xl md:text-5xl mr-4 md:mr-6 animate-pulse">{badgeIcon}</div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-orange-800 mb-2">
                {completed ? '🎉 恭喜，本课程已完成！' : '完成本课程'}
              </h3>
              <p className="text-orange-700 text-sm md:text-base">
                {completed
                  ? `你已获得"${badgeName}"徽章。继续加油，解锁更多成就！`
                  : `点击下方按钮完成课程，获得"${badgeName}"徽章`}
              </p>
            </div>
          </div>
          <button
            onClick={handleComplete}
            disabled={completed}
            className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 ${
              completed
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:from-orange-600 hover:to-red-600'
            }`}
          >
            {completed ? '✓ 已完成' : '🏆 我已完成本课程'}
          </button>
        </div>
      </div>

      {showCelebration && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={closeCelebration}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 text-center relative animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-7xl md:text-8xl mb-4">🎊</div>
            <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-4">恭喜完成课程！</h2>
            <p className="text-gray-600 mb-6">你获得了以下徽章：</p>

            <div className="space-y-4 mb-6">
              {newBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-gradient-to-r ${badge.color} rounded-2xl p-4 text-white shadow-lg flex items-center`}
                >
                  <div className="text-5xl mr-4">{badge.icon}</div>
                  <div className="text-left">
                    <div className="text-xl font-bold">{badge.name}</div>
                    <div className="text-sm opacity-90">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={closeCelebration}
              className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-secondary transition-all shadow-lg"
            >
              继续学习 →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseCompletion;
