import { Box, Typography } from '@mui/material'
import React from 'react'
import OfferCardComponent from '../account/offers/OfferCardComponent'
import { OfferDTO } from '@prisma/client';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { getOfferById } from '@/lib/data/offer';
import Image from 'next/image';

type OfferGeneralListComponentProps = {
  offers: OfferDTO[] | [];
  recommendedOffers: OfferDTO[] | [];
}

const OffersGeneralListComponent: React.FC<OfferGeneralListComponentProps> = ({
  offers, recommendedOffers
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
        <>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', mt: {xs: 0, sm: 2,}, mb: 2, height: '100%'}}>
            <Image 
              src="https://res.cloudinary.com/dgmgqhoui/image/upload/v1736531199/caution_no_found_ejl6a3.png" 
              alt="No hay ofertas" 
              width={100}
              height={100} />
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                
                <Typography variant="h6" fontWeight={600} color="textSecondary">No hay ofertas que satisfagan los filtros</Typography> 
                <Typography variant="subtitle1" fontWeight={300} color="textSecondary">Prueba a cambiar los filtros de búsqueda</Typography>
              </Box>
          </Box>
          <Box>
            {/* Apartado de recomendación de ofertas */}
            <Typography variant="h6" fontWeight={600} color="textSecondary">Ofertas recomendadas</Typography>
            {recommendedOffers.map((offer, index: number) => (
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
        </>
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
