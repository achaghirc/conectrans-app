import CompanyOffersPage from '@/app/ui/account/offers/CompanyOffersPage';
import { auth } from '@/auth';
import { getOffersByUserPageable } from '@/lib/data/offer';
import { getNumberFromSearchParam } from '@/lib/utils';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import React from 'react'

interface PageProps {
  params: Promise<{
    page: string;
    limit: string;
  }>
}

const queryClient = new QueryClient();

export default async function OffersRoutePage({params}: PageProps) {
  const session: Session | null = await auth();
  if (!session) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    return null;
  }
  const searchParams = await params;
  const page = await getNumberFromSearchParam(searchParams.page, 1);
  const limit = await getNumberFromSearchParam(searchParams.limit, 10);
  
  await Promise.all([
    await queryClient.prefetchQuery({
      queryKey: ['offers_active', { userId: session?.user.id, active: true }, page, limit],
      queryFn: () => getOffersByUserPageable(page, limit, { userId: session?.user.id, active: true }),
      staleTime: 1000 * 60 * 10 // 10 minutes
    }),
    await queryClient.prefetchQuery({
      queryKey: ['offers_historical', { userId: session?.user.id, active: true }, page, limit],
          queryFn: () => getOffersByUserPageable( page, limit, { userId: session?.user.id, active: false }),
      staleTime: 1000 * 60 * 10 // 10 minutes
    })
  ]);

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <CompanyOffersPage session={session} page={page} limit={limit}/>
    </HydrationBoundary>   
  )
}
