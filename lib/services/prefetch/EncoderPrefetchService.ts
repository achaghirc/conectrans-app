import { getCountries, getProvincesByCountryId } from "@/lib/data/geolocate";
import { QueryClient } from "@tanstack/react-query";


class EncoderPrefetchService  {
  
  queryClient:QueryClient;
  
  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  public prefetchEncoders() {
    const queryClient = this.queryClient;
    if (this.queryClient.getQueryCache().find({queryKey: ['countries']})) {
      return;
    }
    this.queryClient.prefetchQuery({
      queryKey: ['countries'],
      queryFn: () => getCountries(),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
  }

  public prefetchProvincesSpain() {
    const queryClient = this.queryClient;
    const spainId = 64;
    if (this.queryClient.getQueryCache().find({queryKey: ['provinces', spainId]})) {
      return;
    }
    this.queryClient.prefetchQuery({
      queryKey: ['provinces', spainId],
      queryFn: () => getProvincesByCountryId(spainId),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
  }

}

export default EncoderPrefetchService;