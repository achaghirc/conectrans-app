import AccountDataComponent from '@/app/ui/account/AccountDataComponent'
import AccountCompany from '@/app/ui/account/company/AccountCompany'
import AccountUserComponent from '@/app/ui/account/user/AccountUserComponent'
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
        <AccountUserComponent session={session} />
      </div>
    )
  }
  
  export default Page