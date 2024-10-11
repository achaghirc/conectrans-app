import Signup from '@/app/ui/auth/signup'
import { getActitivies } from '@/lib/data/activity';
import React from 'react'

export default async function Page() {

  const activities = await getActitivies();
  return (
    <>
      <Signup activities={activities} />
    </>
  
  )
}