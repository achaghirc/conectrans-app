import SignupCandidate from '@/app/ui/auth/candidate/SignupCandidate'
import { getCountries } from '@/lib/data/geolocate';
import React from 'react'

export default async function Page() {
  const countries = await getCountries();
  return (
    <>
      <SignupCandidate countries={countries ?? []} />
    </>
  
  )
}