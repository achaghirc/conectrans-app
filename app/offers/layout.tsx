import React from 'react'
import Navbar from '../ui/shared/navbar'
import { auth } from '@/auth';
import { Session } from 'next-auth';
import Footer from '../ui/home/footer';

export default async function layout({children} : {children: React.ReactNode}) {
  const session: Session | null  = await auth();

  return (
    <div>
      <Navbar session={session}/>
        {children}
      {/* <Footer /> */}
    </div>
  )
}
