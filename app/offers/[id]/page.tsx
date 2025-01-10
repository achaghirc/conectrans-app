import DetailsOfferComponent from "@/app/ui/account/offers/details/DetailsOfferComponent";
import Navbar from "@/app/ui/shared/navbar";
import { auth } from "@/auth";
import { getOfferById } from "@/lib/data/offer";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function Page({params}: {params: {id: string}}) {
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