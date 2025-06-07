import React from 'react';
import { TestResult } from '../../types';
import { Trophy, Target, Clock, Zap, TrendingUp, Calendar } from 'lucide-react';

interface StatsOverviewProps {
  stats: any;
  results: TestResult[];
}

export function StatsOverview({ stats, results }: StatsOverviewProps) {
  if (!stats || results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Trophy size={48} className="mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests completed yet</h3>
        <p className="text-gray-600">Start practicing to see your statistics here!</p>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Average WPM',
      value: stats.avgWpm,
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      gradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Average Accuracy',
      value: `${stats.avgAccuracy}%`,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      gradient: 'from-green-50 to-green-100'
    },
    {
      title: 'Best WPM',
      value: stats.bestWpm,
      icon: Trophy,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      gradient: 'from-amber-50 to-amber-100'
    },
    {
      title: 'Best Accuracy',
      value: `${stats.bestAccuracy}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      gradient: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Total Practice Time',
      value: `${stats.totalTime}m`,
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      gradient: 'from-red-50 to-red-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <div key={index} className={`bg-gradient-to-r ${stat.gradient} rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-full`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}