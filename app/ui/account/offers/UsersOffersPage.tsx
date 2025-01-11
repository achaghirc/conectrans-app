'use client';
import { getApplicationCountByPersonId, getApplicationOffersPageableByPersonId } from '@/lib/data/applicationOffers';
import { Box, Divider, TablePagination, Typography } from '@mui/material';
import { ApplicationOfferDTO, OfferDTO } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import Image from 'next/image';
import React, { useEffect } from 'react'
import ButtonCustom from '../../shared/custom/components/button/ButtonCustom';
import Link from 'next/link';
import ApplicationOfferCardComponent from './apply/ApplicationOfferCardComponent';
import { getOfferSlimCardById } from '@/lib/data/offer';
import OffersListSkeleton from '../../shared/custom/components/skeleton/OffersListSkeletonComponent';
import PaginationComponent from '../../shared/custom/components/pagination/PaginationComponent';

type UsersOffersPageProps = {
  session: Session | null; 
  currentPage: number;
  limit: number;
}

const UsersOffersPage: React.FC<UsersOffersPageProps> = (
  {session, currentPage, limit}
) => {
  const queryClient = useQueryClient();
  if (!session) {
    return null;
  }

  const {data, isLoading, isError, isFetched} = useQuery({
    queryKey: ['applications_offers', session?.user.personId, currentPage, limit],
    queryFn: (): Promise<ApplicationOfferDTO[]> => getApplicationOffersPageableByPersonId(session?.user.personId ?? 0, currentPage, limit),
  });
  const {data: count, isFetched: countFetched} = useQuery({
    queryKey: ['application_offers_count', session?.user.personId],
    queryFn: (): Promise<number> => getApplicationCountByPersonId(session?.user.personId ?? 0),
    staleTime: 1000 * 60 * 60 // 1 hour
  });

  const prefetchNexPage = async () => {
    if (count) {
      if((currentPage + 1) * limit <= (count + limit)) {
        const newPage = currentPage + 1;
        await queryClient.prefetchQuery({
          queryKey: ['applications_offers', session?.user.personId, newPage, limit], 
          queryFn: (): Promise<ApplicationOfferDTO[]> => getApplicationOffersPageableByPersonId(session?.user.personId ?? 0, newPage, limit)
        });
        console.log(queryClient.getQueriesData({queryKey: ['applications_offers']}));
      }
    }
  }

  //Si aún hay páginas por cargar, cargar al menos la siguiente.
  useEffect(() => {
    if (isFetched && countFetched) {
      const prefetchData = async () => {
        await prefetchNexPage();
      };
      prefetchData();
    }
  }, [isFetched, countFetched]);

  
  if(isLoading) {
    return <OffersListSkeleton /> 
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
        <Link key={application.id} href={`/offers/${application.Offer.id}`} style={{textDecoration: 'none', color: 'inherit' }}>
          <ApplicationOfferCardComponent 
            key={application.id}
            session={session}
            data={application}
          />
          <Divider variant='inset' sx={{ display: {xs: 'flex', sm: 'none' }}} />
        </Link>
      ))}
      <PaginationComponent 
        count={count ?? 0}
        currentPage={currentPage}
        rowsPerPage={limit}
        rowsPerPageOptions={[5,10, 20, 30]}
        handleRowsPerPageChange={() => {}}
      />
    </div>
  )
}

export default UsersOffersPage
