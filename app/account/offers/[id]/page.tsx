import DetailsOfferComponent from "@/app/ui/account/offers/details/DetailsOfferComponent";
import BreadcrumbsComponent from "@/app/ui/shared/custom/components/breadcrumbs/Breadcrumbs";
import { auth } from "@/auth";
import { getOfferById } from "@/lib/data/offer";
import { notFound } from "next/navigation";

export default async function Page({params}: {params: {id: string}}) {
  const session = await auth();
  if (!session
    || !session.user
    || !session.user.id) {
    return null;
  }
  const { id } = await params;

  return (
    <main>
      <BreadcrumbsComponent breadcrumbs={[
        {label: 'Inicio', href: '/', active: false},
        {label: 'Ofertas', href: '/account/offers', active: false},
        {label: 'Detalle', href: `/account/offers/${id}`, active: true}
      ]} />
      <DetailsOfferComponent session={session} offerId={id} />
    </main>
  )
}


