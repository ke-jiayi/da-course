import React, { useEffect, useState } from 'react';
import { STAGE_MESSAGES, PyodideStage } from '../services/pyodideService';

interface PyodideLoaderProps {
  stage: PyodideStage;
  percent: number;
  error?: string | null;
  elapsedSeconds?: number;
  onRetry?: () => void;
  compact?: boolean;
}

const PyodideLoader: React.FC<PyodideLoaderProps> = ({
  stage,
  percent,
  error,
  elapsedSeconds = 0,
  onRetry,
  compact = false,
}) => {
  const [displayPercent, setDisplayPercent] = useState(0);

  // 平滑动画
  useEffect(() => {
    if (displayPercent < percent) {
      const timer = setTimeout(() => {
        setDisplayPercent((prev) => Math.min(prev + Math.max(1, Math.floor((percent - prev) / 3)), percent));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [percent, displayPercent]);

  if (error) {
    return (
      <div className={compact ? 'p-4' : 'p-6 md:p-8'}>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-4xl mb-2">⚠️</div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800 mb-2">环境加载失败</h3>
              <p className="text-sm text-red-700 whitespace-pre-wrap">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-all shadow-md"
                >
                  🔄 重新加载
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stageIcon = ['🚀', '📦', '🎨', '✅'][stage] || '🚀';
  const stageDesc = STAGE_MESSAGES[stage] || '加载中...';
  const isDone = stage === 4 && percent >= 100;

  if (compact) {
    return (
      <div className="py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-blue-800">
            {stageIcon} {stageDesc}
          </span>
          <span className="text-blue-600 font-mono">{Math.round(displayPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-200"
            style={{ width: `${displayPercent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        {/* 头部动画图标 */}
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 text-center">
          <div className="text-7xl mb-3 inline-block animate-bounce-slow">
            {isDone ? '🎉' : stageIcon}
          </div>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
            {isDone ? '准备就绪！' : '正在准备 Python 环境'}
          </h2>
          <p className="text-blue-100 text-sm md:text-base">
            {isDone ? '你现在可以开始编写和运行代码了' : '首次加载需要下载必要的库，请耐心等待'}
          </p>
        </div>

        {/* 进度条 */}
        <div className="p-6 md:p-8">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">整体进度</span>
              <span className="text-blue-600 font-mono text-lg font-bold">{Math.round(displayPercent)}%</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transition-all duration-300 shadow-lg"
                style={{ width: `${displayPercent}%` }}
              />
            </div>
          </div>

          {/* 阶段列表 */}
          <div className="space-y-2 mb-6">
            {([1, 2, 3, 4] as const).map((s) => {
              const isActive = stage === s;
              const isPast = stage > s;
              return (
                <div
                  key={s}
                  className={`flex items-center p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 border border-blue-200'
                      : isPast
                      ? 'bg-green-50 border border-green-100'
                      : 'bg-gray-50 border border-gray-100 opacity-60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-sm font-bold ${
                      isActive
                        ? 'bg-blue-500 text-white animate-pulse'
                        : isPast
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    {isPast ? '✓' : s}
                  </div>
                  <span
                    className={`text-sm md:text-base ${
                      isActive ? 'text-blue-800 font-medium' : isPast ? 'text-green-800' : 'text-gray-500'
                    }`}
                  >
                    {STAGE_MESSAGES[s]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 已用时间 */}
          <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
            <span>⏱️ 已用时间</span>
            <span className="font-mono">{Math.floor(elapsedSeconds / 60)}分{elapsedSeconds % 60}秒</span>
          </div>

          {/* 小贴士 */}
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="text-sm text-yellow-800">
              <span className="font-semibold">💡 小贴士：</span>
              {' '}
              {stage === 1 && '正在从 CDN 下载 Python 运行时文件，大约需要几秒到几十秒...'}
              {stage === 2 && '正在加载 pandas 和 numpy 等数据分析库，这通常是最长的一步...'}
              {stage === 3 && '正在配置 matplotlib 绘图引擎，马上就好了...'}
              {stage === 4 && '全部加载完成！你现在可以开始运行代码和创建图表了。'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PyodideLoader;
