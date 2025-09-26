'use client';

import { useState } from 'react';
import { AVAILABLE_MODELS } from '@/lib/models';
import { AIModel } from '@/types/ai';

interface ModelSelectorProps {
  selectedModels: string[];
  onSelectionChange: (selectedModels: string[]) => void;
}

export default function ModelSelector({ selectedModels, onSelectionChange }: ModelSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleModelToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onSelectionChange(selectedModels.filter(id => id !== modelId));
    } else {
      if (selectedModels.length < 8) {
        onSelectionChange([...selectedModels, modelId]);
      }
    }
  };

  const selectedModelsData = selectedModels.map(id => 
    AVAILABLE_MODELS.find(model => model.id === id)
  ).filter(Boolean) as AIModel[];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Select AI Models
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {isExpanded ? 'Collapse' : 'Expand'} ({selectedModels.length}/8)
        </button>
      </div>

      {/* Selected Models Display */}
      {selectedModelsData.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {selectedModelsData.map((model) => (
              <div
                key={model.id}
                className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
              >
                <span className="font-medium">{model.name}</span>
                <button
                  onClick={() => handleModelToggle(model.id)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model Selection Grid (horizontal scroll on mobile) */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-x-auto">
          {AVAILABLE_MODELS.map((model) => {
            const isSelected = selectedModels.includes(model.id);
            const isDisabled = !isSelected && selectedModels.length >= 8;
            
            return (
              <label
                key={model.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : isDisabled
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 cursor-not-allowed opacity-50'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleModelToggle(model.id)}
                  disabled={isDisabled}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {model.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      {model.provider}
                    </span>
                  </div>
                  {model.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {model.description}
                    </p>
                  )}
                  {model.maxTokens && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Max tokens: {model.maxTokens.toLocaleString()}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}

      {selectedModels.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Select at least one model to compare responses.
        </p>
      )}
    </div>
  );
}
