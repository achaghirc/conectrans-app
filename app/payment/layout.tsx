import React from 'react'
import Navbar from '../ui/shared/navbar'
import { auth } from '@/auth'

export default async function layout({children} : {children: React.ReactNode}) {
  const session = await auth();
  return (
    <div>
      <Navbar session={session} />
      {children}
    </div>
  )
}
