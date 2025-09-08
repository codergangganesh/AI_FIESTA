import { NextRequest, NextResponse } from 'next/server'
import { openRouterService } from '@/services/openrouter'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { message, models } = await request.json()

    if (!message || !models || !Array.isArray(models)) {
      return NextResponse.json(
        { error: 'Message and models array are required' },
        { status: 400 }
      )
    }

    // Verify user is authenticated
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Send message to multiple AI models
    const results = await openRouterService.sendMessageToMultipleModels(models, message)

    // Process results to extract content
    const responses = results.map(result => ({
      model: result.model,
      content: result.response?.choices?.[0]?.message?.content || '',
      error: result.error,
      success: result.response !== null
    }))

    return NextResponse.json({ responses })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}