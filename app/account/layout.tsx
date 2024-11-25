import React from 'react'
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { auth } from '@/auth';
import Sidenav from '../ui/shared/nav/Sidenav';
import MobileNavScreen from '../ui/shared/nav/MobileNavScreen';

export default async function layout({children} : {children: React.ReactNode}) {
  const session = await auth();

  return (
    <>
      <Sidenav session={session}> 
        {children}
      </Sidenav>
      {/* <Grid container spacing={4} sx={{ display: 'flex', flexDirection: 'row'}}>
        <Grid sx={{ display: {xs: 'none', sm: 'flex'} }} size={{ xs: 0 }}>
        </Grid>
        <Grid size={{ xs: 12, md: 10 }}>
            {children}
        </Grid>
      </Grid> */}
    </>
  )
}
