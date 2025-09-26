'use client';

import { useState } from 'react';
import { AIResponse } from '@/types/ai';
import { getModelById } from '@/lib/models';
import TextToSpeech from './TextToSpeech';

interface ResponseColumnProps {
  response: AIResponse;
  isBest?: boolean;
  isBookmarked?: boolean;
  onMarkAsBest?: () => void;
  onCopy?: (content: string) => void;
  onBookmark?: (modelId: string, content: string) => void;
  onShare?: (modelId: string, content: string) => void;
  onRefresh?: (modelId: string) => void;
  onSummary?: (modelId: string, content: string) => void;
}

export default function ResponseColumn({ 
  response, 
  isBest = false, 
  isBookmarked = false,
  onMarkAsBest, 
  onCopy,
  onBookmark,
  onShare,
  onRefresh,
  onSummary
}: ResponseColumnProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const model = getModelById(response.modelId);

  const handleCopy = async () => {
    if (response.content && onCopy) {
      await onCopy(response.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookmark = () => {
    if (response.content && onBookmark) {
      onBookmark(response.modelId, response.content);
      setBookmarked(!bookmarked);
    }
  };

  const formatTimestamp = (timestamp: Date | string | number) => {
    try {
      // Convert to Date object if it's not already
      let date: Date;
      
      if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        return 'Just now';
      }
      
      // Check if the date is valid
      if (!date || isNaN(date.getTime())) {
        return 'Just now';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Error formatting timestamp:', error, 'Original timestamp:', timestamp);
      return 'Just now';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl h-full flex flex-col ${
      isBest 
        ? 'border-green-500 shadow-2xl shadow-green-500/30 ring-2 ring-green-500/20' 
        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b ${
        isBest 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700' 
          : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-gray-200 dark:border-gray-600'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              response.error ? 'bg-red-500' : 'bg-green-500'
            }`}></div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {model?.name || response.modelId}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {model?.provider}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {response.tokens && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                {response.tokens} tokens
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimestamp(response.timestamp)}
            </span>
            {response.content && !response.error && (
              <TextToSpeech text={response.content} />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {response.error ? (
          <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            <p className="font-medium">Error:</p>
            <p className="text-sm mt-1">{response.error}</p>
          </div>
        ) : response.content ? (
          <div className="prose prose-sm max-w-none dark:prose-invert flex-1">
            <div className="whitespace-pre-wrap text-gray-900 dark:text-white break-words max-h-80 overflow-auto rounded-md p-3 bg-gray-50 dark:bg-gray-700/40">
              {response.content}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 flex-1">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {response.content && !response.error && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-b-2xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={onMarkAsBest}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isBest
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 shadow-lg'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-600 dark:to-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-500 dark:hover:to-gray-600 shadow-md hover:shadow-lg'
              }`}
            >
              {isBest ? '✓ Best' : 'Mark Best'}
            </button>
            
            <button
              onClick={handleBookmark}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                bookmarked
                  ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-300 shadow-lg'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-600 dark:to-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-500 dark:hover:to-gray-600 shadow-md hover:shadow-lg'
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 rounded-lg text-sm font-semibold hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => onShare && onShare(response.modelId, response.content)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Share"
                aria-label="Share response"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4m0 0L8 6m4-4v12" />
                </svg>
              </button>
              <button
                onClick={() => onRefresh && onRefresh(response.modelId)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Refresh"
                aria-label="Refresh response"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-3m0-8a9 9 0 00-14 3" />
                </svg>
              </button>
              <button
                onClick={() => onSummary && onSummary(response.modelId, response.content)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Summary"
                aria-label="Show summary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
