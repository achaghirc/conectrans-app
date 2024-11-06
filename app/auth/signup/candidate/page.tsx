import SignupCandidate from '@/app/ui/auth/candidate/SignupCandidate'
import { getEncoderTypeData } from '@/lib/data/encoderType';
import { getCountries } from '@/lib/data/geolocate';
import React from 'react'

export default async function Page() {
  const countries = await getCountries();
  const encoders = await getEncoderTypeData();
  return (
    <>
      <SignupCandidate countries={countries ?? []} encoders={encoders ?? []} />
    </>
  
  )
}