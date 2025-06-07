import React, { useState } from 'react';
import { TestConfig } from '../../types';
import { CustomTestSettings } from './CustomTestSettings';
import { Settings as SettingsIcon, Sliders, Palette, User } from 'lucide-react';

interface SettingsProps {
  onStartCustomTest: (config: TestConfig) => void;
}

export function Settings({ onStartCustomTest }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'custom' | 'preferences' | 'profile'>('custom');

  const tabs = [
    { id: 'custom', label: 'Custom Test', icon: Sliders },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your typing experience</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'custom' && (
            <CustomTestSettings onStartCustomTest={onStartCustomTest} />
          )}
          
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Palette className="mr-2 h-5 w-5 text-blue-600" />
                Display Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-900">Theme</label>
                    <p className="text-sm text-gray-600">Choose your preferred color scheme</p>
                  </div>
                  <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-900">Font Size</label>
                    <p className="text-sm text-gray-600">Adjust text size for better readability</p>
                  </div>
                  <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Profile Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal WPM</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter target WPM"
                  />
                </div>
                
                <div className="pt-4">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}