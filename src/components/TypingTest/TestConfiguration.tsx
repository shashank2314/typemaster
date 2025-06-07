import React from 'react';
import { TestConfig } from '../../types';
import { Clock, Hash, Zap, Target, Gauge } from 'lucide-react';

interface TestConfigurationProps {
  config: TestConfig;
  onConfigChange: (config: TestConfig) => void;
  onStartTest: () => void;
}

export function TestConfiguration({ config, onConfigChange, onStartTest }: TestConfigurationProps) {
  const timeOptions = [15, 30, 45, 60, 120];
  const wordOptions = [20, 40, 60, 100];
  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'hard', label: 'Hard', color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Your Test</h2>
        <p className="text-gray-600">Customize your typing practice session</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Test Mode */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Target className="mr-2 h-5 w-5 text-blue-600" />
            Test Mode
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onConfigChange({ ...config, mode: 'time' })}
              className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                config.mode === 'time'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Clock size={18} />
              <span>Time</span>
            </button>
            <button
              onClick={() => onConfigChange({ ...config, mode: 'words' })}
              className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                config.mode === 'words'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Hash size={18} />
              <span>Words</span>
            </button>
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Gauge className="mr-2 h-5 w-5 text-blue-600" />
            Difficulty
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => onConfigChange({ ...config, difficulty: diff.value as any })}
                className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                  config.difficulty === diff.value
                    ? `border-current ${diff.bgColor} ${diff.color}`
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Limit */}
        {config.mode === 'time' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              Time Limit
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => onConfigChange({ ...config, timeLimit: time })}
                  className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                    config.timeLimit === time
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Word Count */}
        {config.mode === 'words' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Hash className="mr-2 h-5 w-5 text-blue-600" />
              Word Count
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {wordOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => onConfigChange({ ...config, wordLimit: count })}
                  className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                    config.wordLimit === count
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Additional Options</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includePunctuation}
              onChange={(e) => onConfigChange({ ...config, includePunctuation: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Include Punctuation</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeNumbers}
              onChange={(e) => onConfigChange({ ...config, includeNumbers: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Include Numbers</span>
          </label>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center pt-4">
        <button
          onClick={onStartTest}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
        >
          <Zap size={20} />
          <span>Start Test</span>
        </button>
      </div>
    </div>
  );
}