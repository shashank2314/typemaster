import React, { useState, useEffect } from 'react';
import { TestResult, User } from '../../types';
import { apiClient } from '../../utils/api';
import { StatsOverview } from './StatsOverview';
import { RecentTests } from './RecentTests';
import { ProgressChart } from './ProgressChart';
import { TestHistory } from './TestHistory';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both results and stats in parallel
        const [resultsData, statsData] = await Promise.all([
          apiClient.getResults(100, 0),
          apiClient.getStats()
        ]);

        setResults(resultsData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.username}!
        </h1>
        <p className="text-gray-600">Track your typing progress and improve your skills</p>
      </div>

      <StatsOverview stats={stats} results={results} />
      
      <div className="grid lg:grid-cols-2 gap-8">
        <ProgressChart results={results} />
        <RecentTests results={results.slice(0, 5)} />
      </div>

      <TestHistory results={results} />
    </div>
  );
}