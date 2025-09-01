export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  type: 'text' | 'image' | 'multimodal' | 'code' | 'audio';
  parameters: number; // in billions
  contextLength: number; // in tokens
  releaseDate: string;
  description: string;
  pricing: {
    input: number; // per 1K tokens
    output: number; // per 1K tokens
    image: number; // per image
  };
  performance: {
    accuracy: number; // 0-100
    speed: number; // tokens per second
    reasoning: number; // 0-100
    creativity: number; // 0-100
    safety: number; // 0-100
  };
  capabilities: string[];
  limitations: string[];
  benchmarks: {
    [key: string]: number;
  };
  imageUrl?: string;
}

export interface ComparisonMetric {
  name: string;
  value: number;
  unit: string;
  weight: number; // 0-1 for weighted comparisons
}

export interface ComparisonResult {
  model1: string;
  model2: string;
  metrics: ComparisonMetric[];
  overallScore: number;
  winner: string;
}

export interface FilterOptions {
  type: string[];
  provider: string[];
  minParameters: number;
  maxParameters: number;
  minAccuracy: number;
  maxCost: number;
}