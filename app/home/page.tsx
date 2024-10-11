import { auth } from '@/auth';
import React from 'react'
import Navbar from '../ui/shared/navbar';
import Banner from '../ui/home/banner';
import SectionCards from '../ui/home/section';
import Footer from '../ui/home/footer';

export default async function page() {
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
