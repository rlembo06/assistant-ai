import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function IndexPage() {
  const id = nanoid()
  const session = await auth()

  // TODO: check if LLM and API Key are present
  if (session?.user.email !== 'romainlembo06@gmail.com') {
    redirect(`/select-llm`)
  }

  return <Chat id={id} />
}
