'use client';

import { useState } from 'react';
import { AIModel } from '@/types/ai';

interface ModelPreferencesProps {
  selectedModels: string[];
  onModelsChange: (models: string[]) => void;
}

const availableModels: AIModel[] = [
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Most capable GPT-4 model with vision capabilities',
    maxTokens: 128000,
    pricing: { input: 0.005, output: 0.015 }
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Faster, cheaper alternative to GPT-4o',
    maxTokens: 128000,
    pricing: { input: 0.00015, output: 0.0006 }
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    provider: 'Google',
    description: 'Google\'s most advanced AI model',
    maxTokens: 2000000,
    pricing: { input: 0.00125, output: 0.005 }
  },
  {
    id: 'anthropic/claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced performance and speed',
    maxTokens: 200000,
    pricing: { input: 0.003, output: 0.015 }
  },
  {
    id: 'anthropic/claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    description: 'Fastest and most cost-effective Claude model',
    maxTokens: 200000,
    pricing: { input: 0.0008, output: 0.004 }
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    description: 'High-quality reasoning at low cost',
    maxTokens: 32000,
    pricing: { input: 0.00014, output: 0.00028 }
  },
  {
    id: 'meta-llama/llama-3.1-405b-instruct',
    name: 'Llama 3.1 405B',
    provider: 'Meta',
    description: 'Open-source model with strong performance',
    maxTokens: 128000,
    pricing: { input: 0.0027, output: 0.0027 }
  },
  {
    id: 'mistralai/mistral-7b-instruct',
    name: 'Mistral 7B',
    provider: 'Mistral AI',
    description: 'Efficient and capable small model',
    maxTokens: 32000,
    pricing: { input: 0.0002, output: 0.0002 }
  }
];

export default function ModelPreferences({ selectedModels, onModelsChange }: ModelPreferencesProps) {
  const [preferences, setPreferences] = useState({
    maxModels: 8,
    autoSelect: false,
    costOptimization: false,
    speedOptimization: false,
    qualityOptimization: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState('all');

  const handleModelToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onModelsChange(selectedModels.filter(id => id !== modelId));
    } else {
      if (selectedModels.length < preferences.maxModels) {
        onModelsChange([...selectedModels, modelId]);
      }
    }
  };

  const handlePreferenceChange = (key: string, value: boolean | number) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredModels = availableModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = filterProvider === 'all' || model.provider.toLowerCase() === filterProvider.toLowerCase();
    return matchesSearch && matchesProvider;
  });

  const providers = ['all', ...Array.from(new Set(availableModels.map(m => m.provider)))];

  const handleSavePreferences = () => {
    // Here you would typically save to your backend
    console.log('Saving model preferences:', { selectedModels, preferences });
    // Show success message
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Model Preferences</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Choose your default AI models and comparison settings
        </p>
      </div>

      {/* General Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">General Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Models per Comparison
            </label>
            <select
              value={preferences.maxModels}
              onChange={(e) => handlePreferenceChange('maxModels', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={4}>4 models</option>
              <option value={6}>6 models</option>
              <option value={8}>8 models</option>
              <option value={12}>12 models</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Auto-select Models</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Automatically select models based on your preferences</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.autoSelect}
                onChange={(e) => handlePreferenceChange('autoSelect', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Optimization Strategy</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="optimization"
                checked={preferences.costOptimization}
                onChange={() => setPreferences(prev => ({ ...prev, costOptimization: true, speedOptimization: false, qualityOptimization: false }))}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Cost Optimization - Choose the most cost-effective models</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="optimization"
                checked={preferences.speedOptimization}
                onChange={() => setPreferences(prev => ({ ...prev, costOptimization: false, speedOptimization: true, qualityOptimization: false }))}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Speed Optimization - Choose the fastest models</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="optimization"
                checked={preferences.qualityOptimization}
                onChange={() => setPreferences(prev => ({ ...prev, costOptimization: false, speedOptimization: false, qualityOptimization: true }))}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Quality Optimization - Choose the highest quality models</span>
            </label>
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available Models</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedModels.length} of {preferences.maxModels} selected
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {providers.map(provider => (
              <option key={provider} value={provider}>
                {provider === 'all' ? 'All Providers' : provider}
              </option>
            ))}
          </select>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedModels.includes(model.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              onClick={() => handleModelToggle(model.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(model.id)}
                    onChange={() => handleModelToggle(model.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{model.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{model.provider}</p>
                  </div>
                </div>
                {model.pricing && (
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    <div>${model.pricing.input}/1K input</div>
                    <div>${model.pricing.output}/1K output</div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{model.description}</p>
              {model.maxTokens && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Max tokens: {model.maxTokens.toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onModelsChange(['openai/gpt-4o', 'google/gemini-pro-1.5', 'anthropic/claude-3-5-sonnet-20241022'])}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
          >
            Select Top 3
          </button>
          <button
            onClick={() => onModelsChange(['openai/gpt-4o-mini', 'deepseek/deepseek-chat', 'mistralai/mistral-7b-instruct'])}
            className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
          >
            Select Budget Models
          </button>
          <button
            onClick={() => onModelsChange([])}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSavePreferences}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Save Model Preferences
        </button>
      </div>
    </div>
  );
}
