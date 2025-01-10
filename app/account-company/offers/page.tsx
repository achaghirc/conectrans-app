import CompanyOffersPage from '@/app/ui/account/offers/CompanyOffersPage';
import { auth } from '@/auth';
import { Session } from 'next-auth';
import React from 'react'

export default async function OffersRoutePage() {
  const session: Session | null = await auth();
  if (!session) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }
  return (
    <CompanyOffersPage session={session} />
  )
}
