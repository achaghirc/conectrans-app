'use client';
import { getApplicationOffersByPersonId } from '@/lib/data/applicationOffers';
import { Box, Typography } from '@mui/material';
import { ApplicationOfferDTO } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Session } from 'next-auth';
import Image from 'next/image';
import React from 'react'
import ButtonCustom from '../../shared/custom/components/button/ButtonCustom';
import Link from 'next/link';
import OfferCardComponent from './OfferCardComponent';
import ApplicationOfferCardComponent from './apply/ApplicationOfferCardComponent';

type UsersOffersPageProps = {
  session: Session | null; 
}

const UsersOffersPage: React.FC<UsersOffersPageProps> = (
  {session}
) => {

  if (!session) {
    return null;
  }

  const {data, isLoading, isError} = useQuery({
    queryKey: ['applications_offers', session?.user.id],
    queryFn: (): Promise<ApplicationOfferDTO[]> => getApplicationOffersByPersonId(session?.user.personId ?? 0)
  });

  if(isLoading) {
    return <div>Loading...</div>
  }
  if(isError) {
    return <div>Error</div>
  }


  return (
    <div>
      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', flexGrow: 1, p: 2 }}>
        <h1 color="black">Candidaturas</h1>
        <Link  href={'/offers'}
          style={{textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          >
          <ButtonCustom 
            title='Más Ofertas'
            color='primary'
            loading={false}
            type='button'
            />
        </Link>
      </Box>
      {data?.length === 0 &&
      <>
        <Typography variant="subtitle2" fontWeight={300}>No tienes ninguna candidatura activa actualmente</Typography>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Image 
            src={'https://res.cloudinary.com/dgmgqhoui/image/upload/v1736350448/search_on_internet-removebg-preview_yfdbrk.png'}
            alt="No offers"
            width={400}
            height={400}
            style={{display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}
            />
          <Link  href={'/offers'}
            style={{textDecoration: 'none'}}
            >
            <ButtonCustom 
              title='Buscar Ofertas'
              color='primary'
              loading={false}
              type='button'
              />
          </Link>
        </Box>
      </> 
      }
      {data?.map((application) => (
        <Link key={application.id} href={`/offers/${application.offerId}`} style={{textDecoration: 'none'}}>
          <ApplicationOfferCardComponent 
            key={application.id}
            session={session}
            data={application}
          />
        </Link>
      ))}

    </div>
  )
}

export default UsersOffersPage
