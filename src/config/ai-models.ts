import { AIModel } from '@/types/app'

export const AI_MODELS: AIModel[] = [
  {
    id: 'google/gemini-2.5',
    name: 'google/gemini-2.5',
    displayName: 'Gemini 2.5',
    provider: 'Google',
    enabled: true
  },
  {
    id: 'anthropic/claude-4-sonnet',
    name: 'anthropic/claude-4-sonnet',
    displayName: 'Claude 4 Sonnet',
    provider: 'Anthropic',
    enabled: true
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'deepseek/deepseek-chat',
    displayName: 'DeepSeek',
    provider: 'DeepSeek',
    enabled: true
  },
  {
    id: 'openai/gpt-5',
    name: 'openai/gpt-5',
    displayName: 'GPT-5',
    provider: 'OpenAI',
    enabled: true
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct',
    name: 'qwen/qwen-2.5-72b-instruct',
    displayName: 'Qwen 2.5',
    provider: 'Alibaba',
    enabled: true
  },
  {
    id: 'x-ai/grok-beta',
    name: 'x-ai/grok-beta',
    displayName: 'Grok',
    provider: 'xAI',
    enabled: true
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'meta-llama/llama-3.3-70b-instruct',
    displayName: 'LLaMA 3.3',
    provider: 'Meta',
    enabled: true
  },
  {
    id: 'moonshot/moonshot-v1-8k',
    name: 'moonshot/moonshot-v1-8k',
    displayName: 'Kimi 2',
    provider: 'Moonshot',
    enabled: true
  },
  {
    id: 'augmxnt/shisa-gamma-7b-v1',
    name: 'augmxnt/shisa-gamma-7b-v1',
    displayName: 'Shisa AI',
    provider: 'Augmxnt',
    enabled: true
  }
]

export const getEnabledModels = (): AIModel[] => {
  return AI_MODELS.filter(model => model.enabled)
}