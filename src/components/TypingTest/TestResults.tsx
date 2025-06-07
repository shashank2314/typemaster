import React from 'react';
import { TypingStats } from '../../types';
import { Trophy, Target, Clock, Keyboard, RotateCcw, BarChart3 } from 'lucide-react';

interface TestResultsProps {
  stats: TypingStats;
  timeSpent: number;
  onRestart: () => void;
  onViewDashboard: () => void;
}

export function TestResults({ stats, timeSpent, onRestart, onViewDashboard }: TestResultsProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 85) return 'text-blue-600';
    if (accuracy >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const getWpmColor = (wpm: number): string => {
    if (wpm >= 60) return 'text-green-600';
    if (wpm >= 40) return 'text-blue-600';
    if (wpm >= 25) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h2>
        <p className="text-gray-600">Here's how you performed</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-200 rounded-full mb-3">
            <Keyboard className="w-6 h-6 text-blue-700" />
          </div>
          <div className={`text-3xl font-bold mb-1 ${getWpmColor(stats.currentWpm)}`}>
            {stats.currentWpm}
          </div>
          <div className="text-sm text-gray-600">Words Per Minute</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-200 rounded-full mb-3">
            <Target className="w-6 h-6 text-green-700" />
          </div>
          <div className={`text-3xl font-bold mb-1 ${getAccuracyColor(stats.currentAccuracy)}`}>
            {stats.currentAccuracy}%
          </div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-200 rounded-full mb-3">
            <Clock className="w-6 h-6 text-purple-700" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {formatTime(timeSpent)}
          </div>
          <div className="text-sm text-gray-600">Time Spent</div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-200 rounded-full mb-3">
            <BarChart3 className="w-6 h-6 text-amber-700" />
          </div>
          <div className="text-3xl font-bold text-amber-600 mb-1">
            {stats.totalChars}
          </div>
          <div className="text-sm text-gray-600">Characters Typed</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Correct Characters:</span>
            <span className="font-medium text-green-600">{stats.correctChars}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Incorrect Characters:</span>
            <span className="font-medium text-red-600">{stats.incorrectChars}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Characters:</span>
            <span className="font-medium text-gray-900">{stats.totalChars}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RotateCcw size={20} />
          <span>Try Again</span>
        </button>
        
        <button
          onClick={onViewDashboard}
          className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <BarChart3 size={20} />
          <span>View Dashboard</span>
        </button>
      </div>
    </div>
  );
}