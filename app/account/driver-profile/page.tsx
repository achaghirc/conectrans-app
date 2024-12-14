import DriverProfilePage from '@/app/ui/account/driver-profile/DriverProfilePage'
import { auth } from '@/auth'
import { getDriverLicenceByUserId } from '@/lib/data/driver-licence';
import { getDriverProfileData } from '@/lib/data/driver-profile';
import { Box } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import React from 'react'

async function getServerSideProps() {
  const session = await auth();
  return {
    props: { session }
  }
}

async function page() {
  const { props: { session} } = await getServerSideProps();
  return (
    <Box component={'div'}>
      <DriverProfilePage session={session} />
    </Box>
  )
}

export default page
