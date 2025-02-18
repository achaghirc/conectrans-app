'use client';
import { getOfferById } from '@/lib/data/offer';
import Grid  from '@mui/material/Grid2';
import { OfferDTO } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth'
import { notFound, useRouter } from 'next/navigation';
import React from 'react'
import DetailsOfferResumeComponent from './DetailsOfferResumeComponent';
import { Box, Card, CardMedia, Paper, Typography } from '@mui/material';
import DetailsOfferInformationComponent from './DetailsOfferInformationComponent';
import DetailsOfferRequirementsComponent from './DetailsOfferRequirementsComponent';
import CountdownComponent from '@/app/ui/shared/custom/components/countdownComponent';
import MapComponent from '@/app/ui/maps/MapComponent';
import DetailsOfferSkeleton from '@/app/ui/shared/custom/components/skeleton/DetailsOfferSkeleton';
import EditOfferComponent from '../edit/EditOfferComponent';
import SnackbarCustom, { SnackbarCustomProps } from '@/app/ui/shared/custom/components/snackbarCustom';
import UserApplyOffer from '../apply/UserApplyOffer';
import { getApplicationsOfferUserByFilter } from '@/lib/data/applicationOffers';

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
  const router = useRouter();
  const [open, setOpen] = React.useState<boolean>(false);
  const [openApply, setOpenapply] = React.useState<boolean>(false);
  const [snackbarProps, setSnackbarProps] = React.useState<SnackbarCustomProps>({
    open: false,
    message: '',
    severity: 'success',
    handleClose: () => handleCloseSnackbar()
  });

  const handleCloseSnackbar = () => {
    setSnackbarProps({...snackbarProps, open: false})
  }
  const handleSnackbarSons = (snackbarProps: Partial<SnackbarCustomProps>) => {
    const {open, message, severity} = snackbarProps;
    setSnackbarProps({
      ...snackbarProps,
      open: open ?? false,
      message: message ?? '',
      severity: severity ?? 'success',
      handleClose: handleCloseSnackbar
    })

  }

  const handleUserApply = () => {
    if (session){
      setOpenapply(true);
    } else {
      router.push(`/auth/login?redirect=/offers/${offerId}`);
    }
  }

  const handleEditOffer = () => {
    setOpen(true);
  }
  
  const {data: offerSelected, isLoading, isError} = useQuery({
    queryKey: ['offer', Number(offerId)],
    queryFn: () => getOfferById(Number(offerId)),
  });

  useQuery({
    queryKey: ['offer_candidates', Number(offerId)],
    queryFn: () => getApplicationsOfferUserByFilter({offerId: Number(offerId)}, Number(1), 10),
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });

  const handleEditSuccess = (offer: OfferDTO) => { 
    // setOfferSelected(offer);
  }

  if (isError) {
    notFound();
  }
  if (isLoading || offerSelected === undefined) {
    return <DetailsOfferSkeleton />
  }
  const location = {
    lat: offerSelected?.Location.latitude ?? DEFAULT_CENTER.lat,
    lng: offerSelected?.Location.longitude ?? DEFAULT_CENTER.lng,
  }
  return (
    <Box component={'div'}>
      <Box component={'div'} sx={{ display: {xs: 'none', md: 'flex'}, height: 30, width: '100%' }}></Box>
      {offerSelected && (
        <>
        <Grid container spacing={2}>
          <Grid size={{xs: 12,sm: 12, md: 12, lg: 8}}>
            <DetailsOfferResumeComponent offer={offerSelected} />
            <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'column', md: 'row'}, justifyContent: 'space-between'}}> 
              <DetailsOfferRequirementsComponent offer={offerSelected} />
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
                <MapComponent height='300px' width='100%' center={location} zoom={DEFAULT_ZOOM} locations={[location]} />
              </Paper>
            </Box>
            
            <CountdownComponent 
              title='La oferta finaliza en'
              endDate={offerSelected.endDate} />

          </Grid>
          <Grid size={{xs: 12, sm: 12, md: 12, lg: 4}}>
            <Grid container spacing={2} direction={'column'}>
              <Grid size={{xs: 12}}>
                <DetailsOfferInformationComponent session={session} offer={offerSelected} handleEditOffer={handleEditOffer} handleUserApply={handleUserApply} />
              </Grid>
              <Grid size={{xs: 12}}>
                <Box component={'div'} 
                  sx={{ 
                    display: 'flex',
                    flex: 1, // Allows this component to expand
                    alignItems: 'center', // Centers the content vertically
                    justifyContent: 'center', // Centers the content horizontally
                    overflow: 'hidden', // Prevents overflow
                  }}
                  >
                  <Card sx={{ display: 'flex', borderRadius: 5, boxShadow: 1}}>
                    <CardMedia
                      component="img"
                      sx={{
                        width: '100%', // Make it responsive
                        height: 'auto',
                        minWidth: '100%', // Preserve aspect ratio
                        maxHeight: '100%', // Avoid overflow in height
                        objectFit: 'fill', // Prevent image from being cropped
                        borderRadius: 5,
                      }}
                      image="/IGM_Banner2.jpeg"
                      alt={offerSelected.User.Company?.name}
                    />
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <EditOfferComponent 
          offer={offerSelected!} 
          open={open}
          setOpen={setOpen}
          setSnackbarProps={handleSnackbarSons}
          onSuccess={(offer: OfferDTO) => handleEditSuccess(offer)}
        />
        <UserApplyOffer 
          session={session}
          offerId={offerSelected.id}
          open={openApply}
          setOpen={setOpenapply}
          setSnackbarProps={handleSnackbarSons}
        />
        </>
      )}
      <SnackbarCustom {...snackbarProps} />
    </Box>
  )
}

export default DetailsOfferComponent