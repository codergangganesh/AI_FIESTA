import { AIModel } from '@/types/app'

export const AI_MODELS: AIModel[] = [
  {
    id: 'nvidia/nemotron-nano-9b-v2',
    name: 'nvidia/nemotron-nano-9b-v2',
    displayName: 'Gemini 2.5',
    provider: 'Google',
    enabled: true,
    capabilities: ['text', 'image', 'video', 'audio'],
    speed: 'fast',
    cost: 'low',
    contextWindow: '2M tokens',
    description: 'Google\'s most advanced multimodal AI model with enhanced reasoning capabilities'
  },
  {
    id: 'z-ai/glm-4.5-air:free',
    name: 'z-ai/glm-4.5-air:free',
    displayName: 'Claude 4 Sonnet',
    provider: 'Anthropic',
    enabled: true,
    capabilities: ['text', 'document'],
    speed: 'fast',
    cost: 'low',
    contextWindow: '200K tokens',
    description: 'Balanced model for everyday tasks with strong reasoning and comprehension'
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'deepseek/deepseek-chat',
    displayName: 'DeepSeek',
    provider: 'DeepSeek',
    enabled: true,
    capabilities: ['text', 'code'],
    speed: 'medium',
    cost: 'very-low',
    contextWindow: '128K tokens',
    description: 'Cost-effective coding assistant with strong programming capabilities'
  },
  {
    id: 'openai/gpt-oss-20b:free',
    name: 'openai/gpt-oss-20b:free',
    displayName: 'GPT-5',
    provider: 'OpenAI',
    enabled: true,
    capabilities: ['text', 'image', 'audio'],
    speed: 'fast',
    cost: 'medium',
    contextWindow: '128K tokens',
    description: 'OpenAI\'s most capable model with improved reasoning and multimodal understanding'
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct',
    name: 'qwen/qwen-2.5-72b-instruct',
    displayName: 'Qwen 2.5',
    provider: 'Alibaba',
    enabled: true,
    capabilities: ['text', 'code', 'math'],
    speed: 'medium',
    cost: 'low',
    contextWindow: '128K tokens',
    description: 'Alibaba\'s powerful language model with strong math and coding abilities'
  },
  {
    id: 'nousresearch/deephermes-3-llama-3-8b-preview:free',
    name: 'nousresearch/deephermes-3-llama-3-8b-preview:free',
    displayName: 'Grok',
    provider: 'xAI',
    enabled: true,
    capabilities: ['text'],
    speed: 'medium',
    cost: 'high',
    contextWindow: '32K tokens',
    description: 'xAI\'s rebellious and witty model with real-time knowledge from X'
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'meta-llama/llama-3.3-70b-instruct',
    displayName: 'LLaMA 3.3',
    provider: 'Meta',
    enabled: true,
    capabilities: ['text', 'code'],
    speed: 'medium',
    cost: 'low',
    contextWindow: '128K tokens',
    description: 'Meta\'s open-source model with excellent instruction following and reasoning'
  },
  {
    id: 'cognitivecomputations/dolphin-mixtral-8x22b',
    name: 'cognitivecomputations/dolphin-mixtral-8x22b',
    displayName: 'Kimi 2',
    provider: 'Moonshot',
    enabled: true,
    capabilities: ['text', 'image', 'video'],
    speed: 'fast',
    cost: 'medium',
    contextWindow: '200K tokens',
    description: 'Moonshot\'s multimodal model with long context understanding'
  },
  {
    id: 'agentica-org/deepcoder-14b-preview:free',
    name: 'agentica-org/deepcoder-14b-preview:free',
    displayName: 'Shisa AI',
    provider: 'Augmxnt',
    enabled: true,
    capabilities: ['text'],
    speed: 'fast',
    cost: 'very-low',
    contextWindow: '8K tokens',
    description: 'Specialized model for Japanese and multilingual tasks'
  }
]

// Enhanced interface for better type safety
interface EnhancedAIModel extends AIModel {
  capabilities: string[]
  speed: 'very-fast' | 'fast' | 'medium' | 'slow'
  cost: 'very-low' | 'low' | 'medium' | 'high'
  contextWindow: string
  description: string
}

// Type guard to check if a model is enhanced
export const isEnhancedModel = (model: AIModel): model is EnhancedAIModel => {
  return 'capabilities' in model && 'speed' in model && 'cost' in model
}

export const getEnabledModels = (): AIModel[] => {
  return AI_MODELS.filter(model => model.enabled)
}

// Get models by provider
export const getModelsByProvider = (provider: string): AIModel[] => {
  return AI_MODELS.filter(model => model.provider === provider)
}

// Get all unique providers
export const getAllProviders = (): string[] => {
  return Array.from(new Set(AI_MODELS.map(model => model.provider)))
}