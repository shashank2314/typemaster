import React from 'react';
import { TestResult } from '../../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressChartProps {
  results: TestResult[];
}

export function ProgressChart({ results }: ProgressChartProps) {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Progress Chart</h3>
        <div className="text-center py-8 text-gray-500">
          <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
          <p>Complete more tests to see your progress</p>
        </div>
      </div>
    );
  }

  // Take last 10 results for chart
  const chartData = results.slice(0, 10).reverse();
  const maxWpm = Math.max(...chartData.map(r => r.wpm));
  const minWpm = Math.min(...chartData.map(r => r.wpm));
  
  // Calculate trend
  const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2));
  const secondHalf = chartData.slice(Math.floor(chartData.length / 2));
  const firstAvg = firstHalf.reduce((sum, r) => sum + r.wpm, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, r) => sum + r.wpm, 0) / secondHalf.length;
  const trend = secondAvg - firstAvg;

  const getTrendIcon = () => {
    if (trend > 2) return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (trend < -2) return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  const getTrendText = () => {
    if (trend > 2) return `+${Math.round(trend)} WPM improvement`;
    if (trend < -2) return `${Math.round(trend)} WPM decline`;
    return 'Stable performance';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Progress Chart</h3>
        <div className="flex items-center space-x-2 text-sm">
          {getTrendIcon()}
          <span className="text-gray-600">{getTrendText()}</span>
        </div>
      </div>

      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>{maxWpm}</span>
          <span>{Math.round((maxWpm + minWpm) / 2)}</span>
          <span>{minWpm}</span>
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="h-px bg-gray-200"></div>
            <div className="h-px bg-gray-200"></div>
            <div className="h-px bg-gray-200"></div>
          </div>

          {/* Data points and line */}
          
          <svg 
              viewBox="0 0 100 100"  // normalized space (100x100 grid)
              preserveAspectRatio="none"
              className="w-full h-full">
            {/* Line */}
            <polyline
              points={chartData.map((result, index) => {
                const x = (index / (chartData.length - 1)) * 100;
                const y = ((maxWpm - result.wpm) / (maxWpm - minWpm)) * 100;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth=".5"
              className="drop-shadow-sm"
            />
          </svg>
          <svg className=" absolute inset-0 w-full h-full">
            {/* Data points */}
            {chartData.map((result, index) => {
              const x = (index / (chartData.length - 1)) * 100;
              const y = ((maxWpm - result.wpm) / (maxWpm - minWpm)) * 100;
              return (
                <circle
                  key={result.id}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="#3B82F6"
                  className="drop-shadow-sm"
                >
                  <title>{`${result.wpm} WPM - ${new Date(result.completedAt).toLocaleDateString()}`}</title>
                </circle>
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-500 mt-2">
          <span>Oldest</span>
          <span>Latest</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Best in period:</span>
          <span className="ml-2 font-semibold text-green-600">{maxWpm} WPM</span>
        </div>
        <div>
          <span className="text-gray-600">Average:</span>
          <span className="ml-2 font-semibold text-blue-600">
            {Math.round(chartData.reduce((sum, r) => sum + r.wpm, 0) / chartData.length)} WPM
          </span>
        </div>
      </div>
    </div>
  );
}