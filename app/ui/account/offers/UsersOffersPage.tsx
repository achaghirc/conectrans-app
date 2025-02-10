'use client';
import { getApplicationCountByPersonId, getApplicationOffersPageableByFilter,  } from '@/lib/data/applicationOffers';
import { Box, Divider, TablePagination, Typography } from '@mui/material';
import { ApplicationOfferDTO, OfferDTO } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import Image from 'next/image';
import React, { useCallback, useEffect } from 'react'
import ButtonCustom from '../../shared/custom/components/button/ButtonCustom';
import Link from 'next/link';
import ApplicationOfferCardComponent from './apply/ApplicationOfferCardComponent';
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
  const personId = session?.user.personId ?? 0;

  const {data, isLoading, isError, isFetched} = useQuery({
    queryKey: ['applications_offers', session?.user.personId, currentPage, limit],
    queryFn: (): Promise<ApplicationOfferDTO[]> => getApplicationOffersPageableByFilter({personId: personId}, currentPage, limit),
  });
  const {data: count, isFetched: countFetched} = useQuery({
    queryKey: ['application_offers_count', session?.user.personId],
    queryFn: (): Promise<number> => getApplicationCountByPersonId(personId),
    staleTime: 1000 * 60 * 60 // 1 hour
  });

  const prefetchNexPage = useCallback(async () => {
    if (count) {
      if((currentPage + 1) * limit <= (count + limit)) {
        const newPage = currentPage + 1;
        await queryClient.prefetchQuery({
          queryKey: ['applications_offers', session?.user.personId, newPage, limit], 
          queryFn: (): Promise<ApplicationOfferDTO[]> => getApplicationOffersPageableByFilter({personId: personId}, newPage, limit)
        });
        console.log(queryClient.getQueriesData({queryKey: ['applications_offers']}));
      }
    }
  }, [count, currentPage])

  //Si aún hay páginas por cargar, cargar al menos la siguiente.
  useEffect(() => {
    if (isFetched && countFetched) {
      const prefetchData = async () => {
        await prefetchNexPage();
      };
      prefetchData();
    }
  }, [isFetched, countFetched, prefetchNexPage]);

  
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
      <Box component={'div'} gap={2}>
        <Typography variant="subtitle2" fontWeight={300}>No tienes ninguna candidatura activa actualmente</Typography>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={4}>
          <Image 
            src={'https://res.cloudinary.com/dgmgqhoui/image/upload/v1738681088/3d-business-man-with-phone-showing-thumbs-up_ybvvw7.png'}
            alt="No offers"
            width={380}
            height={380}
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
      </Box> 
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
      <Box component={'div'} sx={{ display: 'flex', position: 'absolute', bottom: 0, right: '35%', p: 2 }}>

      <PaginationComponent 
        count={count ?? 0}
        currentPage={currentPage}
        rowsPerPage={limit}
        rowsPerPageOptions={[5,10, 20, 30]}
        handleRowsPerPageChange={() => {}}
        />
      </Box>
    </div>
  )
}

export default UsersOffersPage
