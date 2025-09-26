'use client';

import { useState } from 'react';
import { AIResponse, ComparisonResponse } from '@/types/ai';
import ResponseColumn from './ResponseColumn';

interface ComparisonViewProps {
  responses: AIResponse[];
  isLoading: boolean;
  onMarkAsBest: (modelId: string) => void;
  onCopy: (content: string) => void;
  onBookmark?: (modelId: string, content: string) => void;
  bestResponseId?: string;
  bookmarkedResponses?: string[];
  onShare?: (modelId: string, content: string) => void;
  onRefresh?: (modelId: string) => void;
  onSummary?: (modelId: string, content: string) => void;
}

export default function ComparisonView({ 
  responses, 
  isLoading, 
  onMarkAsBest, 
  onCopy, 
  onBookmark,
  bestResponseId,
  bookmarkedResponses = [],
  onShare,
  onRefresh,
  onSummary
}: ComparisonViewProps) {
  if (isLoading && responses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Sending requests to AI models...
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This may take a few moments depending on the models selected.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>Processing your request</span>
          </div>
        </div>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            Welcome to AI Fiesta
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Select AI models from the header and ask a question to see how different AI systems respond to the same prompt.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Toggle models</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Ask questions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Compare responses</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Model Responses
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Compare responses from {responses.length} model{responses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Live comparison</span>
        </div>
      </div>

      {/* Response Grid */}
      <div className={`grid gap-6 ${
        responses.length === 1 ? 'grid-cols-1 max-w-4xl mx-auto' :
        responses.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
        responses.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        responses.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
        responses.length === 5 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' :
        responses.length === 6 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' :
        responses.length === 7 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8'
      }`}>
        {responses.map((response) => (
          <div key={response.modelId} className="min-h-0">
            <ResponseColumn
              response={response}
              isBest={bestResponseId === response.modelId}
              isBookmarked={bookmarkedResponses.includes(response.modelId)}
              onMarkAsBest={() => onMarkAsBest(response.modelId)}
              onCopy={onCopy}
              onBookmark={onBookmark}
              onShare={onShare}
              onRefresh={onRefresh}
              onSummary={onSummary}
            />
          </div>
        ))}
      </div>

      {/* Loading indicator for additional responses */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Waiting for remaining responses...</span>
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
}
