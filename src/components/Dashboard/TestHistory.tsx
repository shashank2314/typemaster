import React, { useState } from 'react';
import { TestResult } from '../../types';
import { ChevronDown, ChevronUp, Calendar, Filter } from 'lucide-react';

interface TestHistoryProps {
  results: TestResult[];
}

export function TestHistory({ results }: TestHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'wpm' | 'accuracy'>('date');

  const filteredResults = results.filter(result => 
    filter === 'all' || result.config.difficulty === filter
  );

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'wpm':
        return b.wpm - a.wpm;
      case 'accuracy':
        return b.accuracy - a.accuracy;
      default:
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    }
  });

  const displayResults = isExpanded ? sortedResults : sortedResults.slice(0, 5);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
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

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Test History</h3>
        <div className="text-center py-8 text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p>No test history available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Test History</h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="wpm">Sort by WPM</option>
            <option value="accuracy">Sort by Accuracy</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
              <th className="text-left py-3 text-sm font-medium text-gray-600">Difficulty</th>
              <th className="text-left py-3 text-sm font-medium text-gray-600">Mode</th>
              <th className="text-left py-3 text-sm font-medium text-gray-600">WPM</th>
              <th className="text-left py-3 text-sm font-medium text-gray-600">Accuracy</th>
              <th className="text-left py-3 text-sm font-medium text-gray-600">Time</th>
            </tr>
          </thead>
          <tbody>
            {displayResults.map((result) => (
              <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 text-sm text-gray-900">
                  {formatDate(result.completedAt)}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(result.config.difficulty)}`}>
                    {result.config.difficulty}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-600">
                  {result.config.mode === 'time' 
                    ? `${result.config.timeLimit}s` 
                    : `${result.config.wordLimit} words`}
                </td>
                <td className="py-3 text-sm font-semibold text-blue-600">
                  {result.wpm}
                </td>
                <td className="py-3 text-sm font-semibold text-green-600">
                  {result.accuracy}%
                </td>
                <td className="py-3 text-sm text-gray-600">
                  {Math.round(result.timeSpent)}s
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 mx-auto px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <span>{isExpanded ? 'Show Less' : `Show All ${results.length} Tests`}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}