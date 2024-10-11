import Navbar from "./ui/shared/navbar";
import Banner from "./ui/home/banner";
import SectionCards from "./ui/home/section";
import Footer from "./ui/home/footer";
import { auth } from "@/auth";
import { signOut } from "next-auth/react";

export default async function Home() {
  const session = await auth();
  return (
    <main>
      <Navbar session={session}/>
      <Banner />
      <SectionCards />
      <Footer />
    </main>
  );
}
