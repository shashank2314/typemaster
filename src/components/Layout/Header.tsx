import React from 'react';
import { Keyboard, BarChart3, Settings, LogOut, User } from 'lucide-react';
import { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType | null;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ user, currentView, onViewChange, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Keyboard className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">TypeMaster</h1>
            </div>
            
            {user && (
              <nav className="hidden sm:flex space-x-6">
                <button
                  onClick={() => onViewChange('practice')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'practice' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Keyboard size={18} />
                  <span className='hidden md:flex'>Practice</span>
                </button>
                
                <button
                  onClick={() => onViewChange('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'dashboard' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 size={18} />
                  <span className='hidden md:flex'>Dashboard</span>
                </button>
                
                <button
                  onClick={() => onViewChange('settings')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'settings' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={18} />
                  <span className='hidden md:flex'>Settings</span>
                </button>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={18} />
                  <span className="font-medium">{user.username}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}