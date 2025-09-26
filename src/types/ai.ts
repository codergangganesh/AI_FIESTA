export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
  maxTokens?: number;
  pricing?: {
    input: number;
    output: number;
  };
}

export interface AIResponse {
  modelId: string;
  content: string;
  timestamp: Date | string | number;
  tokens?: number;
  isBest?: boolean;
  error?: string;
}

export interface ComparisonRequest {
  prompt: string;
  selectedModels: string[];
}

export interface ComparisonResponse {
  responses: AIResponse[];
  requestId: string;
}
