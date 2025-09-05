// src/components/Header.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">✨</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  TaskManager
                </h1>
                <p className="text-xs text-gray-500 font-medium">Stay organized, stay productive</p>
              </div>
            </div>
          </div>

          {/* Enhanced User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-3 transition-all duration-200 hover:bg-gray-50/80 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="font-semibold text-gray-900 text-sm">{user?.name}</div>
                <div className="text-gray-500 text-xs">{user?.email}</div>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Enhanced Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl z-20 border border-gray-200/60 animate-scale-in">
                  <div className="p-1">
                    {/* User Info Section */}
                    <div className="px-4 py-4 border-b border-gray-200/60">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user?.name}</div>
                          <div className="text-gray-500 text-sm">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Account
                      </div>
                      
                      <button className="flex items-center w-full px-3 py-3 text-sm text-gray-700 hover:bg-gray-100/60 rounded-lg transition-all duration-200 group">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors duration-200">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Profile Settings</div>
                          <div className="text-gray-500 text-xs">Manage your account</div>
                        </div>
                      </button>
                      
                      <div className="my-2 border-t border-gray-200/60"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50/60 rounded-lg transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors duration-200">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Sign out</div>
                          <div className="text-red-400 text-xs">End your session</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;