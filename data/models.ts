import { AIModel } from '../types/models';

export const aiModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    version: 'GPT-4 Turbo',
    type: 'text',
    parameters: 175,
    contextLength: 128000,
    releaseDate: '2023-03-14',
    description: 'GPT-4 is OpenAI\'s most advanced language model, capable of understanding and generating human-like text across a wide range of topics.',
    pricing: {
      input: 0.01,
      output: 0.03,
      image: 0.0
    },
    performance: {
      accuracy: 95,
      speed: 1500,
      reasoning: 92,
      creativity: 88,
      safety: 85
    },
    capabilities: [
      'Advanced reasoning',
      'Code generation',
      'Creative writing',
      'Analysis and synthesis',
      'Multi-language support'
    ],
    limitations: [
      'Limited to training data cutoff',
      'No real-time information',
      'Potential for hallucinations'
    ],
    benchmarks: {
      'MMLU': 86.4,
      'HumanEval': 67.0,
      'GSM8K': 92.0
    }
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    provider: 'Anthropic',
    version: 'Opus',
    type: 'text',
    parameters: 200,
    contextLength: 200000,
    releaseDate: '2024-03-04',
    description: 'Claude 3 Opus is Anthropic\'s most powerful AI model, excelling at complex reasoning, analysis, and creative tasks.',
    pricing: {
      input: 0.015,
      output: 0.075,
      image: 0.0
    },
    performance: {
      accuracy: 94,
      speed: 1200,
      reasoning: 95,
      creativity: 90,
      safety: 90
    },
    capabilities: [
      'Superior reasoning',
      'Mathematical problem solving',
      'Code analysis',
      'Creative writing',
      'Safety-focused responses'
    ],
    limitations: [
      'Higher cost than alternatives',
      'Limited image generation',
      'Conservative approach'
    ],
    benchmarks: {
      'MMLU': 88.0,
      'HumanEval': 71.2,
      'GSM8K': 94.1
    }
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    version: '1.5',
    type: 'multimodal',
    parameters: 175,
    contextLength: 1000000,
    releaseDate: '2024-02-15',
    description: 'Gemini Pro is Google\'s most capable AI model, designed to handle text, images, and code with exceptional performance.',
    pricing: {
      input: 0.0025,
      output: 0.01,
      image: 0.0025
    },
    performance: {
      accuracy: 92,
      speed: 1800,
      reasoning: 89,
      creativity: 87,
      safety: 88
    },
    capabilities: [
      'Multimodal understanding',
      'Long context processing',
      'Code generation',
      'Image analysis',
      'Real-time information'
    ],
    limitations: [
      'Variable performance across modalities',
      'Limited reasoning depth',
      'Google ecosystem dependency'
    ],
    benchmarks: {
      'MMLU': 85.0,
      'HumanEval': 65.0,
      'GSM8K': 89.0
    }
  },
  {
    id: 'llama-3',
    name: 'Llama 3',
    provider: 'Meta',
    version: '70B',
    type: 'text',
    parameters: 70,
    contextLength: 8192,
    releaseDate: '2024-04-18',
    description: 'Llama 3 is Meta\'s open-source language model, offering strong performance with transparency and customization options.',
    pricing: {
      input: 0.0006,
      output: 0.0016,
      image: 0.0
    },
    performance: {
      accuracy: 88,
      speed: 2200,
      reasoning: 85,
      creativity: 82,
      safety: 80
    },
    capabilities: [
      'Open source',
      'Customizable',
      'Cost-effective',
      'Good code generation',
      'Community support'
    ],
    limitations: [
      'Smaller context window',
      'Lower accuracy than closed models',
      'Limited safety features'
    ],
    benchmarks: {
      'MMLU': 79.0,
      'HumanEval': 58.0,
      'GSM8K': 82.0
    }
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    version: '2.0',
    type: 'text',
    parameters: 32,
    contextLength: 32768,
    releaseDate: '2024-01-26',
    description: 'Mistral Large is a powerful language model that balances performance with efficiency, offering strong reasoning capabilities.',
    pricing: {
      input: 0.007,
      output: 0.024,
      image: 0.0
    },
    performance: {
      accuracy: 90,
      speed: 2500,
      reasoning: 88,
      creativity: 85,
      safety: 83
    },
    capabilities: [
      'Efficient reasoning',
      'Fast inference',
      'Good code generation',
      'Multilingual support',
      'Cost-effective'
    ],
    limitations: [
      'Smaller parameter count',
      'Limited context length',
      'Fewer capabilities than larger models'
    ],
    benchmarks: {
      'MMLU': 81.0,
      'HumanEval': 62.0,
      'GSM8K': 85.0
    }
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    version: '3.0',
    type: 'image',
    parameters: 12,
    contextLength: 4000,
    releaseDate: '2023-10-20',
    description: 'DALL-E 3 is OpenAI\'s advanced image generation model, capable of creating highly detailed and creative images from text descriptions.',
    pricing: {
      input: 0.0,
      output: 0.0,
      image: 0.04
    },
    performance: {
      accuracy: 89,
      speed: 15,
      reasoning: 85,
      creativity: 95,
      safety: 90
    },
    capabilities: [
      'High-quality image generation',
      'Creative artistic styles',
      'Text-to-image conversion',
      'Style consistency',
      'Safety filtering'
    ],
    limitations: [
      'Image generation only',
      'Limited text understanding',
      'No video generation'
    ],
    benchmarks: {
      'Image Quality': 89.0,
      'Prompt Adherence': 85.0,
      'Safety Score': 90.0
    }
  }
];