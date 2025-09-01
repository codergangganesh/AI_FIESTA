'use client';

import { useState, useEffect } from 'react';
import { aiModels } from '../data/models';
import { AIModel, FilterOptions } from '../types/models';
import Header from '../components/Header';
import ModelGrid from '../components/ModelGrid';
import ComparisonTool from '../components/ComparisonTool';
import FilterPanel from '../components/FilterPanel';
import StatsOverview from '../components/StatsOverview';

export default function Home() {
  const [models, setModels] = useState<AIModel[]>(aiModels);
  const [filteredModels, setFilteredModels] = useState<AIModel[]>(aiModels);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    type: [],
    provider: [],
    minParameters: 0,
    maxParameters: 1000,
    minAccuracy: 0,
    maxCost: 1
  });

  useEffect(() => {
    applyFilters();
  }, [filters, models]);

  const applyFilters = () => {
    let filtered = models.filter(model => {
      if (filters.type.length > 0 && !filters.type.includes(model.type)) {
        return false;
      }
      if (filters.provider.length > 0 && !filters.provider.includes(model.provider)) {
        return false;
      }
      if (model.parameters < filters.minParameters || model.parameters > filters.maxParameters) {
        return false;
      }
      if (model.performance.accuracy < filters.minAccuracy) {
        return false;
      }
      if (model.pricing.input > filters.maxCost || model.pricing.output > filters.maxCost) {
        return false;
      }
      return true;
    });
    setFilteredModels(filtered);
  };

  const handleModelSelection = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const clearSelection = () => {
    setSelectedModels([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <StatsOverview models={filteredModels} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel 
              filters={filters} 
              setFilters={setFilters}
              models={models}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Model Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  AI Models ({filteredModels.length})
                </h2>
                {selectedModels.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="btn-secondary text-sm"
                  >
                    Clear Selection ({selectedModels.length})
                  </button>
                )}
              </div>
              <ModelGrid 
                models={filteredModels}
                selectedModels={selectedModels}
                onModelSelect={handleModelSelection}
              />
            </div>
            
            {/* Comparison Tool */}
            {selectedModels.length >= 2 && (
              <ComparisonTool 
                models={models.filter(m => selectedModels.includes(m.id))}
                onClear={clearSelection}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}