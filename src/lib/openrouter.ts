import { AIResponse } from '@/types/ai';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function callOpenRouter(
  modelId: string,
  prompt: string,
  maxTokens: number = 4000
): Promise<AIResponse> {
  console.log(`Calling OpenRouter for model: ${modelId}`);
  
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key not configured');
    return {
      modelId,
      content: '',
      timestamp: new Date(Date.now()),
      error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment variables.',
    };
  }

  const request: OpenRouterRequest = {
    model: modelId,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
  };

  try {
    console.log(`Making request to OpenRouter for ${modelId}...`);
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'AI Fiesta - Model Comparison',
      },
      body: JSON.stringify(request),
    });

    console.log(`OpenRouter response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`OpenRouter API error: ${response.status} - ${errorData}`);
      return {
        modelId,
        content: '',
        timestamp: new Date(Date.now()),
        error: `API Error (${response.status}): ${errorData}`,
      };
    }

    const data: OpenRouterResponse = await response.json();
    console.log(`OpenRouter response for ${modelId}:`, data);

    if (!data.choices || data.choices.length === 0) {
      console.error(`No choices in response for ${modelId}:`, data);
      return {
        modelId,
        content: '',
        timestamp: new Date(Date.now()),
        error: 'No response choices from model',
      };
    }

    const content = data.choices[0].message.content;
    console.log(`Successfully got response for ${modelId}, length: ${content.length}`);

    return {
      modelId,
      content,
      timestamp: new Date(Date.now()),
      tokens: data.usage?.total_tokens,
    };
  } catch (error) {
    console.error(`Error calling ${modelId}:`, error);
    return {
      modelId,
      content: '',
      timestamp: new Date(Date.now()),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function callMultipleModels(
  modelIds: string[],
  prompt: string
): Promise<AIResponse[]> {
  const promises = modelIds.map(modelId => callOpenRouter(modelId, prompt));
  return Promise.all(promises);
}
