import { AIModel } from '../types/models';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { X, TrendingUp, Zap, DollarSign, Target, Brain } from 'lucide-react';

interface ComparisonToolProps {
  models: AIModel[];
  onClear: () => void;
}

export default function ComparisonTool({ models, onClear }: ComparisonToolProps) {
  if (models.length < 2) return null;

  // Prepare data for charts
  const performanceData = models.map(model => ({
    name: model.name,
    accuracy: model.performance.accuracy,
    speed: model.performance.speed / 100, // Normalize for chart
    reasoning: model.performance.reasoning,
    creativity: model.performance.creativity,
    safety: model.performance.safety,
  }));

  const pricingData = models.map(model => ({
    name: model.name,
    input: model.pricing.input * 1000, // Convert to $/1K tokens
    output: model.pricing.output * 1000,
  }));

  const radarData = models.map(model => [
    { metric: 'Accuracy', value: model.performance.accuracy, fullMark: 100 },
    { metric: 'Speed', value: model.performance.speed / 30, fullMark: 100 }, // Normalize
    { metric: 'Reasoning', value: model.performance.reasoning, fullMark: 100 },
    { metric: 'Creativity', value: model.performance.creativity, fullMark: 100 },
    { metric: 'Safety', value: model.performance.safety, fullMark: 100 },
  ]);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Model Comparison ({models.length} models)
        </h2>
        <button
          onClick={onClear}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Clear Selection</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Performance Comparison Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Performance Metrics</span>
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="accuracy" fill="#10b981" name="Accuracy (%)" />
                <Bar dataKey="speed" fill="#3b82f6" name="Speed (normalized)" />
                <Bar dataKey="reasoning" fill="#f59e0b" name="Reasoning (%)" />
                <Bar dataKey="creativity" fill="#8b5cf6" name="Creativity (%)" />
                <Bar dataKey="safety" fill="#ef4444" name="Safety (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pricing Comparison */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Pricing Comparison</span>
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pricingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Cost per 1K tokens']} />
                <Legend />
                <Bar dataKey="input" fill="#3b82f6" name="Input Cost" />
                <Bar dataKey="output" fill="#10b981" name="Output Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Charts for Individual Models */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Performance Radar Charts</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map((model, index) => (
              <div key={model.id} className="card">
                <h4 className="text-center font-semibold text-gray-900 mb-4">{model.name}</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData[index]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name={model.name}
                        dataKey="value"
                        stroke={colors[index % colors.length]}
                        fill={colors[index % colors.length]}
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>Detailed Metrics</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  {models.map(model => (
                    <th key={model.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {model.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Parameters</td>
                  {models.map(model => (
                    <td key={model.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {model.parameters}B
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Context Length</td>
                  {models.map(model => (
                    <td key={model.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {model.contextLength.toLocaleString()} tokens
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Accuracy</td>
                  {models.map(model => (
                    <td key={model.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {model.performance.accuracy}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Speed</td>
                  {models.map(model => (
                    <td key={model.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {model.performance.speed} t/s
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Input Cost</td>
                  {models.map(model => (
                    <td key={model.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(model.pricing.input * 1000).toFixed(2)}/1K
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Output Cost</td>
                  {models.map(model => (
                    <td key={model.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(model.pricing.output * 1000).toFixed(2)}/1K
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Capabilities Comparison */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Capabilities & Limitations</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map(model => (
              <div key={model.id} className="card">
                <h4 className="font-semibold text-gray-900 mb-3">{model.name}</h4>
                
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-green-700 mb-2">Capabilities</h5>
                  <div className="flex flex-wrap gap-1">
                    {model.capabilities.map((capability, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-red-700 mb-2">Limitations</h5>
                  <div className="flex flex-wrap gap-1">
                    {model.limitations.map((limitation, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                      >
                        {limitation}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}