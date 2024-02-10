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
  const [previewTokenDialog, setPreviewTokenDialog] = useState(true)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  return (
    <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your API Key</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <label
            htmlFor="select"
            className="block text-sm font-medium text-gray-700"
          >
            Select LLM:
          </label>
          <select
            id="select"
            name="select"
            className="mt-1 block w-full p-2 border rounded-md"
          >
            <option value="chatgpt">OpenAI</option>
            <option value="mistral">Mistral</option>
          </select>
        </div>
        <Input
          value={previewTokenInput}
          placeholder="API key"
          onChange={e => setPreviewTokenInput(e.target.value)}
        />
        <DialogFooter className="items-center">
          <Button
            onClick={() => {
              setPreviewToken(previewTokenInput)
              setPreviewTokenDialog(false)
            }}
          >
            Save Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
