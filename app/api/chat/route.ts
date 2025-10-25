import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { messages, user_id } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    let userContext = ''
    
    // If user_id is provided, fetch their recent reports and appointments
    if (user_id && supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      try {
        // Fetch user's recent reports with summaries
        const { data: reports } = await supabase
          .from('files')
          .select(`
            file_name,
            uploaded_at,
            report_summaries (
              summary_text,
              processing_status
            )
          `)
          .eq('user_id', user_id)
          .order('uploaded_at', { ascending: false })
          .limit(5)

        // Fetch user's appointments
        const { data: appointments } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user_id)
          .order('date', { ascending: true })
          .limit(5)

        // Build context string
        if (reports && reports.length > 0) {
          userContext += '\n\nUser\'s Recent Medical Reports:\n'
          reports.forEach((report: any) => {
            userContext += `- ${report.file_name} (uploaded ${new Date(report.uploaded_at).toLocaleDateString()})\n`
            const summary = report.report_summaries?.[0]
            if (summary?.processing_status === 'completed' && summary.summary_text) {
              userContext += `  Summary: ${summary.summary_text.substring(0, 200)}...\n`
            }
          })
        }

        if (appointments && appointments.length > 0) {
          userContext += '\n\nUser\'s Upcoming Appointments:\n'
          appointments.forEach((apt: any) => {
            userContext += `- ${apt.doctor_name || 'Doctor'} (${apt.specialty || 'General'}) on ${new Date(apt.date).toLocaleDateString()} at ${apt.time}\n`
            if (apt.notes) {
              userContext += `  Notes: ${apt.notes}\n`
            }
          })
        }
      } catch (error) {
        console.error('Error fetching user context:', error)
        // Continue without context if there's an error
      }
    }

    // Get API key
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Determine API endpoint
    const isOpenRouter = apiKey.startsWith('sk-or-v1-')
    const apiEndpoint = isOpenRouter 
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'
    
    const modelName = isOpenRouter ? 'openai/gpt-4o' : 'gpt-4o'

    // Build system message with context
    const systemMessage: Message = {
      role: 'system',
      content: `You are Nirogya AI, a helpful medical assistant for the Nirogya healthcare platform. You help users understand their medical reports, manage appointments, and answer general health questions.

Key capabilities:
- Explain medical reports and lab results in simple terms
- Help users understand their health metrics
- Provide information about upcoming appointments
- Answer general health and wellness questions
- Offer guidance on when to seek medical attention

Important guidelines:
- Always be empathetic and supportive
- Explain medical terms in layman's language
- Never provide definitive diagnoses - encourage users to consult their healthcare provider
- Be clear that you're an AI assistant, not a replacement for professional medical advice
- If asked about specific medications or treatments, always recommend consulting with their doctor

${userContext}

Remember to be conversational, friendly, and helpful while maintaining medical accuracy and appropriate boundaries.`
    }

    // Prepare messages for API
    const apiMessages = [systemMessage, ...messages]

    // Call OpenRouter/OpenAI API
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }
    
    if (isOpenRouter) {
      headers['HTTP-Referer'] = 'https://nirogya.app'
      headers['X-Title'] = 'Nirogya Medical Assistant'
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: modelName,
        messages: apiMessages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error:', errorText)
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      )
    }

    const result = await response.json()
    const assistantMessage = result?.choices?.[0]?.message?.content

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: assistantMessage,
      success: true,
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
