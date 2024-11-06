import React from 'react'
import SideNav from '../ui/shared/nav/SideNav'
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { auth } from '@/auth';

export default async function layout({children} : {children: React.ReactNode}) {
	const session = await auth();
  return (
    <Grid container spacing={4} sx={{ display: 'flex', flexDirection: 'row'}}>
      <Grid size={{ xs: 0, sm: 2 }}>
        <SideNav session={session}/>
    	</Grid>
      <Grid size={{ xs: 12, sm: 10 }}>
					{children}
      </Grid>
		</Grid>
  )
}
