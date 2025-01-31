import DetailsOfferComponent from "@/app/ui/account/offers/details/DetailsOfferComponent";
import BreadcrumbsComponent from "@/app/ui/shared/custom/components/breadcrumbs/Breadcrumbs";
import { auth } from "@/auth";
import { existsApplicationOfferByPerson } from "@/lib/data/applicationOffers";
import { getOfferById } from "@/lib/data/offer";
import { QueryClient } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const queryClient = new QueryClient();
export default async function Page({params}: PageProps) {
  const session = await auth();
  const { id } = await params;
  if (!session
    || !session.user
    || !session.user.id) {
    return null;
  }

  await Promise.all([
    await queryClient.prefetchQuery({
      queryKey: ['offer', Number(id)],
      queryFn: () => getOfferById(Number(id)),
      staleTime: 1000 * 60 * 10 // 10 minutes
    }),
    await queryClient.prefetchQuery({
       queryKey: ['existsApplicationOfferByPerson', session?.user.personId,  Number(id)],
        queryFn: (): Promise<boolean | undefined > => existsApplicationOfferByPerson(session?.user.personId ?? 0, Number(id)),
        staleTime: 1000 * 60 * 60 * 24 * 7,
    }),
  ]);

  return (
    <main>
      <BreadcrumbsComponent breadcrumbs={[
        {label: 'Inicio', href: '/', active: false},
        {label: 'Ofertas', href: '/account-company/offers', active: false},
        {label: 'Detalle', href: `/account-company/offers/${id}`, active: true}
      ]} />
      <DetailsOfferComponent session={session} offerId={id} />
    </main>
  )
}


