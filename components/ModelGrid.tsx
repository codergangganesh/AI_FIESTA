import { AIModel } from '../types/models';
import { Check, Brain, Zap, DollarSign, Target, Calendar, Code } from 'lucide-react';

interface ModelGridProps {
  models: AIModel[];
  selectedModels: string[];
  onModelSelect: (modelId: string) => void;
}

export default function ModelGrid({ models, selectedModels, onModelSelect }: ModelGridProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Brain className="h-4 w-4" />;
      case 'image':
        return <Target className="h-4 w-4" />;
      case 'multimodal':
        return <Code className="h-4 w-4" />;
      case 'code':
        return <Code className="h-4 w-4" />;
      case 'audio':
        return <Zap className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'bg-blue-100 text-blue-800';
      case 'image':
        return 'bg-purple-100 text-purple-800';
      case 'multimodal':
        return 'bg-green-100 text-green-800';
      case 'code':
        return 'bg-orange-100 text-orange-800';
      case 'audio':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {models.map((model) => (
        <div
          key={model.id}
          className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedModels.includes(model.id)
              ? 'ring-2 ring-primary-500 bg-primary-50'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onModelSelect(model.id)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(model.type)}`}>
                  <div className="flex items-center space-x-1">
                    {getTypeIcon(model.type)}
                    <span className="capitalize">{model.type}</span>
                  </div>
                </span>
                {selectedModels.includes(model.id) && (
                  <div className="p-1 bg-primary-500 rounded-full">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{model.name}</h3>
              <p className="text-sm text-gray-600">{model.provider}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{model.description}</p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{model.parameters}B</div>
              <div className="text-xs text-gray-500">Parameters</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{model.performance.accuracy}%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
          </div>

          {/* Performance Bars */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Speed</span>
              <span className="font-medium">{model.performance.speed} t/s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(model.performance.speed / 3000) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Reasoning</span>
              <span className="font-medium">{model.performance.reasoning}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${model.performance.reasoning}%` }}
              ></div>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>Input: ${(model.pricing.input * 1000).toFixed(2)}/1K</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>Output: ${(model.pricing.output * 1000).toFixed(2)}/1K</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(model.releaseDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Code className="h-3 w-3" />
              <span>{model.contextLength.toLocaleString()} tokens</span>
            </div>
          </div>

          {/* Capabilities Preview */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-1">
              {model.capabilities.slice(0, 3).map((capability, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {capability}
                </span>
              ))}
              {model.capabilities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  +{model.capabilities.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}