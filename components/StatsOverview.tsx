import { AIModel } from '../types/models';
import { TrendingUp, Zap, DollarSign, Target } from 'lucide-react';

interface StatsOverviewProps {
  models: AIModel[];
}

export default function StatsOverview({ models }: StatsOverviewProps) {
  const stats = {
    totalModels: models.length,
    avgAccuracy: models.reduce((sum, m) => sum + m.performance.accuracy, 0) / models.length,
    avgSpeed: models.reduce((sum, m) => sum + m.performance.speed, 0) / models.length,
    avgCost: models.reduce((sum, m) => sum + (m.pricing.input + m.pricing.output) / 2, 0) / models.length,
    totalParameters: models.reduce((sum, m) => sum + m.parameters, 0),
    providers: new Set(models.map(m => m.provider)).size,
    types: new Set(models.map(m => m.type)).size
  };

  const statCards = [
    {
      title: 'Total Models',
      value: stats.totalModels,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Avg Accuracy',
      value: `${stats.avgAccuracy.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avg Speed',
      value: `${Math.round(stats.avgSpeed)} t/s`,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg Cost',
      value: `$${(stats.avgCost * 1000).toFixed(2)}/1K`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          AI Model Landscape
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore and compare the latest AI models across performance, cost, and capabilities. 
          Make informed decisions for your AI applications.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Parameters</h3>
          <p className="text-3xl font-bold text-primary-600">
            {Math.round(stats.totalParameters / 1000)}B+
          </p>
          <p className="text-sm text-gray-600">Combined model capacity</p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Providers</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.providers}</p>
          <p className="text-sm text-gray-600">AI companies represented</p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Model Types</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.types}</p>
          <p className="text-sm text-gray-600">Different AI capabilities</p>
        </div>
      </div>
    </div>
  );
}