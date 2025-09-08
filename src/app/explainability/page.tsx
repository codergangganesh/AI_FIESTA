'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import {
  Brain,
  Eye,
  BarChart3,
  TrendingUp,
  Lightbulb,
  Target,
  Search,
  Download,
  RefreshCw,
  Info,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react'

interface FeatureImportance {
  feature: string
  importance: number
  shapValue: number
  description: string
}

interface ExplanationResult {
  prediction: string
  confidence: number
  topFeatures: FeatureImportance[]
  interpretation: string
  recommendations: string[]
}

interface ModelInterpretation {
  modelName: string
  globalExplanation: {
    topFeatures: FeatureImportance[]
    modelBehavior: string
  }
  localExplanations: ExplanationResult[]
}

export default function ExplainabilityPage() {
  const { darkMode } = useDarkMode()
  const [activeTab, setActiveTab] = useState('explain')
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [inputText, setInputText] = useState('')
  const [explanationResult, setExplanationResult] = useState<ExplanationResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [modelInterpretations, setModelInterpretations] = useState<ModelInterpretation[]>([])

  useEffect(() => {
    // Mock model interpretations
    const mockInterpretations: ModelInterpretation[] = [
      {
        modelName: 'GPT-4',
        globalExplanation: {
          topFeatures: [
            { feature: 'context_length', importance: 0.85, shapValue: 0.23, description: 'Length of input context' },
            { feature: 'semantic_complexity', importance: 0.72, shapValue: 0.18, description: 'Complexity of semantic content' },
            { feature: 'domain_specificity', importance: 0.68, shapValue: 0.15, description: 'How domain-specific the content is' },
            { feature: 'linguistic_style', importance: 0.55, shapValue: 0.12, description: 'Writing style and tone' }
          ],
          modelBehavior: 'GPT-4 shows strong sensitivity to context length and semantic complexity, performing best on well-structured, moderately complex inputs.'
        },
        localExplanations: []
      }
    ]
    setModelInterpretations(mockInterpretations)
  }, [])

  const analyzeInput = async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockResult: ExplanationResult = {
      prediction: 'Positive sentiment with technical focus',
      confidence: 0.89,
      topFeatures: [
        { feature: 'technical_terms', importance: 0.78, shapValue: 0.34, description: 'Presence of technical terminology' },
        { feature: 'positive_sentiment', importance: 0.65, shapValue: 0.28, description: 'Overall positive sentiment words' },
        { feature: 'question_structure', importance: 0.52, shapValue: 0.18, description: 'Structured question format' },
        { feature: 'context_clarity', importance: 0.48, shapValue: 0.15, description: 'Clarity of context provided' }
      ],
      interpretation: 'The model identified this as a technical query with positive sentiment. Key contributing factors include technical vocabulary usage and clear question structure.',
      recommendations: [
        'Consider adding more specific technical context for better results',
        'The positive framing helps with model engagement',
        'Question structure is optimal for this model type'
      ]
    }

    setExplanationResult(mockResult)
    setIsAnalyzing(false)
  }

  const tabs = [
    { id: 'explain', label: 'Local Explanations', icon: Lightbulb },
    { id: 'global', label: 'Global Interpretation', icon: Brain },
    { id: 'features', label: 'Feature Analysis', icon: BarChart3 },
    { id: 'insights', label: 'Model Insights', icon: Eye }
  ]

  const models = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <AdvancedSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300">
        {/* Header */}
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className={`text-3xl font-bold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Model Explainability
                </h1>
                <p className={`mt-1 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Understand how AI models make decisions with SHAP and LIME analysis
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className={`p-3 rounded-xl border transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {models.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
                
                <button className={`p-3 rounded-xl transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}>
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : darkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Local Explanations Tab */}
          {activeTab === 'explain' && (
            <div className="space-y-6">
              {/* Input Section */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h2 className={`text-xl font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Analyze Model Decision
                </h2>
                
                <div className="space-y-4">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to analyze how the model makes its decision..."
                    rows={4}
                    className={`w-full p-4 rounded-xl border resize-none transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  
                  <button
                    onClick={analyzeInput}
                    disabled={isAnalyzing || !inputText.trim()}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                  >
                    {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    <span>{isAnalyzing ? 'Analyzing...' : 'Explain Decision'}</span>
                  </button>
                </div>
              </div>

              {/* Results Section */}
              {explanationResult && (
                <div className="space-y-6">
                  {/* Prediction Summary */}
                  <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-800/60 border border-gray-700/50' 
                      : 'bg-white/80 border border-slate-200/50'
                  }`}>
                    <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Model Prediction
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          Prediction
                        </p>
                        <p className={`text-xl font-bold transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {explanationResult.prediction}
                        </p>
                      </div>
                      
                      <div>
                        <p className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          Confidence Score
                        </p>
                        <div className="flex items-center space-x-3">
                          <div className={`flex-1 rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                              style={{width: `${explanationResult.confidence * 100}%`}}
                            />
                          </div>
                          <span className={`text-xl font-bold transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {(explanationResult.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature Importance */}
                  <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-800/60 border border-gray-700/50' 
                      : 'bg-white/80 border border-slate-200/50'
                  }`}>
                    <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Feature Importance (SHAP Values)
                    </h3>
                    
                    <div className="space-y-4">
                      {explanationResult.topFeatures.map((feature, index) => (
                        <div key={feature.feature} className={`p-4 rounded-xl transition-colors duration-200 ${
                          darkMode ? 'bg-gray-700/50' : 'bg-slate-50'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className={`font-semibold transition-colors duration-200 ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {feature.feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </h4>
                              <p className={`text-sm transition-colors duration-200 ${
                                darkMode ? 'text-gray-400' : 'text-slate-600'
                              }`}>
                                {feature.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold transition-colors duration-200 ${
                                feature.shapValue > 0 
                                  ? darkMode ? 'text-green-400' : 'text-green-600'
                                  : darkMode ? 'text-red-400' : 'text-red-600'
                              }`}>
                                {feature.shapValue > 0 ? '+' : ''}{feature.shapValue.toFixed(3)}
                              </p>
                              <p className={`text-sm transition-colors duration-200 ${
                                darkMode ? 'text-gray-400' : 'text-slate-600'
                              }`}>
                                Importance: {(feature.importance * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          
                          <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                feature.shapValue > 0 
                                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                  : 'bg-gradient-to-r from-red-500 to-red-600'
                              }`}
                              style={{width: `${feature.importance * 100}%`}}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interpretation & Recommendations */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-800/60 border border-gray-700/50' 
                        : 'bg-white/80 border border-slate-200/50'
                    }`}>
                      <h3 className={`text-lg font-bold mb-4 flex items-center transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        <Brain className="w-5 h-5 mr-2 text-blue-600" />
                        Interpretation
                      </h3>
                      <p className={`transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        {explanationResult.interpretation}
                      </p>
                    </div>

                    <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-800/60 border border-gray-700/50' 
                        : 'bg-white/80 border border-slate-200/50'
                    }`}>
                      <h3 className={`text-lg font-bold mb-4 flex items-center transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                        Recommendations
                      </h3>
                      <div className="space-y-2">
                        {explanationResult.recommendations.map((rec, index) => (
                          <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                            darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                          }`}>
                            <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                            <p className={`text-sm transition-colors duration-200 ${
                              darkMode ? 'text-gray-300' : 'text-slate-700'
                            }`}>
                              {rec}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Global Interpretation Tab */}
          {activeTab === 'global' && modelInterpretations.length > 0 && (
            <div className="space-y-6">
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h2 className={`text-xl font-bold mb-6 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Global Model Behavior - {selectedModel.toUpperCase()}
                </h2>

                <div className={`p-4 rounded-xl mb-6 transition-colors duration-200 ${
                  darkMode ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <h3 className={`font-semibold mb-3 transition-colors duration-200 ${
                    darkMode ? 'text-blue-400' : 'text-blue-700'
                  }`}>
                    Model Behavior Summary
                  </h3>
                  <p className={`transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    {modelInterpretations[0].globalExplanation.modelBehavior}
                  </p>
                </div>

                {/* Global Feature Importance */}
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Most Influential Features Globally
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modelInterpretations[0].globalExplanation.topFeatures.map((feature, index) => (
                    <div key={feature.feature} className={`p-4 rounded-xl transition-colors duration-200 ${
                      darkMode ? 'bg-gray-700/50' : 'bg-slate-50'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`font-semibold transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {feature.feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold transition-colors duration-200 ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          #{index + 1}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-3 transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          Global Importance
                        </span>
                        <span className={`font-bold transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {(feature.importance * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{width: `${feature.importance * 100}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feature Analysis Tab */}
          {activeTab === 'features' && (
            <div className="text-center py-16">
              <BarChart3 className={`w-16 h-16 mx-auto mb-4 transition-colors duration-200 ${
                darkMode ? 'text-gray-500' : 'text-slate-400'
              }`} />
              <h3 className={`text-xl font-bold mb-2 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Feature Analysis Coming Soon
              </h3>
              <p className={`transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                Advanced feature interaction analysis and dependency mapping
              </p>
            </div>
          )}

          {/* Model Insights Tab */}
          {activeTab === 'insights' && (
            <div className="text-center py-16">
              <Eye className={`w-16 h-16 mx-auto mb-4 transition-colors duration-200 ${
                darkMode ? 'text-gray-500' : 'text-slate-400'
              }`} />
              <h3 className={`text-xl font-bold mb-2 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Model Insights Dashboard
              </h3>
              <p className={`transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                Comprehensive model behavior insights and bias detection
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}