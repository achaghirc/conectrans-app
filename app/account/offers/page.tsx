import CompanyOffersPage from '@/app/ui/account/offers/CompanyOffersPage';
import { a11yProps, CustomTabPanel } from '@/app/ui/shared/custom/components/tabPanel/CustomTabPanelComponent';
import { auth } from '@/auth';
import { Box, Tab, Tabs } from '@mui/material';
import React from 'react'

export default async function page() {
  const session = await auth();;

  return (
    <>
      <CompanyOffersPage session={session} />
    </>
  )
}
