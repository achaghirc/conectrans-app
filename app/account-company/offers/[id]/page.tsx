import DetailsOfferComponent from "@/app/ui/account/offers/details/DetailsOfferComponent";
import BreadcrumbsComponent from "@/app/ui/shared/custom/components/breadcrumbs/Breadcrumbs";
import { auth } from "@/auth";

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
        {label: 'Ofertas', href: '/account-company/offers', active: false},
        {label: 'Detalle', href: `/account-company/offers/${id}`, active: true}
      ]} />
      <DetailsOfferComponent session={session} offerId={id} />
    </main>
  )
}


