import DetailsOfferComponent from "@/app/ui/account/offers/details/DetailsOfferComponent";
import { auth } from "@/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({params}: PageProps) {
  // get the session
  const session = await auth();
  // get the offer id
  const { id } = await params;

  return (
    <div >
      <DetailsOfferComponent session={session} offerId={id}/>
    </div>
  )
}