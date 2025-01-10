import React from 'react'
import { auth } from '@/auth';
import Sidenav from '../ui/shared/nav/Sidenav';
import { Session } from 'next-auth';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCountries } from '@/lib/data/geolocate';
import { getEncoderTypeData } from '@/lib/data/encoderType';
import DriverProfilePreFetchService from '@/lib/services/prefetch/DriverProfilePrefetchService';

export default async function layout({children} : {children: React.ReactNode}) {
  const session: Session | null = await auth();
  if (!session) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    return null;
  }

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({ 
    queryKey: ['countries'], queryFn: () => getCountries(), 
    staleTime: 1000 * 60 * 60 * 24 // 24 hours
  });
  queryClient.prefetchQuery({ 
    queryKey: ['encoders'], 
    queryFn: () => getEncoderTypeData(),
    staleTime: 1000 * 60 * 60 * 24 // 24 hours
  });

  const driverProfilePrefectch = new DriverProfilePreFetchService(queryClient);
  await driverProfilePrefectch.prefetchDriverProfileData(session.user.id);
  
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <Sidenav session={session}> 
        {children}
      </Sidenav>
    </HydrationBoundary>
  )
}
