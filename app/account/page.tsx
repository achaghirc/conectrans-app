import { auth } from '@/auth'
import { Session } from 'next-auth'
import React from 'react'
import Account from '../ui/account/Account'

const Page = async () => {
  const session: Session | null = await auth()
  return (
    <div>
      <Account session={session} />
    </div>
  )
}

export default Page