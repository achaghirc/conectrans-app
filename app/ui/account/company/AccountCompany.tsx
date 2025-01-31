'use client';

import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Session } from 'next-auth'
import React, { Suspense, useState } from 'react'
import ProfileComponent from '../../shared/account/ProfileComponent';
import AccordionComponent from '../../shared/custom/components/accordion/AccordionComponent';
import { useQuery } from '@tanstack/react-query';
import { getCompanySlimDTOById } from '@/lib/data/company';
import { useRouter } from 'next/navigation';
import { ProfileComponentSkeleton } from '../../shared/custom/components/skeleton/ProfileComponentSkeleton';
import useUserData from '../../shared/hooks/useUserData';
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';

type AccountCompanyProps = {
  session: Session | null;
}

const AccountDataComponent = React.lazy(() => import('../AccountDataComponent'));
const CompanyDataComponent = React.lazy(() => import('./CompanyDataComponent'));
const CompanyPersonContactComponent = React.lazy(() => import('./CompanyPersonContactComponent'));

const AccountCompany: React.FC<AccountCompanyProps> = (
  {session}
) => {
  if (!session) {
    return;
  }

  const handleCloseSnackbar = () => {
    setSnackbarProps({...snackbarProps, open: false})
  }  
  const [snackbarProps, setSnackbarProps] = useState<SnackbarCustomProps>({
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

  const {data: companyData, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['companyHeaderData', session?.user.companyId], 
    queryFn: () => getCompanySlimDTOById(session?.user.companyId ?? 0),
    enabled: !!session?.user.companyId
  });

  const { userData } = useUserData(session);


  return (
    <Box sx={{ display: 'flex', flexDirection:'column' }}>
      <Box>
        {isCompanyLoading ? (
          <ProfileComponentSkeleton />
        ): (
          <ProfileComponent assetUrl={companyData?.assetUrl} title={companyData?.name ?? ''} subtitle={companyData?.description ?? ''} />
        )}
      </Box>
      <Grid container spacing={3} mt={3}>
        <Grid size={{xs: 12}}>  
          <AccountDataComponent session={session} setSnackbarProps={handleSnackbarSons}/>
        </Grid>
        <Grid size={{xs: 12}}>
          <Suspense fallback={
            <AccordionComponent title='Datos de la empresa' loading={true} expandedDefault={false}> 
              <Typography variant='body1'>Cargando...</Typography>
            </AccordionComponent>
            }
          >
            <AccordionComponent 
              title='Datos de la empresa' 
              expandedDefault={false}
              loading={false}
              >
                <CompanyDataComponent
                  session={session}
                  setSnackbarProps={handleSnackbarSons}
                />
              </AccordionComponent>
          </Suspense>
        </Grid>
        <Grid size={{xs: 12}}>
          <Suspense fallback={
            <AccordionComponent title='Persona de contacto' loading={true} expandedDefault={false}> 
              <Typography variant='body1'>Cargando...</Typography>
            </AccordionComponent>
            }
          >
            <AccordionComponent 
              title='Persona de contacto' 
              expandedDefault={false}
              loading={false}
              >
                <CompanyPersonContactComponent
                  session={session}
                  setSnackbarProps={handleSnackbarSons}
                />
              </AccordionComponent>
          </Suspense>
        </Grid>
      </Grid>
      <SnackbarCustom
        {...snackbarProps}
      /> 
    </Box>
  )
}

export default AccountCompany
