import SubscriptionComponent from '@/app/ui/account/subscriptions/Subscription'
import { auth } from '@/auth'
import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page() {
  const session = await auth()
  return (
    <SubscriptionComponent session={session}/>
  )
}
