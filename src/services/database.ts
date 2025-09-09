import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'
import { Conversation, AIResponse } from '@/types/app'

type Tables = Database['public']['Tables']

class DatabaseService {
  async saveConversation(
    message: string, 
    responses: Array<{ model: string; content: string; success: boolean }>,
    bestResponseModel?: string
  ): Promise<string | null> {
    try {
      console.log('🔧 DatabaseService.saveConversation called with:', { message: message.substring(0, 50) + '...', responsesCount: responses.length, bestResponseModel })
      
      const supabase = await createClient()
      console.log('🔧 Supabase client created')
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log('🔧 User authentication check:', { user: user ? { id: user.id, email: user.email } : null, userError })
      
      if (!user) {
        console.error('❌ User not authenticated - no user found')
        throw new Error('User not authenticated')
      }

      // Create conversation
      const conversationData = {
        user_id: user.id,
        title: this.generateTitle(message),
        message: message
      }
      console.log('🔧 Inserting conversation:', conversationData)
      
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single()

      if (conversationError) {
        console.error('❌ Conversation insert error:', conversationError)
        throw conversationError
      }
      console.log('✅ Conversation created successfully:', { id: conversation.id, title: conversation.title })

      // Save AI responses
      const aiResponses = responses
        .filter(r => r.success && r.content)
        .map(response => ({
          conversation_id: conversation.id,
          model_name: response.model,
          response: response.content,
          is_best_response: response.model === bestResponseModel
        }))

      console.log('🔧 AI responses to insert:', { count: aiResponses.length, models: aiResponses.map(r => r.model_name) })

      if (aiResponses.length > 0) {
        const { error: responseError } = await supabase
          .from('ai_responses')
          .insert(aiResponses)

        if (responseError) {
          console.error('❌ AI responses insert error:', responseError)
          throw responseError
        }
        console.log('✅ AI responses saved successfully')
      }

      console.log('✅ Conversation saved successfully with ID:', conversation.id)
      return conversation.id
    } catch (error) {
      console.error('❌ Error saving conversation:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      return null
    }
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      console.log('🔧 DatabaseService.getConversations called')
      
      const supabase = await createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log('🔧 User check for getConversations:', { user: user ? { id: user.id, email: user.email } : null, userError })
      
      if (!user) {
        console.log('❌ No user found, returning empty array')
        return []
      }

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          ai_responses (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching conversations:', error)
        throw error
      }
      
      console.log('✅ Fetched conversations:', { count: data?.length || 0 })

      return data.map(conv => ({
        id: conv.id,
        userId: conv.user_id,
        title: conv.title,
        message: conv.message,
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
        responses: conv.ai_responses.map((resp: any) => ({
          id: resp.id,
          conversationId: resp.conversation_id,
          modelName: resp.model_name,
          response: resp.response,
          isBestResponse: resp.is_best_response,
          createdAt: resp.created_at
        }))
      }))
    } catch (error) {
      console.error('❌ Error fetching conversations:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
      return []
    }
  }

  async getConversation(id: string): Promise<Conversation | null> {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          ai_responses (*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        message: data.message,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        responses: data.ai_responses.map((resp: { id: string; conversation_id: string; model_name: string; response: string; is_best_response: boolean; created_at: string }) => ({
          id: resp.id,
          conversationId: resp.conversation_id,
          modelName: resp.model_name,
          response: resp.response,
          isBestResponse: resp.is_best_response,
          createdAt: resp.created_at
        }))
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
      return null
    }
  }

  async deleteConversation(id: string): Promise<boolean> {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting conversation:', error)
      return false
    }
  }

  async updateBestResponse(conversationId: string, responseId: string): Promise<boolean> {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      // First, remove best response from all responses in this conversation
      await supabase
        .from('ai_responses')
        .update({ is_best_response: false })
        .eq('conversation_id', conversationId)

      // Then set the selected response as best
      const { error } = await supabase
        .from('ai_responses')
        .update({ is_best_response: true })
        .eq('id', responseId)
        .eq('conversation_id', conversationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating best response:', error)
      return false
    }
  }

  private generateTitle(message: string): string {
    // Generate a title from the first few words of the message
    const words = message.trim().split(' ').slice(0, 6)
    let title = words.join(' ')
    
    if (message.trim().split(' ').length > 6) {
      title += '...'
    }
    
    return title || 'New Conversation'
  }
}

export const databaseService = new DatabaseService()