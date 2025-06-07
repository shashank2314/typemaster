import React from 'react';
import { TestResult } from '../../types';
import { Clock, Target, Zap, Calendar } from 'lucide-react';

interface RecentTestsProps {
  results: TestResult[];
}

export function RecentTests({ results }: RecentTestsProps) {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Tests</h3>
        <div className="text-center py-8 text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p>No recent tests to display</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Tests</h3>
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(result.config.difficulty)}`}>
                {result.config.difficulty.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">{formatDate(result.completedAt)}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">WPM:</span>
                <span className="font-semibold text-blue-600">{result.wpm}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-semibold text-green-600">{result.accuracy}%</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold text-purple-600">{Math.round(result.timeSpent)}s</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}