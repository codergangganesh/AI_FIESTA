'use client';

import { useState } from 'react';
import { AIResponse, ComparisonResponse } from '@/types/ai';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ChatInput from '@/components/ChatInput';
import MultiPromptInput from '@/components/MultiPromptInput';
import ComparisonView from '@/components/ComparisonView';
import ComparisonTools from '@/components/ComparisonTools';

export default function ComparePage() {
  const [selectedModels, setSelectedModels] = useState<string[]>(['openai/gpt-4o', 'google/gemini-pro-1.5', 'deepseek/deepseek-chat']);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bestResponseId, setBestResponseId] = useState<string | undefined>();
  const [bookmarkedResponses, setBookmarkedResponses] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<Array<{prompt: string, responses: AIResponse[], timestamp: Date | string | number}>>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMultiPromptMode, setIsMultiPromptMode] = useState(false);

  const handlePromptSubmit = async (prompt: string) => {
    if (selectedModels.length === 0) {
      alert('Please select at least one AI model to compare.');
      return;
    }

    setIsLoading(true);
    setResponses([]);
    setBestResponseId(undefined);

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          selectedModels,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ComparisonResponse = await response.json();
      setResponses(data.responses);

      setChatHistory(prev => [...prev, {
        prompt,
        responses: data.responses,
        timestamp: new Date(Date.now())
      }]);
    } catch (error) {
      console.error('Error comparing models:', error);
      alert('Failed to compare models. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsBest = (modelId: string) => {
    setBestResponseId(bestResponseId === modelId ? undefined : modelId);
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error('Failed to copy text:', error);
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleCopyBest = async () => {
    if (!bestResponseId) return;
    const best = responses.find(r => r.modelId === bestResponseId);
    if (best?.content) {
      await handleCopy(best.content);
    }
  };

  const handleNewChat = () => {
    setResponses([]);
    setBestResponseId(undefined);
  };

  const handleRegenerate = async () => {
    if (chatHistory.length > 0) {
      const lastChat = chatHistory[chatHistory.length - 1];
      await handlePromptSubmit(lastChat.prompt);
    }
  };

  const handleClearChat = () => {
    setResponses([]);
    setBestResponseId(undefined);
    setChatHistory([]);
  };

  const handleCopyAll = async () => {
    const allResponses = responses.map(r => `${r.modelId}: ${r.content}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(allResponses);
    } catch (error) {
      console.error('Failed to copy all responses:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'AI Fiesta Comparison',
      text: `Check out this AI model comparison:\n\n${responses.map(r => `${r.modelId}: ${r.content}`).join('\n\n')}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await handleCopyAll();
    }
  };

  const handleEditLastPrompt = (newPrompt: string) => {
    if (chatHistory.length > 0) {
      const updatedHistory = [...chatHistory];
      updatedHistory[updatedHistory.length - 1].prompt = newPrompt;
      setChatHistory(updatedHistory);
      handlePromptSubmit(newPrompt);
    }
  };

  const handleRateResponse = (modelId: string, rating: number) => {
    console.log(`Rating ${modelId}: ${rating}/5`);
  };

  const handleHighlightDifferences = () => {
    console.log('Highlighting differences between responses');
  };

  const handleExportComparison = () => {
    const comparisonData = {
      timestamp: new Date().toISOString(),
      prompt: chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].prompt : '',
      responses: responses.map(r => ({
        model: r.modelId,
        content: r.content,
        wordCount: r.content.trim().split(/\s+/).length,
        characterCount: r.content.length
      }))
    };

    const dataStr = JSON.stringify(comparisonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-comparison-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBookmark = (modelId: string, content: string) => {
    if (bookmarkedResponses.includes(modelId)) {
      setBookmarkedResponses(prev => prev.filter(id => id !== modelId));
    } else {
      setBookmarkedResponses(prev => [...prev, modelId]);
    }
    console.log(`Bookmarked ${modelId}:`, content.substring(0, 100) + '...');
  };

  const handleMultiPromptSubmit = async (prompts: string[]) => {
    if (selectedModels.length === 0) {
      alert('Please select at least one AI model to compare.');
      return;
    }

    if (prompts.length === 0) {
      alert('Please enter at least one prompt.');
      return;
    }

    setIsLoading(true);
    setResponses([]);
    setBestResponseId(undefined);

    try {
      const allResponses: AIResponse[] = [];

      for (const prompt of prompts) {
        const response = await fetch('/api/compare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            selectedModels,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ComparisonResponse = await response.json();

        const responsesWithPrompt = data.responses.map(r => ({
          ...r,
          modelId: `${r.modelId}-${prompts.indexOf(prompt)}`,
          originalModelId: r.modelId,
          promptIndex: prompts.indexOf(prompt),
          prompt: prompt
        }));

        allResponses.push(...responsesWithPrompt);
      }

      setResponses(allResponses);

      setChatHistory(prev => [...prev, {
        prompt: `Multi-prompt comparison (${prompts.length} prompts)`,
        responses: allResponses,
        timestamp: new Date(Date.now())
      }]);
    } catch (error) {
      console.error('Error comparing multi-prompts:', error);
      alert('Failed to compare prompts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 w-full">
        <div className="hidden lg:block">
          <Sidebar 
            chatHistory={chatHistory}
            onNewChat={handleNewChat}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <Header 
            selectedModels={selectedModels}
            onModelToggle={(modelId) => {
              if (selectedModels.includes(modelId)) {
                setSelectedModels(selectedModels.filter(id => id !== modelId));
              } else {
                if (selectedModels.length < 8) {
                  setSelectedModels([...selectedModels, modelId]);
                }
              }
            }}
          />

          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {responses.length > 0 && (
                <div className="flex items-center justify-end gap-2 mb-4">
                  <button
                    onClick={handleCopyBest}
                    disabled={!bestResponseId}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-sm transition-colors"
                    title="Copy the best response"
                  >
                    Copy Best
                  </button>
                </div>
              )}
              {responses.length > 0 && (
                <ComparisonTools
                  responses={responses}
                  onRateResponse={modelId => console.log(modelId)}
                  onHighlightDifferences={() => console.log('highlight')}
                  onExportComparison={handleExportComparison}
                />
              )}
              <ComparisonView
                responses={responses}
                isLoading={isLoading}
                onMarkAsBest={handleMarkAsBest}
                onCopy={handleCopy}
                onBookmark={handleBookmark}
                bestResponseId={bestResponseId}
                bookmarkedResponses={bookmarkedResponses}
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-800/50">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button onClick={() => setIsMultiPromptMode(false)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!isMultiPromptMode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>Single Prompt</button>
                  <button onClick={() => setIsMultiPromptMode(true)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isMultiPromptMode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>Multi-Prompt</button>
                </div>
              </div>

              {isMultiPromptMode ? (
                <MultiPromptInput onSubmit={handleMultiPromptSubmit} isLoading={isLoading} disabled={selectedModels.length === 0} />
              ) : (
                <ChatInput
                  onSubmit={handlePromptSubmit}
                  onRegenerate={handleRegenerate}
                  onClearChat={handleClearChat}
                  onCopyAll={handleCopyAll}
                  onShare={handleShare}
                  onEditLastPrompt={newPrompt => handleEditLastPrompt(newPrompt)}
                  isLoading={isLoading}
                  disabled={selectedModels.length === 0}
                  hasResponses={responses.length > 0}
                  lastPrompt={chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].prompt : undefined}
                  showQuickPrompts={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


