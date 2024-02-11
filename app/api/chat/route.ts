import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import MistralClient, {
  ChatCompletionResponseChunk
} from '@mistralai/mistralai'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { ChatCompletionChunk, Completion } from 'openai/resources'
import { APIPromise } from 'openai/core'
import { Stream } from 'openai/streaming'
import { useLLMStore } from '@/store'

export const runtime = 'edge'

// For Mistral : https://sdk.vercel.ai/docs/guides/providers/mistral
// Note: There are no types for the Mistral API client yet.
// @ts-ignore
// const mistralClient = new MistralClient(process.env.MISTRAL_API_KEY || '')

// SOON DEPRECATED
// const openaiClient = new OpenAI({  apiKey: process.env.OPENAI_API_KEY )

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user.id) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const json = await req.json()
  const { messages } = json

  const {
    user: { id: userId, email }
  } = session

  let aiClient: OpenAI | MistralClient
  let resProvider:
    | Response
    | AsyncIterable<ChatCompletionChunk | Completion>
    | APIPromise<Stream<ChatCompletionChunk>>
    | AsyncGenerator<ChatCompletionResponseChunk, void, unknown>

  if (email !== 'romainlembo06@gmail.com') {
    const llmStore = useLLMStore()

    console.log('!!!!!!!!!!', llmStore)

    if (llmStore?.token) {
      if (llmStore.provider === 'openai') {
        aiClient = new OpenAI({ apiKey: llmStore.token })
        resProvider = await aiClient.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages,
          temperature: 0.7,
          stream: true
        })
      } else {
        aiClient = new MistralClient(process.env.MISTRAL_API_KEY || '')
        resProvider = await aiClient.chatStream({
          model: 'mistral-tiny',
          stream: true,
          max_tokens: 1000,
          messages
        })
      }
    }
  } else {
    //aiClient = new MistralClient(process.env.MISTRAL_API_KEY || '')
    aiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    resProvider = await aiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      stream: true
    })
  }

  const stream = OpenAIStream(resProvider, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  return new StreamingTextResponse(stream)
}
