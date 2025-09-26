import { NextRequest, NextResponse } from 'next/server';
import { callMultipleModels } from '@/lib/openrouter';
import { ComparisonRequest, ComparisonResponse } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    console.log('Compare API called');
    
    const body: ComparisonRequest = await request.json();
    console.log('Request body:', body);
    
    const { prompt, selectedModels } = body;

    if (!prompt || !selectedModels || selectedModels.length === 0) {
      console.error('Missing required fields:', { prompt: !!prompt, selectedModels: selectedModels?.length });
      return NextResponse.json(
        { error: 'Prompt and selected models are required' },
        { status: 400 }
      );
    }

    if (selectedModels.length > 8) {
      console.error('Too many models selected:', selectedModels.length);
      return NextResponse.json(
        { error: 'Maximum 8 models can be compared at once' },
        { status: 400 }
      );
    }

    console.log(`Calling ${selectedModels.length} models:`, selectedModels);
    const responses = await callMultipleModels(selectedModels, prompt);
    console.log('Received responses:', responses.length);
    
    const comparisonResponse: ComparisonResponse = {
      responses,
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    console.log('Returning comparison response');
    return NextResponse.json(comparisonResponse);
  } catch (error) {
    console.error('Error in compare API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
