import CompanyOfferCandidatesPage from "@/app/ui/account/offers/candidates/CompanyOfferCandidatesPage";
import BreadcrumbsComponent from "@/app/ui/shared/custom/components/breadcrumbs/Breadcrumbs";
import { auth } from "@/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({params}: PageProps) {
  const session = await auth();
  const { id } = await params;
  if (!session
    || !session.user
    || !session.user.id) {
    return null;
  }

  if(!id) {
    return null;
  }

  return (
    <main>
      <BreadcrumbsComponent breadcrumbs={[
        {label: 'Inicio', href: '/', active: false},
        {label: 'Ofertas', href: '/account-company/offers', active: false},
        {label: 'Detalle', href: `/account-company/offers/${id}`, active: false},
        {label: 'Candidatos', href: `/account-company/offers/${id}/candidates`, active: true}
      ]} />
      <CompanyOfferCandidatesPage session={session} offerId={id} />
    </main>
  )
}