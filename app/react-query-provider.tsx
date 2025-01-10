'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react';

export const ReactQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(new QueryClient(
    {
      defaultOptions: {
        queries: {
          staleTime: 60 * 5000, // 10 minutes
        },
      }
    }
  ));
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}