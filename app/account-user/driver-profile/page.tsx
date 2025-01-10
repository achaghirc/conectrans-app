import DriverProfilePage from '@/app/ui/account/driver-profile/DriverProfilePage'
import { auth } from '@/auth'
import { Box } from '@mui/material';
import React from 'react'

async function page() {
  const session = await auth();
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }  

  return (  
    <Box component={'div'}>
      <DriverProfilePage session={session} />
    </Box>
  )
}

export default page
