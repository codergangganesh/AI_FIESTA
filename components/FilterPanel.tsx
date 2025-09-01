import { useState } from 'react';
import { FilterOptions, AIModel } from '../types/models';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  models: AIModel[];
}

export default function FilterPanel({ filters, setFilters, models }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const providers = Array.from(new Set(models.map(m => m.provider))).sort();
  const types = Array.from(new Set(models.map(m => m.type))).sort();

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    setFilters({
      type: [],
      provider: [],
      minParameters: 0,
      maxParameters: 1000,
      minAccuracy: 0,
      maxCost: 1
    });
  };

  const hasActiveFilters = () => {
    return filters.type.length > 0 || 
           filters.provider.length > 0 || 
           filters.minParameters > 0 || 
           filters.maxParameters < 1000 || 
           filters.minAccuracy > 0 || 
           filters.maxCost < 1;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Active Filters Summary */}
          {hasActiveFilters() && (
            <div className="p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-800">Active Filters</span>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-primary-600 hover:text-primary-800"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.type.length > 0 && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    Type: {filters.type.join(', ')}
                  </span>
                )}
                {filters.provider.length > 0 && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    Provider: {filters.provider.join(', ')}
                  </span>
                )}
                {filters.minParameters > 0 && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    Min: {filters.minParameters}B params
                  </span>
                )}
                {filters.maxParameters < 1000 && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    Max: {filters.maxParameters}B params
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Model Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Type
            </label>
            <div className="space-y-2">
              {types.map(type => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.type.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateFilter('type', [...filters.type, type]);
                      } else {
                        updateFilter('type', filters.type.filter(t => t !== type));
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Provider Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider
            </label>
            <div className="space-y-2">
              {providers.map(provider => (
                <label key={provider} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.provider.includes(provider)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateFilter('provider', [...filters.provider, provider]);
                      } else {
                        updateFilter('provider', filters.provider.filter(p => p !== provider));
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{provider}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Parameters Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parameters (Billions)
            </label>
            <div className="space-y-3">
              <div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.minParameters}
                  onChange={(e) => updateFilter('minParameters', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Min: {filters.minParameters}B</span>
                </div>
              </div>
              <div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.maxParameters}
                  onChange={(e) => updateFilter('maxParameters', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Max: {filters.maxParameters}B</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accuracy Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Accuracy (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minAccuracy}
              onChange={(e) => updateFilter('minAccuracy', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>{filters.minAccuracy}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Cost Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Cost ($/1K tokens)
            </label>
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.001"
              value={filters.maxCost}
              onChange={(e) => updateFilter('maxCost', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>${(filters.maxCost * 1000).toFixed(2)}</span>
              <span>$0.10</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}