import UsersOffersPage from "@/app/ui/account/offers/UsersOffersPage";
import { auth } from "@/auth";
import { getApplicationCountByPersonId, getApplicationOffersPageableByFilter } from "@/lib/data/applicationOffers";
import { getNumberFromSearchParam } from "@/lib/utils";
import { ApplicationOfferDTO } from "@prisma/client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";

interface PageProps {
  params: Promise<{
    page: string;
    limit: string;
  }>
}

const queryClient = new QueryClient();
async function page({ params } : PageProps) {
  const searchParams = await params;
  const page = await getNumberFromSearchParam(searchParams.page, 1);
  const limit = await getNumberFromSearchParam(searchParams.limit, 10);

  const session : Session | null = await auth();
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }
  const personId = session?.user.personId ?? 0;
  await queryClient.prefetchQuery({
    queryKey: ['applications_offers', session?.user.personId, page, limit],
    queryFn: (): Promise<ApplicationOfferDTO[]> => getApplicationOffersPageableByFilter({personId: personId}, Number(page ?? '1'), Number(limit ?? '10')),
    staleTime: 1000 * 60 * 60 // 1 hour
  });
  await queryClient.prefetchQuery({
    queryKey: ['application_offers_count', session?.user.personId],
    queryFn: (): Promise<number> => getApplicationCountByPersonId(personId),
    staleTime: 1000 * 60 * 60 // 1 hour
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <UsersOffersPage session={session} currentPage={page} limit={limit}/>
    </HydrationBoundary>
  )
}

export default page;