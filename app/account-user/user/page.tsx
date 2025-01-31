import AccountUserComponent from '@/app/ui/account/user/AccountUserComponent'
import { auth } from '@/auth'
import { Session } from 'next-auth'
import React from 'react'

const Page = async () => {
    const session: Session | null = await auth()
    return (
      <div>
        <AccountUserComponent session={session} />
      </div>
    )
  }
  
  export default Page