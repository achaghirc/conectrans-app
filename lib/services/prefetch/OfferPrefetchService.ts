import { getOffersByUserId } from "@/lib/data/offer";
import { QueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";

class OfferPrefetchService {

  queryClient:QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }
  public prefetchOffersByUser(userId: string) {
    const queryClient = this.queryClient;
    if (this.queryClient.getQueryCache().find({queryKey: ['offers', userId]})) {
      return;
    }
    this.queryClient.prefetchQuery({
      queryKey: ['offers', userId],
      queryFn: () => getOffersByUserId(userId),
    });
    console.log('prefetching', queryClient.getQueryCache().find({queryKey: ['offers', userId]}));
  }
}

export default OfferPrefetchService;

