'use client';

import { useState, useRef } from 'react';
import VoiceInput from './VoiceInput';

interface ChatInputProps {
  onSubmit: (prompt: string) => void;
  onRegenerate?: () => void;
  onClearChat?: () => void;
  onCopyAll?: () => void;
  onShare?: () => void;
  onEditLastPrompt?: (newPrompt: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  hasResponses?: boolean;
  lastPrompt?: string;
  showQuickPrompts?: boolean;
}

export default function ChatInput({ 
  onSubmit, 
  onRegenerate, 
  onClearChat, 
  onCopyAll, 
  onShare, 
  onEditLastPrompt,
  isLoading, 
  disabled, 
  hasResponses = false,
  lastPrompt = '',
  showQuickPrompts = true
}: ChatInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showQuickPromptsMenu, setShowQuickPromptsMenu] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt.trim());
      setPrompt('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const quickPromptCategories = [
    {
      name: 'Learning',
      icon: '🧑‍🎓',
      prompts: [
        "Explain like I'm 5",
        "Make a study guide for this topic",
        "Quiz me on this subject",
        "What are the key concepts I should know?",
        "Create flashcards for this material"
      ]
    },
    {
      name: 'Productivity',
      icon: '🛠',
      prompts: [
        "Write a professional email about",
        "Summarize this meeting",
        "Draft an outline for",
        "Create a project plan for",
        "Write a follow-up message"
      ]
    },
    {
      name: 'Creative',
      icon: '🎨',
      prompts: [
        "Write a poem about",
        "Generate story ideas for",
        "Brainstorm startup names for",
        "Create a character description for",
        "Write a creative story about"
      ]
    },
    {
      name: 'Languages',
      icon: '🌍',
      prompts: [
        "Translate this text to",
        "Help me practice French",
        "Correct my grammar in this text",
        "Explain this phrase in simple terms",
        "What's the difference between these words?"
      ]
    }
  ];

  const handleQuickPrompt = (prompt: string) => {
    setPrompt(prompt);
    setShowQuickPromptsMenu(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleEditLastPrompt = () => {
    if (lastPrompt) {
      setPrompt(lastPrompt);
      setIsEditing(true);
      setShowQuickPromptsMenu(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleSaveEdit = () => {
    if (onEditLastPrompt && prompt.trim()) {
      onEditLastPrompt(prompt.trim());
      setPrompt('');
      setIsEditing(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setPrompt(transcript);
    setShowVoiceInput(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleVoiceError = (error: string) => {
    console.error('Voice input error:', error);
    // You could show a toast notification here
  };

  return (
    <div className="max-w-4xl lg:max-w-5xl mx-auto">
      {/* Action Buttons Row */}
      {hasResponses && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isLoading}
              className="px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors text-sm"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate
            </button>
          )}
          {onClearChat && (
            <button
              onClick={onClearChat}
              className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Chat
            </button>
          )}
          {onCopyAll && (
            <button
              onClick={onCopyAll}
              className="px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy All
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="px-3 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors text-sm"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>
          )}
          {lastPrompt && onEditLastPrompt && (
            <button
              onClick={handleEditLastPrompt}
              className="px-3 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors text-sm"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Last Prompt
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl lg:rounded-3xl shadow-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200 hover:shadow-xl">
          {/* Input Area */}
          <div className="flex items-end p-4 sm:p-5 lg:p-6">
            {/* Quick Prompts Button */}
            {showQuickPrompts && (
              <button
                type="button"
                onClick={() => setShowQuickPromptsMenu(!showQuickPromptsMenu)}
                className="flex-shrink-0 p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 mr-3"
                title="Quick prompts"
                aria-label="Quick prompts"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            )}

            {/* Plus Icon */}
            <button
              type="button"
              className="flex-shrink-0 p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 mr-3"
              title="Add attachment"
              aria-label="Add attachment"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Text Input */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder={isEditing ? "Edit your prompt..." : "Ask me anything..."}
                disabled={isLoading || disabled}
                className="w-full resize-none border-0 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base leading-6 min-h-[24px] max-h-[120px]"
                rows={1}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-3">
              {/* Microphone - Hidden on small screens */}
              <button
                type="button"
                onClick={() => setShowVoiceInput(!showVoiceInput)}
                className={`hidden sm:block p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                  showVoiceInput
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Voice input"
                aria-label="Use voice input"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              {/* Magic Wand - Hidden on small screens */}
              <button
                type="button"
                className="hidden sm:block p-2 sm:p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
                title="AI suggestions"
                aria-label="Get AI suggestions"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>

              {/* Send/Save Button */}
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={!prompt.trim() || isLoading || disabled}
                  className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!prompt.trim() || isLoading || disabled}
                  className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Character count */}
        {prompt.length > 0 && (
          <div className="absolute -bottom-6 right-0 text-xs text-gray-500 dark:text-gray-400">
            {prompt.length} characters
          </div>
        )}
      </form>

      {/* Voice Input */}
      {showVoiceInput && (
        <div className="absolute bottom-full left-0 right-0 mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-10">
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            onError={handleVoiceError}
            disabled={isLoading || disabled}
          />
        </div>
      )}

      {/* Quick Prompts Menu */}
      {showQuickPromptsMenu && (
        <div className="absolute bottom-full left-0 right-0 mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickPromptCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <span className="text-lg">{category.icon}</span>
                  {category.name}
                </div>
                <div className="space-y-1">
                  {category.prompts.map((prompt, promptIndex) => (
                    <button
                      key={promptIndex}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help text */}
      <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
