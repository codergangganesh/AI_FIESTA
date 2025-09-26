'use client';

import { useState } from 'react';
import { AIResponse } from '@/types/ai';

interface ChatHistoryItem {
  prompt: string;
  responses: AIResponse[];
  timestamp: Date | string | number;
}

interface SidebarProps {
  chatHistory: ChatHistoryItem[];
  onNewChat: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Sidebar({ chatHistory, onNewChat, isDarkMode, onToggleTheme }: SidebarProps) {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const formatDate = (timestamp: Date | string | number) => {
    try {
      // Convert to Date object if it's not already
      let date: Date;
      
      if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        return 'Recent';
      }
      
      // Check if the date is valid
      if (!date || isNaN(date.getTime())) {
        return 'Recent';
      }
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error, 'Original timestamp:', timestamp);
      return 'Recent';
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const filteredChatHistory = chatHistory.filter(chat =>
    chat.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-gray-900 text-white flex flex-col h-full">
      {/* Logo and Title */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-semibold">AI Fiesta</h1>
        </div>
      </div>

      {/* New Chat + Search */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center gap-3 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">New Chat</span>
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            title="Search chat history"
            aria-label="Search chat history"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* Projects Section */}
      <div className="px-4">
        <button
          onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
          className="w-full flex items-center gap-3 text-gray-300 hover:text-white py-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
          </svg>
          <span className="font-medium">Projects</span>
          <svg 
            className={`w-4 h-4 ml-auto transition-transform ${isProjectsExpanded ? 'rotate-90' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {isProjectsExpanded && (
          <div className="ml-8 mt-2 space-y-1">
            <div className="text-sm text-gray-400 py-1">No projects yet</div>
          </div>
        )}
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {filteredChatHistory.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              {searchTerm ? (
                <>
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-sm">No results found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </>
              ) : (
                <>
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm">No chat history yet</p>
                  <p className="text-xs mt-1">Start a new conversation to see it here</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {searchTerm ? `Search Results (${filteredChatHistory.length})` : formatDate(filteredChatHistory[0]?.timestamp)}
              </div>
              <div className="space-y-2">
                {filteredChatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors group"
                  >
                    <div className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {searchTerm ? (
                        <span dangerouslySetInnerHTML={{
                          __html: chat.prompt.replace(
                            new RegExp(`(${searchTerm})`, 'gi'),
                            '<mark class="bg-yellow-300 text-yellow-900">$1</mark>'
                          )
                        }} />
                      ) : (
                        truncateText(chat.prompt)
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {chat.responses.length} model{chat.responses.length !== 1 ? 's' : ''} compared
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700">
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">U</span>
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-white">User</div>
              <div className="text-xs text-gray-400">user@example.com</div>
            </div>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={onToggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isDarkMode ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  )}
                </svg>
                <span className="text-sm text-gray-300">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
              
              <a 
                href="/settings"
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-300">Settings</span>
              </a>
              
              <div className="border-t border-gray-700">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm text-gray-300">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
