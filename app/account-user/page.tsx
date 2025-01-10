import { auth } from '@/auth'
import { Session } from 'next-auth'
import React from 'react'
import Navbar from '../ui/shared/navbar'
import { Box } from '@mui/material'
import AccountMobileMenu from '../ui/account/user/mobile/AccountMobileMenu'


const Page = async () => {
  const session: Session | null = await auth()
  return (
    <div>
      <Box component={'div'} sx={{ display: {xs: 'none', sm: 'flex'}}}>
        <Navbar session={session} />
      </Box>
      <Box sx={{ display: {xs: 'block', sm: 'none'} }}>
        <AccountMobileMenu session={session} />
      </Box>
    </div>
  )
}

export default Page