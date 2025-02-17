import SignupCandidate from '@/app/ui/auth/candidate/SignupCandidate'
import React from 'react'

interface PageProps {
  params: Promise<{
    redirect?: string;
  }>
}

export default async function Page({params}: PageProps) {
  const searchParams = await params;
  const { redirect }  = searchParams;

  return (
    <>
      <SignupCandidate redirect={redirect} />
    </>
  
  )
}