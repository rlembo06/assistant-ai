import { create } from 'zustand'

type Provider = 'openai' | 'mistral'

export type LLMState = {
  provider: Provider
  setProvider: (provider: Provider) => void
  setToken: (token: string) => void
  setLLM: ({ provider, token }: { provider: Provider; token: string }) => void
  token: string
}

const useLLMStore = create<LLMState>(set => ({
  provider: 'openai',
  setProvider: (provider: Provider) => set({ provider }),
  setToken: (token: string) => set({ token }),
  setLLM: ({ provider, token }: { provider: Provider; token: string }) =>
    set({ provider, token }),
  token: ''
}))

export default useLLMStore
