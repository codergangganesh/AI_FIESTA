import { AVAILABLE_MODELS } from '@/lib/models';

type OverlayModel = {
  id: string;
  displayName: string;
  provider: string;
  description?: string;
  capabilities?: string[];
  speed?: 'Slow' | 'Medium' | 'Fast';
  cost?: 'Low' | 'Medium' | 'High';
  contextWindow?: string;
};

// Map existing AVAILABLE_MODELS into the richer structure expected by landing overlay
export const AI_MODELS: OverlayModel[] = AVAILABLE_MODELS.map((m) => ({
  id: m.id,
  displayName: m.name,
  provider: m.provider,
  description: m.description,
  capabilities: ['Chat', 'Reasoning', 'Code'].slice(0, 3),
  speed: 'Fast',
  cost: 'Medium',
  contextWindow: m.maxTokens ? `${m.maxTokens.toLocaleString()} tokens` : undefined,
}));


