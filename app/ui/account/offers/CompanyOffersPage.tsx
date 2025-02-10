'use client';

import { Box, CircularProgress, Fab, Tab, Tabs } from '@mui/material';
import { Session } from 'next-auth';
import React from 'react'
import { a11yProps, CustomTabPanel } from '../../shared/custom/components/tabPanel/CustomTabPanelComponent';
import ButtonAddCustom from '../../shared/custom/components/button/ButtonAddCustom';
import CreateOfferComponent from './create/CreateOfferComponent';
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllOffersPageableByFilter, getOffersByUserId, getOffersByUserPageable } from '@/lib/data/offer';
import OffersListComponent from './OffersListComponent';
import { OfferDTO, OfferSlimDTO } from '@prisma/client';
import { AddCircleOutline } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import OffersListSkeleton from '../../shared/custom/components/skeleton/OffersListSkeletonComponent';
import { FilterOffersDTO } from '@/lib/definitions';

type CompanyOffersPageProps = {
  session: Session;
  page: number;
  limit: number;
}
const initialFilterData: Partial<FilterOffersDTO> = {
  userId: undefined,
  active: true
}

const CompanyOffersPage: React.FC<CompanyOffersPageProps> = (
  { session, page, limit }
) => {
  const queryClient = useQueryClient();
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['offers_active', { userId: session?.user.id, active: true }, page, limit],
    queryFn: () => getOffersByUserPageable(page, limit, { userId: session?.user.id, active: true }),
    staleTime: 1000 * 60 * 10 // 10 minutes
  });
  const { data: dataHistorical, isLoading: isLoadingHistorical, isError: isErrorHistorical } = useQuery({
    queryKey: ['offers_historical', { userId: session?.user.id, active: true }, page, limit],
    queryFn: () => getOffersByUserPageable( page, limit, { userId: session?.user.id, active: false }),
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
          <OffersListComponent session={session} offers={data != undefined ? data.offers : []} />
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {isLoading ? (
          <OffersListSkeleton />
        ) : (
          <OffersListComponent session={session} offers={dataHistorical != undefined ? dataHistorical.offers : []} />
        )}
      </CustomTabPanel>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Fab
          color="primary"
          onClick={() => setOpenCreateOffer(true)}
          sx={(theme) => ({
            position: 'fixed',
            bottom: theme.spacing(2),
            right: {xs: theme.spacing(2), sm: theme.spacing('40%')},
            zIndex: 1000, // Capa de visualización  
          })}
          >
          <AddCircleOutline />
        </Fab>
      </Box>
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
