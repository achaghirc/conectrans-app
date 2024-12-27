'use client';
import { getOfferById } from '@/lib/data/offer';
import Grid  from '@mui/material/Grid2';
import { OfferDTO } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Session } from 'next-auth'
import { notFound } from 'next/navigation';
import React from 'react'
import DetailsOfferResumeComponent from './DetailsOfferResumeComponent';
import { Box, Card, CardMedia, Paper, Typography } from '@mui/material';
import DetailsOfferInformationComponent from './DetailsOfferInformationComponent';
import DetailsOfferRequirementsComponent from './DetailsOfferRequirementsComponent';
import CountdownComponent from '@/app/ui/shared/custom/components/countdownComponent';
import MapComponent from '@/app/ui/maps/MapComponent';

const DEFAULT_CENTER = { lat: 38.956600744288735, lng: -5.878132026448462 };
const DEFAULT_ZOOM = 11; // You can change this according to your needs, or you can also recive this as a prop to make map component more reusable.
const LOCATIONS = [
  { lat: 38.956600744288735, lng: -5.878132026448462 }, // Example: Gurgaon
  { lat: 38.65193071586249, lng: -5.657675315059383 }, // Example: another location(New Delhi)
];


type DetailsOfferComponentProps = {
  session: Session | null;
  offerId: string;
}

const DetailsOfferComponent: React.FC<DetailsOfferComponentProps> = (
  { session, offerId }
) => {
  const {data: offer, isLoading, isError} = useQuery({
    queryKey: ['offer', offerId],
    queryFn: (): Promise<OfferDTO | null> => getOfferById(parseInt(offerId)),
    enabled: !!session && !!offerId,
  });

  if (isError) {
    notFound();
  }
  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <Box component={'div'} sx={{ display: {xs: 'none', md: 'flex'}, height: 30, width: '100%' }}></Box>
      {offer && (
        <Grid container spacing={2}>
          <Grid size={{xs: 12, md: 8}}>
            <DetailsOfferResumeComponent offer={offer} />
            <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-between'}}> 
              <DetailsOfferRequirementsComponent offer={offer} />
              <Paper
                elevation={2}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  padding: 0.5,
                  margin: 2,
                  borderRadius: 5,
                  boxShadow: 1,
                  backgroundColor: 'white',
                  width: { md: '100%' },
                }}
              >
                <MapComponent height='300px' width='100%' center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} locations={LOCATIONS} />
              </Paper>
            </Box>
            
            <CountdownComponent 
              title='La oferta finaliza en'
              endDate={offer.endDate} />
    
          </Grid>
          <Grid size={{xs: 12, md: 4}}>
            <Grid container spacing={2} direction={'column'}>
              <Grid size={{xs: 12}}>
                <DetailsOfferInformationComponent session={session} offer={offer} />
              </Grid>
              <Grid size={{xs: 12}}>
                <Box component={'div'} 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2,
                    m: 1
                  }}
                  >
                  <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 0, borderRadius: 5, boxShadow: 1}}>
                  <CardMedia
                    component="img"
                    height="100%"
                    sx={{
                      objectFit: 'fill',
                      borderRadius: 5,
                    }}
                    image="/IGM_Banner2.jpeg"
                    alt={offer.company.name}
                  />
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  )
}

export default DetailsOfferComponent