export interface AIModel {
  id: string
  name: string
  displayName: string
  provider: string
  enabled: boolean
  capabilities?: string[]
  speed?: 'very-fast' | 'fast' | 'medium' | 'slow'
  cost?: 'very-low' | 'low' | 'medium' | 'high'
  contextWindow?: string
  description?: string
}

export interface ChatMessage {
  id: string
  content: string
  timestamp: string
  conversationId?: string
}

export interface AIResponse {
  id: string
  conversationId: string
  modelName: string
  response: string
  isBestResponse: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  userId: string
  title: string
  message: string
  createdAt: string
  updatedAt: string
  responseTime?: number
  responses?: AIResponse[]
}

export interface OpenRouterResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}