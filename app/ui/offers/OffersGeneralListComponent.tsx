import { Box } from '@mui/material'
import React from 'react'
import OfferCardComponent from '../account/offers/OfferCardComponent'
import { OfferDTO } from '@prisma/client';
import Link from 'next/link';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { getOfferById } from '@/lib/data/offer';

type OfferGeneralListComponentProps = {
  offers: OfferDTO[] | [];
}

const OffersGeneralListComponent: React.FC<OfferGeneralListComponentProps> = ({
  offers
}) => {

  const queryClient = useQueryClient();

  const onMouseOver = async (offerId: number) => {
    if(queryClient.getQueryData(['offer', Number(offerId)])) return;
    await queryClient.prefetchQuery({
      queryKey: ['offer', Number(offerId)], 
      queryFn: () => getOfferById(offerId)
    });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: {xs: 2, md: 0}, mr: {xs: 1, md: 0}, ml: {xs: 1, md: 0}}}>
      {offers && offers.length == 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '100%'}}>
          No hay ofertas disponibles
        </Box>
      )}
      {offers.map((offer, index: number) => (
        <Link
          key={index}
          href={`/offers/${offer.id}`}
          passHref
          style={{ textDecoration: 'none', color: 'inherit' }}
          prefetch={true}
          onMouseOver={() => onMouseOver(offer.id)}
        >
          <OfferCardComponent offer={offer} />
        </Link>
      ))} 
    </Box>
  )
}

export default OffersGeneralListComponent
