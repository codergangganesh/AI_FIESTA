'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { AVAILABLE_MODELS } from '@/lib/models';
import { getModelById } from '@/lib/models';

interface HeaderProps {
  selectedModels: string[];
  onModelToggle: (modelId: string) => void;
}

export default function Header({ selectedModels, onModelToggle }: HeaderProps) {
  const [isModelsOpen, setIsModelsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { setTheme } = useTheme();

  // Close popovers on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModelsOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const getModelIcon = (modelId: string) => {
    const model = getModelById(modelId);
    if (!model) return null;

    // Return different icons based on the model
    switch (model.provider) {
      case 'OpenAI':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
        );
      case 'Google':
        return (
          <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
        );
      case 'Anthropic':
        return (
          <div className="w-6 h-6 bg-orange-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
        );
      case 'DeepSeek':
        return (
          <div className="w-6 h-6 bg-purple-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
        );
      case 'Meta':
        return (
          <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
        );
      case 'Mistral AI':
        return (
          <div className="w-6 h-6 bg-gray-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-400 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">?</span>
          </div>
        );
    }
  };

  const getModelDisplayName = (modelId: string) => {
    const model = getModelById(modelId);
    if (!model) return modelId;
    
    // Shorten some model names for display
    switch (modelId) {
      case 'openai/gpt-4o':
        return 'GPT-4o';
      case 'openai/gpt-4o-mini':
        return 'GPT-4o Mini';
      case 'anthropic/claude-3.5-sonnet':
        return 'Claude 3.5';
      case 'anthropic/claude-3-haiku':
        return 'Claude 3 Haiku';
      case 'google/gemini-pro-1.5':
        return 'Gemini 2.5';
      case 'meta-llama/llama-3.1-405b-instruct':
        return 'Llama 3.1';
      case 'deepseek/deepseek-chat':
        return 'DeepSeek';
      case 'mistralai/mistral-7b-instruct':
        return 'Mistral 7B';
      default:
        return model.name;
    }
  };

  // Show curated set of models in the header (expanded)
  const headerModels = [
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    'google/gemini-pro-1.5', 
    'google/gemini-flash-1.5',
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3-haiku',
    'deepseek/deepseek-chat',
    'meta-llama/llama-3.1-405b-instruct',
    'meta-llama/llama-3.1-70b-instruct',
    'qwen/qwen2.5-72b-instruct',
    'mistralai/mistral-7b-instruct',
    'cohere/command-r-plus',
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand + Models button (hamburger on mobile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsModelsOpen(!isModelsOpen)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors"
            aria-controls="models-popover"
            title="Models"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline text-sm font-medium">Models</span>
          </button>
          <a
            href="/multi-prompt"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            Multi-Prompt
          </a>
        </div>

        {/* Center: Horizontally scrollable quick toggles (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-6 overflow-x-auto scrollbar-thin pr-2">
          {headerModels.map((modelId) => {
            const isSelected = selectedModels.includes(modelId);
            const model = getModelById(modelId);
            return (
              <div key={modelId} className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {getModelIcon(modelId)}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {getModelDisplayName(modelId)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {model?.provider}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onModelToggle(modelId)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                    isSelected ? 'bg-blue-600 shadow-lg shadow-blue-600/25' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  title={`Toggle ${getModelDisplayName(modelId)}`}
                  aria-label={`Toggle ${getModelDisplayName(modelId)} model`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-200 ${
                      isSelected ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Theme button placeholder (Light / Dark / System) */}
          <details className="relative">
            <summary className="list-none cursor-pointer p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 select-none flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="hidden sm:inline text-sm">Theme</span>
            </summary>
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl overflow-hidden z-20">
              <button onClick={() => setTheme('light')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Light</button>
              <button onClick={() => setTheme('dark')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Dark</button>
              <button onClick={() => setTheme('system')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">System</button>
            </div>
          </details>

          {/* Profile dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            <button
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Profile"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-xs font-semibold flex items-center justify-center">U</div>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-30 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="font-semibold text-gray-900 dark:text-white">User</div>
                  <div className="text-xs text-gray-500">user@example.com</div>
                </div>
                <div className="p-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between">
                    Recent selections
                    <span className="text-xs text-gray-500">{selectedModels.length} models</span>
                  </div>
                  <a href="/settings" className="block px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">Settings</a>
                  <button className="w-full text-left px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">Sign out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Models Popover Panel */}
      {isModelsOpen && (
        <div id="models-popover" className="mt-3 p-3 sm:p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Select Models</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{selectedModels.length}/8</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-72 overflow-auto">
            {AVAILABLE_MODELS.map((m) => {
              const isSelected = selectedModels.includes(m.id);
              const isDisabled = !isSelected && selectedModels.length >= 8;
              return (
                <button
                  key={m.id}
                  onClick={() => onModelToggle(m.id)}
                  disabled={isDisabled}
                  className={`group text-left p-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isDisabled
                      ? 'border-gray-200 dark:border-gray-800 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow'
                  }`}
                  title={m.name}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getModelIcon(m.id)}
                    <div className="truncate font-medium text-gray-900 dark:text-white text-sm">{m.name}</div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{m.provider}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
