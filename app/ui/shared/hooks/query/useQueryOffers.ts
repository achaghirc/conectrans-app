'use client';
import { getAllOffersPageableByFilter } from '@/lib/data/offer';
import { FilterOffersDTO, OfferSearchResponse } from '@/lib/definitions';
import { useQuery, useQueryClient } from '@tanstack/react-query'

type UseQueryOffersProps = {
  currentPage: number;
  limit: number;
  initialFilterData: Partial<FilterOffersDTO>;
}

const useQueryOffers = ({currentPage, limit, initialFilterData}: UseQueryOffersProps) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['recomended_offers', initialFilterData, currentPage, limit],
    queryFn: (): Promise<OfferSearchResponse> => getAllOffersPageableByFilter(currentPage, limit, {active: true}),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });



}

export default useQueryOffers
