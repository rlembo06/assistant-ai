'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLLMStore } from '@/store'
import { redirect } from 'next/navigation'
import { useState } from 'react'

export default function SelectLLM() {
  const llmStore = useLLMStore()

  const [provider, setProvider] = useState(llmStore.provider || 'openai')
  const [token, setToken] = useState(llmStore.token || '')
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)

  const onSubmit = () => {
    const tokenValidation = token.length > 0
    setIsValidToken(tokenValidation)

    if (tokenValidation) {
      llmStore.setLLM({ provider, token })
      redirect('/chat')
    }
  }

  return (
    <div className="flex items-center justify-center h-96">
      <div className="bg-background rounded-md border min-w-80 shadow p-4 flex flex-col gap-4">
        <div>
          <label
            htmlFor="select"
            className="block text-sm font-medium text-gray-700"
          >
            Select LLM:
          </label>
          <select
            id="select"
            name="select"
            className="mt-1 block w-full p-2 border rounded-md bg-background"
            value={provider}
            onChange={e => setProvider(e.target.value)}
          >
            <option value="openai">OpenAI</option>
            <option value="mistral">Mistral</option>
          </select>
        </div>
        <Input
          value={token}
          placeholder="API key"
          onChange={e => setToken(e.target.value)}
          validation={{
            active: !isValidToken,
            message: 'API key is required'
          }}
        />
        <Button onClick={onSubmit}>Save Token</Button>
      </div>
    </div>
  )
}
