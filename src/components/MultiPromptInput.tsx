'use client';

import { useState, useRef } from 'react';

interface MultiPromptInputProps {
  onSubmit: (prompts: string[]) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function MultiPromptInput({ onSubmit, isLoading, disabled = false }: MultiPromptInputProps) {
  const [prompts, setPrompts] = useState<string[]>(['']);
  const [activeIndex, setActiveIndex] = useState(0);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const addPrompt = () => {
    if (prompts.length < 10) { // Limit to 10 prompts
      setPrompts([...prompts, '']);
      setActiveIndex(prompts.length);
      // Focus the new textarea after it's rendered
      setTimeout(() => {
        const newTextarea = textareaRefs.current[prompts.length];
        if (newTextarea) {
          newTextarea.focus();
        }
      }, 0);
    }
  };

  const removePrompt = (index: number) => {
    if (prompts.length > 1) {
      const newPrompts = prompts.filter((_, i) => i !== index);
      setPrompts(newPrompts);
      if (activeIndex >= newPrompts.length) {
        setActiveIndex(newPrompts.length - 1);
      }
    }
  };

  const updatePrompt = (index: number, value: string) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPrompts = prompts.filter(p => p.trim());
    if (validPrompts.length > 0 && !isLoading && !disabled) {
      onSubmit(validPrompts);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (index === prompts.length - 1) {
        handleSubmit(e);
      } else {
        setActiveIndex(index + 1);
        setTimeout(() => {
          const nextTextarea = textareaRefs.current[index + 1];
          if (nextTextarea) {
            nextTextarea.focus();
          }
        }, 0);
      }
    } else if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      setActiveIndex(index - 1);
      setTimeout(() => {
        const prevTextarea = textareaRefs.current[index - 1];
        if (prevTextarea) {
          prevTextarea.focus();
        }
      }, 0);
    } else if (e.key === 'ArrowDown' && index < prompts.length - 1) {
      e.preventDefault();
      setActiveIndex(index + 1);
      setTimeout(() => {
        const nextTextarea = textareaRefs.current[index + 1];
        if (nextTextarea) {
          nextTextarea.focus();
        }
      }, 0);
    }
  };

  const adjustTextareaHeight = (index: number) => {
    const textarea = textareaRefs.current[index];
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const clearAll = () => {
    setPrompts(['']);
    setActiveIndex(0);
  };

  const loadExamplePrompts = () => {
    setPrompts([
      'Explain quantum computing in simple terms',
      'What are the benefits of renewable energy?',
      'How does machine learning work?',
      'Describe the process of photosynthesis'
    ]);
  };

  return (
    <div className="max-w-4xl lg:max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Multi-Prompt Comparison</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter multiple prompts to compare AI responses across different questions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadExamplePrompts}
              className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              Load Examples
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Prompts List */}
        <div className="space-y-3">
          {prompts.map((prompt, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 border rounded-lg transition-all duration-200 ${
                activeIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start p-4">
                {/* Prompt Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {index + 1}
                  </span>
                </div>

                {/* Text Input */}
                <div className="flex-1 min-w-0">
                  <textarea
                    ref={(el) => (textareaRefs.current[index] = el)}
                    value={prompt}
                    onChange={(e) => {
                      updatePrompt(index, e.target.value);
                      adjustTextareaHeight(index);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={() => setActiveIndex(index)}
                    placeholder={`Enter prompt ${index + 1}...`}
                    disabled={isLoading || disabled}
                    className="w-full resize-none border-0 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base leading-6 min-h-[24px] max-h-[120px]"
                    rows={1}
                  />
                </div>

                {/* Remove Button */}
                {prompts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrompt(index)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-2"
                    title="Remove prompt"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Prompt Button */}
        {prompts.length < 10 && (
          <button
            type="button"
            onClick={addPrompt}
            className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Prompt ({prompts.length}/10)
            </div>
          </button>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-center pt-4">
          <button
            type="submit"
            disabled={prompts.every(p => !p.trim()) || isLoading || disabled}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing {prompts.filter(p => p.trim()).length} prompts...
              </div>
            ) : (
              `Compare ${prompts.filter(p => p.trim()).length} Prompts`
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Press Enter to move to next prompt, Shift+Enter for new line</p>
          <p>Use Arrow keys to navigate between prompts</p>
        </div>
      </form>
    </div>
  );
}
