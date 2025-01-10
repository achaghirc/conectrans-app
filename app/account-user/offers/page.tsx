import UsersOffersPage from "@/app/ui/account/offers/UsersOffersPage";
import { auth } from "@/auth";
import { Session } from "next-auth";


async function page() {
  const session : Session | null = await auth();
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }



  return (
    <main>
      <UsersOffersPage session={session} />
    </main>
  )
}

export default page;