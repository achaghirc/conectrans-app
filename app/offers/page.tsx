import { auth } from "@/auth";
import Navbar from "../ui/shared/navbar";
import Footer from "../ui/home/footer";
import { dehydrate, DehydratedState, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import OffersGeneralListComponent, { FilterOffersDTO } from "../ui/offers/OffersGeneralComponent";
import { Session } from "next-auth";
import { getOfferById } from "@/lib/data/offer";
import { Box } from "@mui/material";

const queryClient = new QueryClient();

export default async function Page({
  paramsUrl,
  searchParams, 
} : {
  paramsUrl: {id: string},
  searchParams?: {
    query?: string,
    page?: string,
    limit?: string,
  }
}) {
  const params = await searchParams || {};
  const query = params.query || '';
  const page = params.page || '1';
  const limit = params.limit || '10';
  
  const dehydratedState = dehydrate(queryClient);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
      }}
    >

      <HydrationBoundary state={dehydratedState}>
        <OffersGeneralListComponent currentPage={Number(page)} limit={Number(limit)} totalPages={Number(limit)} />
      </HydrationBoundary>
      <Footer />
    </Box>
  );
}


// const searchp = await searchParams;
// if(searchp == undefined) {
//   return <div>loading...</div>
// }
// const query = searchp.query || '';
// let currentPage = 1;
// let limit = 10;
// if(Number(searchp.page) != undefined) {
//   currentPage = Number(searchp.page);
// }
// if (Number(searchp.limit) !== undefined) {
//   limit = Number(searchp.limit);
// }

// const queryClient = new QueryClient();

// const totalPages = await getOffersPage(query)


  // queryClient.prefetchInfiniteQuery({
  //   queryHash: ['offers', query, currentPage, limit],
  //   queryKeyHashFn: (query) => query.join('-'),
    
  //   queryKey: ['offers', query, currentPage, limit], 
  //   queryFn: () => getAllOffersPageable(currentPage, limit),
  //   staleTime: 1000 * 60 * 5, // 5 minutes
  //   gcTime: 1000 * 60 * 60, // 24 hours
  //   getNextPageParam: (lastPage: any, pages:any) => {
  //     if (lastPage.length < limit) {
  //       return undefined;
  //     }
  //     return pages.length + 1;
  //   },
  //   pages: 10
  // });
  // queryClient.prefetchQuery({
  //   queryKey: ['totalOffers', query], queryFn: () => getOffersPage(query),
  //   staleTime: 1000 * 60 * 5, // 5 minutes
  //   gcTime: 1000 * 60 * 60, // 24 hours
  // });
  
  // queryClient.prefetchQuery({
  //   queryKey: ['countries'], queryFn: () => getCountries(),
  //   staleTime: 1000 * 60 * 60 * 24, // 24 hours
  // });

  // queryClient.prefetchQuery({
  //   queryKey: ['encoders'], queryFn: () => getEncoderTypeData(),
  //   staleTime: 1000 * 60 * 60 * 24, // 24 hours
  // });

  // const dehydratedState = dehydrate(queryClient);