'use client';

import { Box, CircularProgress, Tab, Tabs } from '@mui/material';
import { Session } from 'next-auth';
import React from 'react'
import { a11yProps, CustomTabPanel } from '../../shared/custom/components/tabPanel/CustomTabPanelComponent';
import ButtonAddCustom from '../../shared/custom/components/button/ButtonAddCustom';
import CreateOfferComponent from './create/CreateOfferComponent';
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { useQuery } from '@tanstack/react-query';
import { getOffersByUserId } from '@/lib/data/offer';
import OffersListComponent from './OffersListComponent';
import { OfferDTO } from '@prisma/client';
import { AddCircleOutline } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import OffersListSkeleton from '../../shared/custom/components/skeleton/OffersListSkeletonComponent';

type CompanyOffersPageProps = {
  session: Session | null;
}

const CompanyOffersPage: React.FC<CompanyOffersPageProps> = (
  { session }
) => {
  const router = useRouter();
  if (!session) {
    router.push('/auth/login');
    return;
  }
  const [value, setValue] = React.useState(0);
  const [openCreateOffer, setOpenCreateOffer] = React.useState(false);
  
  const handleCloseSnackbar = () => {
    setSnackbarProps({...snackbarProps, open: false})
  }  
  const [snackbarProps, setSnackbarProps] = React.useState<SnackbarCustomProps>({
    open: false, 
    handleClose: handleCloseSnackbar,
    message: '',
    severity: 'success'
  })

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
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { data: offers, isLoading, isError } = useQuery({
    queryKey: ['offers', session?.user.id],
    queryFn: () => getOffersByUserId(session?.user.id ?? ''),
    enabled: !!session?.user.id,
    staleTime: 1000 * 60 * 10 // 10 minutes
  });

  if (isError) {
    handleSnackbarSons({
      open: true,
      message: 'Error al obtener las ofertas',
      severity: 'error'
    })
    throw new Error('Error al obtener las ofertas');
  }


  const filterActiveOffers = (offers: OfferDTO[] | undefined) => {
    if (!offers) {
      return [];
    }
    return offers.filter((offer) => offer.endDate >= new Date());
  }

  const filterHistoricalOffers = (offers: OfferDTO[] | undefined) => {
    if (!offers) {
      return [];
    }
    return offers.filter((offer) => offer.endDate < new Date());
  }

  return (
    <Box 
      sx={{
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column'
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="offers tabs conectrans" centered>
          <Tab label="Activas" {...a11yProps(0)} />
          <Tab label="Histórico" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {isLoading ? (
          <OffersListSkeleton />
        ) : (
          <OffersListComponent session={session} offers={filterActiveOffers(offers)} />
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {isLoading ? (
          <OffersListSkeleton />
        ) : (
          <OffersListComponent session={session} offers={filterHistoricalOffers(offers)} />
        )}
      </CustomTabPanel>
      <ButtonAddCustom actions={[{
        name: 'Crear oferta',
        icon: <AddCircleOutline />,
        onClick: () => setOpenCreateOffer(true)
      }]}/>
      <CreateOfferComponent 
        session={session} 
        open={openCreateOffer} 
        setOpen={setOpenCreateOffer} 
        setSnackbarProps={handleSnackbarSons} 
      />
      <SnackbarCustom {...snackbarProps}/>
    </Box>
  )
}

export default CompanyOffersPage;
