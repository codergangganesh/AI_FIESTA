import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/services/database'

export async function POST(request: NextRequest) {
  try {
    console.log('📝 API Route: POST /api/conversations called')
    
    const requestBody = await request.json()
    console.log('📝 Request body:', {
      messageLength: requestBody.message?.length || 0,
      responsesCount: requestBody.responses?.length || 0,
      bestResponseModel: requestBody.bestResponseModel
    })
    
    const { message, responses, bestResponseModel } = requestBody

    if (!message || !responses) {
      console.error('❌ Missing required fields:', { hasMessage: !!message, hasResponses: !!responses })
      return NextResponse.json(
        { error: 'Message and responses are required' },
        { status: 400 }
      )
    }

    console.log('📝 Calling databaseService.saveConversation...')
    const conversationId = await databaseService.saveConversation(
      message,
      responses,
      bestResponseModel
    )
    console.log('📝 Database save result:', { conversationId })

    if (!conversationId) {
      console.error('❌ Failed to save conversation - no ID returned')
      return NextResponse.json(
        { error: 'Failed to save conversation' },
        { status: 500 }
      )
    }

    console.log('✅ Conversation saved successfully:', { conversationId })
    return NextResponse.json({ conversationId })
  } catch (error) {
    console.error('❌ Error in conversations API:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('📝 API Route: GET /api/conversations called')
    
    const conversations = await databaseService.getConversations()
    console.log('📝 Retrieved conversations:', { count: conversations.length })
    
    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('❌ Error fetching conversations:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Add DELETE method to delete all conversations for a user
export async function DELETE() {
  try {
    console.log('📝 API Route: DELETE /api/conversations called')
    
    const success = await databaseService.deleteAllConversations()
    console.log('📝 Delete all conversations result:', { success })
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete conversations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'History deleted successfully' })
  } catch (error) {
    console.error('❌ Error deleting all conversations:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
