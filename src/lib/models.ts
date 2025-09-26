import { AIModel } from '@/types/ai';

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Most capable GPT-4 model with vision capabilities',
    maxTokens: 128000,
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Faster, cheaper GPT-4 model',
    maxTokens: 128000,
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Most capable Claude model with excellent reasoning',
    maxTokens: 200000,
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Fast and efficient Claude model',
    maxTokens: 200000,
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    provider: 'Google',
    description: 'Google\'s most capable model with large context',
    maxTokens: 2000000,
  },
  {
    id: 'meta-llama/llama-3.1-405b-instruct',
    name: 'Llama 3.1 405B',
    provider: 'Meta',
    description: 'Meta\'s largest open-source model',
    maxTokens: 131072,
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    description: 'High-performance reasoning model',
    maxTokens: 32768,
  },
  {
    id: 'mistralai/mistral-7b-instruct',
    name: 'Mistral 7B',
    provider: 'Mistral AI',
    description: 'Efficient and capable 7B parameter model',
    maxTokens: 32768,
  },
  {
    id: 'cohere/command-r-plus',
    name: 'Command R+',
    provider: 'Cohere',
    description: 'Retrieval-optimized model for tool use and RAG',
    maxTokens: 128000,
  },
  {
    id: 'openai/gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    provider: 'OpenAI',
    description: 'Lightweight GPT-4.1 variant optimized for speed',
    maxTokens: 128000,
  },
  {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    provider: 'Google',
    description: 'Fast Gemini for near real-time responses',
    maxTokens: 1000000,
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    provider: 'Meta',
    description: 'Balanced open model with strong instruction following',
    maxTokens: 131072,
  },
  {
    id: 'qwen/qwen2.5-72b-instruct',
    name: 'Qwen2.5 72B',
    provider: 'Alibaba',
    description: 'Strong multilingual and coding performance',
    maxTokens: 131072,
  },
];

export const getModelById = (id: string): AIModel | undefined => {
  return AVAILABLE_MODELS.find(model => model.id === id);
};

export const getModelsByIds = (ids: string[]): AIModel[] => {
  return ids.map(id => getModelById(id)).filter(Boolean) as AIModel[];
};
