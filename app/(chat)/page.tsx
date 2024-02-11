import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { useLLMStore } from '@/store'

export default async function IndexPage() {
  const llmStateStore = useLLMStore.getState()
  const id = nanoid()
  const session = await auth()

  if (
    (llmStateStore.token && llmStateStore.provider) ||
    session?.user.email !== 'romainlembo06@gmail.com'
  ) {
    redirect(`/select-llm`)
  }

  return <Chat id={id} />
}
