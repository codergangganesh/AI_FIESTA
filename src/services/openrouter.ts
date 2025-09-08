import { OpenRouterResponse } from '@/types/app'

class OpenRouterService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || ''
    this.baseUrl = process.env.NEXT_PUBLIC_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1'
  }

  async sendMessage(model: string, message: string): Promise<OpenRouterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'AI Fiesta'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error sending message to OpenRouter:', error)
      throw error
    }
  }

  async sendMessageToMultipleModels(models: string[], message: string): Promise<Array<{
    model: string
    response: OpenRouterResponse | null
    error: string | null
  }>> {
    const promises = models.map(async (model) => {
      try {
        const response = await this.sendMessage(model, message)
        return {
          model,
          response,
          error: null
        }
      } catch (error) {
        return {
          model,
          response: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    return Promise.all(promises)
  }
}

export const openRouterService = new OpenRouterService()