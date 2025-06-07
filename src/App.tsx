import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { TestConfig, TypingStats, TestResult } from './types';
import { apiClient } from './utils/api';

// Components
import { Header } from './components/Layout/Header';
import { AuthModal } from './components/Auth/AuthModal';
import { TestConfiguration } from './components/TypingTest/TestConfiguration';
import { TypingInterface } from './components/TypingTest/TypingInterface';
import { TestResults } from './components/TypingTest/TestResults';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Settings } from './components/Settings/Settings';

type AppView = 'practice' | 'dashboard' | 'settings';
type TestState = 'config' | 'active' | 'results';

function App() {
  const { user, loading, login, register, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('practice');
  const [testState, setTestState] = useState<TestState>('config');
  const [testConfig, setTestConfig] = useState<TestConfig>({
    mode: 'time',
    difficulty: 'medium',
    timeLimit: 60,
    wordLimit: 50,
    includePunctuation: false,
    includeNumbers: false
  });
  const [testStats, setTestStats] = useState<TypingStats | null>(null);
  const [testTime, setTestTime] = useState<number>(0);
  const [testText, setTestText] = useState<string>('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [user, loading]);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const success = await login(email, password);
    if (success) {
      setShowAuthModal(false);
    }
    return success;
  };

  const handleRegister = async (username: string, email: string, password: string): Promise<boolean> => {
    const success = await register(username, email, password);
    if (success) {
      setShowAuthModal(false);
    }
    return success;
  };

  const handleStartTest = () => {
    setTestState('active');
  };

  const handleTestComplete = async (stats: TypingStats, timeSpent: number, text: string) => {
    setTestStats(stats);
    setTestTime(timeSpent);
    setTestText(text);
    setTestState('results');

    // Save result to server
    if (user) {
      try {
        await apiClient.saveResult({
          config: testConfig,
          wpm: stats.currentWpm,
          accuracy: stats.currentAccuracy,
          correctChars: stats.correctChars,
          incorrectChars: stats.incorrectChars,
          totalChars: stats.totalChars,
          timeSpent,
          text
        });
      } catch (error) {
        console.error('Failed to save test result:', error);
        // Could show a toast notification here
      }
    }
  };

  const handleRestartTest = () => {
    setTestState('config');
    setTestStats(null);
    setTestTime(0);
    setTestText('');
  };

  const handleStartCustomTest = (config: TestConfig) => {
    setTestConfig(config);
    setCurrentView('practice');
    setTestState('active');
  };

  const handleViewDashboard = () => {
    setCurrentView('dashboard');
    handleRestartTest();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TypeMaster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogin={() => setShowAuthModal(true)}
        onLogout={logout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to TypeMaster</h1>
              <p className="text-xl text-gray-600 mb-8">
                Improve your typing speed and accuracy with our comprehensive practice platform.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentView === 'practice' && (
              <>
                {testState === 'config' && (
                  <TestConfiguration
                    config={testConfig}
                    onConfigChange={setTestConfig}
                    onStartTest={handleStartTest}
                  />
                )}

                {testState === 'active' && (
                  <TypingInterface
                    config={testConfig}
                    onTestComplete={handleTestComplete}
                    onRestart={handleRestartTest}
                  />
                )}

                {testState === 'results' && testStats && (
                  <TestResults
                    stats={testStats}
                    timeSpent={testTime}
                    onRestart={handleRestartTest}
                    onViewDashboard={handleViewDashboard}
                  />
                )}
              </>
            )}

            {currentView === 'dashboard' && (
              <Dashboard user={user} />
            )}

            {currentView === 'settings' && (
              <Settings onStartCustomTest={handleStartCustomTest} />
            )}
          </>
        )}
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}

export default App;