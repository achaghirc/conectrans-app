import AccountPage from '@/app/ui/account/account-data/AccountPage'
import AccountUserComponent from '@/app/ui/account/account-data/AccountUserComponent'
import MobileNavScreen from '@/app/ui/shared/nav/MobileNavScreen'
import Navbar from '@/app/ui/shared/navbar'
import { auth } from '@/auth'
import { Box } from '@mui/material'
import { Session } from 'next-auth'
import React from 'react'

const Page = async () => {
    const session: Session | null = await auth()
    return (
      <div>
        {session && session.user.roleCode === 'USER' ?(
          <AccountUserComponent session={session} />
        ) : (
          <AccountPage session={session} />
        )
      }
      </div>
    )
  }
  
  export default Page