'use client'

import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectItem } from '@/components/ui/select'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { SelectContent } from '@radix-ui/react-select'
import { redirect } from 'next/navigation'
import { useState } from 'react'

export default function SelectLLM() {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [token, setToken] = useState(previewToken ?? '')

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
          >
            <option value="chatgpt">OpenAI</option>
            <option value="mistral">Mistral</option>
          </select>
        </div>
        <Input
          value={token}
          placeholder="API key"
          onChange={e => setToken(e.target.value)}
        />
        <Button onClick={() => {}}>Save Token</Button>
      </div>
    </div>
  )
}
