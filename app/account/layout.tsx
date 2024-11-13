import React from 'react'
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { auth } from '@/auth';
import Sidenav from '../ui/shared/nav/Sidenav';

export default async function layout({children} : {children: React.ReactNode}) {
	const session = await auth();
  return (
    <Grid container spacing={4} sx={{ display: 'flex', flexDirection: 'row'}}>
      <Grid size={{ xs: 0, sm: 2 }}>
        <Sidenav session={session}/>
    	</Grid>
      <Grid size={{ xs: 12, sm: 10 }}>
					{children}
      </Grid>
		</Grid>
  )
}
