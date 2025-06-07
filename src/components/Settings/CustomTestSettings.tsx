import React, { useState } from 'react';
import { TestConfig } from '../../types';
import { Play, Settings as SettingsIcon } from 'lucide-react';

interface CustomTestSettingsProps {
  onStartCustomTest: (config: TestConfig) => void;
}

export function CustomTestSettings({ onStartCustomTest }: CustomTestSettingsProps) {
  const [customConfig, setCustomConfig] = useState<TestConfig>({
    mode: 'time',
    difficulty: 'medium',
    timeLimit: 60,
    wordLimit: 50,
    includePunctuation: false,
    includeNumbers: false
  });

  const handleStartTest = () => {
    onStartCustomTest(customConfig);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <SettingsIcon className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Custom Test Configuration</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Test Mode */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Test Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setCustomConfig({ ...customConfig, mode: 'time' })}
              className={`p-3 rounded-lg border-2 transition-all ${
                customConfig.mode === 'time'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              Time-based
            </button>
            <button
              onClick={() => setCustomConfig({ ...customConfig, mode: 'words' })}
              className={`p-3 rounded-lg border-2 transition-all ${
                customConfig.mode === 'words'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              Word-based
            </button>
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            value={customConfig.difficulty}
            onChange={(e) => setCustomConfig({ ...customConfig, difficulty: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Time Limit (if time mode) */}
        {customConfig.mode === 'time' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Time Limit (seconds)
            </label>
            <input
              type="number"
              min="10"
              max="600"
              value={customConfig.timeLimit || 60}
              onChange={(e) => setCustomConfig({ ...customConfig, timeLimit: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Word Count (if words mode) */}
        {customConfig.mode === 'words' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Word Count
            </label>
            <input
              type="number"
              min="10"
              max="500"
              value={customConfig.wordLimit || 50}
              onChange={(e) => setCustomConfig({ ...customConfig, wordLimit: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Text Options</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={customConfig.includePunctuation}
              onChange={(e) => setCustomConfig({ ...customConfig, includePunctuation: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Include Punctuation</span>
              <p className="text-sm text-gray-600">Add commas, periods, and other punctuation marks</p>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={customConfig.includeNumbers}
              onChange={(e) => setCustomConfig({ ...customConfig, includeNumbers: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Include Numbers</span>
              <p className="text-sm text-gray-600">Add numeric digits to the text</p>
            </div>
          </label>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Test Preview</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Mode:</span> {customConfig.mode === 'time' ? `${customConfig.timeLimit} seconds` : `${customConfig.wordLimit} words`}</p>
          <p><span className="font-medium">Difficulty:</span> {customConfig.difficulty}</p>
          <p><span className="font-medium">Options:</span> {[
            customConfig.includePunctuation && 'Punctuation',
            customConfig.includeNumbers && 'Numbers'
          ].filter(Boolean).join(', ') || 'None'}</p>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center pt-4">
        <button
          onClick={handleStartTest}
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105"
        >
          <Play size={20} />
          <span>Start Custom Test</span>
        </button>
      </div>
    </div>
  );
}