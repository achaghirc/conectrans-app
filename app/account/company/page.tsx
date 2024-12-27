import AccountCompany from '@/app/ui/account/company/AccountCompany'
import CompanyData from '@/app/ui/account/company/CompanyDataComponent'
import { auth } from '@/auth'
import { Box } from '@mui/material'
import React from 'react'

export default async function page() {
  const session = await auth()
  return (
    <div>
      <AccountCompany session={session}/>
    </div>
  )
}
