import DriverProfilePage from '@/app/ui/account/driver-profile/DriverProfilePage'
import { auth } from '@/auth'
import React from 'react'

async function page() {
  const session = await auth()
  return (
    <div>
      <DriverProfilePage session={session} />
    </div>
  )
}

export default page
