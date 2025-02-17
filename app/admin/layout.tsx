import { auth } from "@/auth";
import { Session } from "next-auth";
import Sidenav from "../ui/shared/nav/SideNav";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";


export default async function layout({children} : {children: React.ReactNode}) {
  const session: Session | null = await auth();

  if (!session) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    return null;
  }


  return (
    <Sidenav session={session}> 
      {children}
    </Sidenav>
  )
}
