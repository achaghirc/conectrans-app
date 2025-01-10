import Signup from '@/app/ui/auth/company/Signup';
import { getActitivies } from '@/lib/data/activity';
import { getCountries } from '@/lib/data/geolocate';
import React from 'react'

export default async function Page() {
  return (
    <>
      <Signup />
    </>
  )
}