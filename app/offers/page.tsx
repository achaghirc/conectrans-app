import Footer from "../ui/home/footer";
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import OffersGeneralListComponent from "../ui/offers/OffersGeneralComponent";
import { Box } from "@mui/material";
import { getNumberFromSearchParam } from "@/lib/utils";
import { FilterOffersDTO, OfferSearchResponse } from "@/lib/definitions";
import { getAllOffersPageableByFilter } from "@/lib/data/offer";
import { getCountries } from "@/lib/data/geolocate";
import { getEncoderTypeData } from "@/lib/data/encoderType";

interface PageProps {
  searchParams: Promise<{
    page: string;
    limit: string;
    licenseType: string;
  }>
}

const queryClient = new QueryClient();
const initialFilterData: Partial<FilterOffersDTO> = {
  allOffers: true,
  active: true,
}
async function page({ searchParams } : PageProps ) {
  const params = await searchParams;
  const page = await getNumberFromSearchParam(params.page, 1);
  const limit = await getNumberFromSearchParam(params.limit, 10);
  const licenseType: string[] = params.licenseType ? params.licenseType.split(',') : [];
  initialFilterData.licenseType = licenseType;

  await Promise.all([
    await queryClient.prefetchQuery({
      queryKey: ['offers', initialFilterData, page, limit], 
      queryFn: (): Promise<OfferSearchResponse> => getAllOffersPageableByFilter(Number(page), Number(limit), initialFilterData),
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 24 hours
    }),
    await queryClient.prefetchQuery({
        queryKey: ['recomended_offers', page, limit],
        queryFn: (): Promise<OfferSearchResponse> => getAllOffersPageableByFilter(page, limit, {allOffers: true, active: true}),
        staleTime: 1000 * 60 * 5, // 5 minutes
    }),
    await queryClient.prefetchQuery({
      queryKey: ['countries'],
      queryFn: () => getCountries(),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    }),
    await queryClient.prefetchQuery({
      queryKey: ['encoders'],
      queryFn: () => getEncoderTypeData(),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    })
  ])

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
        <OffersGeneralListComponent currentPage={Number(page)} limit={Number(limit)} initialFilterData={initialFilterData} />
      </HydrationBoundary>
      <Footer />
    </Box>
  );
}
export default page;


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