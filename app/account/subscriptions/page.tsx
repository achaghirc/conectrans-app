import SubscriptionComponent from '@/app/ui/account/subscriptions/Subscription'
import SubscriptionsPlans from '@/app/ui/account/subscriptions/SubscriptionsPlans'
import SubscriptionMenuSkeleton from '@/app/ui/shared/custom/components/skeleton/SubscriptionMenuSkeleton'
import MobileNavScreen from '@/app/ui/shared/nav/MobileNavScreen'
import { auth } from '@/auth'
import { Box, Typography } from '@mui/material'
import React, { Suspense } from 'react'

export default async function page() {
  const session = await auth()

  return (
    <div>
      <Box component='div' sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%'}}>
        <Box sx={{ mt: {xs: 3, sm: 10}}}>
          <Typography variant="h3" component={"h1"} textAlign={'center'} fontWeight={'bold'}>
            Elige tu plan y maximiza tu rendimiento
          </Typography>
        </Box>
        <Box sx={{ mt: 1}}>
          <Typography variant="h6" component={"h2"} textAlign={'center'} color="text.secondary" fontWeight={'bold'}>
            Elige el plan que mejor se adapte a tus necesidades
          </Typography>
        </Box>
      </Box>
      <SubscriptionComponent session={session}/>
      
      <Box sx={{ mt: 3}}>
        <Typography variant="h6" component={"h2"} textAlign={'center'} color="text.secondary" fontWeight={'bold'}>
          ¿Dudas? <a href="mailto:aminechaghir1999@gmail.com">Contáctanos</a>
        </Typography>
      </Box>
    </div>
  )
}
