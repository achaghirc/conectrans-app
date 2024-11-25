import CompanyData from '@/app/ui/account/company-data/CompanyData'
import MobileNavScreen from '@/app/ui/shared/nav/MobileNavScreen'
import { auth } from '@/auth'
import { Box } from '@mui/material'
import React from 'react'

export default async function page() {
  const session = await auth()
  return (
    <div>
      <CompanyData session={session}/>
    </div>
  )
}
