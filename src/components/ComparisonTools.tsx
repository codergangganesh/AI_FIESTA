'use client';

import { useState } from 'react';
import { AIResponse } from '@/types/ai';

interface ComparisonToolsProps {
  responses: AIResponse[];
  onRateResponse: (modelId: string, rating: number) => void;
  onHighlightDifferences: () => void;
  onExportComparison: () => void;
}

export default function ComparisonTools({ 
  responses, 
  onRateResponse, 
  onHighlightDifferences, 
  onExportComparison 
}: ComparisonToolsProps) {
  const [showTools, setShowTools] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [highlightMode, setHighlightMode] = useState(false);

  const handleRate = (modelId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [modelId]: rating }));
    onRateResponse(modelId, rating);
  };

  const handleHighlightToggle = () => {
    setHighlightMode(!highlightMode);
    onHighlightDifferences();
  };

  const getRatingStars = (modelId: string) => {
    const rating = ratings[modelId] || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={() => handleRate(modelId, i + 1)}
        className={`w-5 h-5 transition-colors ${
          i < rating
            ? 'text-yellow-400 hover:text-yellow-500'
            : 'text-gray-300 hover:text-yellow-400'
        }`}
      >
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ));
  };

  const getAverageRating = () => {
    const values = Object.values(ratings);
    return values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '0.0';
  };

  const getWordCount = (content: string) => {
    return content.trim().split(/\s+/).length;
  };

  const getCharacterCount = (content: string) => {
    return content.length;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comparison Tools</h3>
        <button
          onClick={() => setShowTools(!showTools)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        >
          {showTools ? 'Hide Tools' : 'Show Tools'}
        </button>
      </div>

      {showTools && (
        <div className="space-y-6">
          {/* Rating System */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Rate Responses</h4>
            <div className="space-y-3">
              {responses.map((response) => (
                <div key={response.modelId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {response.modelId}
                    </span>
                    <div className="flex items-center gap-1">
                      {getRatingStars(response.modelId)}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({ratings[response.modelId] || 0}/5)
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {getWordCount(response.content)} words
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Average Rating: {getAverageRating()}/5
            </div>
          </div>

          {/* Analysis Tools */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Analysis Tools</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleHighlightToggle}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  highlightMode
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                {highlightMode ? 'Hide Differences' : 'Highlight Differences'}
              </button>

              <button
                onClick={onExportComparison}
                className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Comparison
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Response Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Responses</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{responses.length}</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Average Length</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(responses.reduce((acc, r) => acc + getWordCount(r.content), 0) / responses.length)} words
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Average Rating</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{getAverageRating()}/5</div>
              </div>
            </div>
          </div>

          {/* Detailed Comparison */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Detailed Comparison</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-2 text-gray-500 dark:text-gray-400">Model</th>
                    <th className="text-left py-2 text-gray-500 dark:text-gray-400">Words</th>
                    <th className="text-left py-2 text-gray-500 dark:text-gray-400">Characters</th>
                    <th className="text-left py-2 text-gray-500 dark:text-gray-400">Rating</th>
                    <th className="text-left py-2 text-gray-500 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => (
                    <tr key={response.modelId} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 font-medium text-gray-900 dark:text-white">{response.modelId}</td>
                      <td className="py-2 text-gray-600 dark:text-gray-400">{getWordCount(response.content)}</td>
                      <td className="py-2 text-gray-600 dark:text-gray-400">{getCharacterCount(response.content)}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-1">
                          {getRatingStars(response.modelId)}
                        </div>
                      </td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded-full">
                          Complete
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
