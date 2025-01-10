import { Metadata } from "next";
import { CssBaseline } from "@mui/material";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCountries } from "@/lib/data/geolocate";
import { getActitivies } from "@/lib/data/activity";
import { getEncoderTypeData } from "@/lib/data/encoderType";

export const metadata:Metadata = {
    title: 'Login',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ['countries'], 
    queryFn: async () => getCountries(),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  queryClient.prefetchQuery({
    queryKey: ['encoders'],
    queryFn: () => getEncoderTypeData(),
    staleTime: 1000 * 60 * 60 * 24 // 1 day
  });

  queryClient.prefetchQuery({
    queryKey: ['activities'],
    queryFn: () => getActitivies(),
    staleTime: 1000 * 60 * 60 * 24 // 1 day
  });

  const dehydratedState = dehydrate(queryClient);

  return (
		<HydrationBoundary state={dehydratedState}>
			<CssBaseline />
			{children}
		</HydrationBoundary>
	);
}