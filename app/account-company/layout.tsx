import React from 'react'
import { auth } from '@/auth';
import { Session } from 'next-auth';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getOffersByUserId } from '@/lib/data/offer';
import { getCountries } from '@/lib/data/geolocate';
import { getEncoderTypeData } from '@/lib/data/encoderType';
import Sidenav from '../ui/shared/nav/SideNav';

const queryClient = new QueryClient();
export default async function layout({children} : {children: React.ReactNode}) {
  const session: Session | null = await auth();
  if (!session) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    return null;
  }

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['offers', session.user.id], 
      queryFn: async () => getOffersByUserId(session.user.id)
    }),
    queryClient.prefetchQuery({ 
      queryKey: ['countries'], queryFn: () => getCountries() 
    }),
    queryClient.prefetchQuery({ 
      queryKey: ['encoders'], 
      queryFn: () => getEncoderTypeData() 
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <Sidenav session={session}> 
        {children}
      </Sidenav>
    </HydrationBoundary>
  )
}
