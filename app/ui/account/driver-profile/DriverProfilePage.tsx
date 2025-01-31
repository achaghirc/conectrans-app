'use client';
import React, { lazy } from 'react'
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Box, Skeleton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AccordionComponent from '../../shared/custom/components/accordion/AccordionComponent';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEncoderTypeData } from '@/lib/data/encoderType';
import { getCountries } from '@/lib/data/geolocate';
import { getDriverProfileData } from '@/lib/data/driver-profile';
import { DriverLicenceProfileDTO } from '@/lib/definitions';
import { getDriverLicenceByUserId } from '@/lib/data/driver-licence';
import { getExperiencesByUserId } from '@/lib/data/experiences';

type DriverProfilePageProps = {
  session: Session | null;
}

const DriverLicencesComponent = lazy(() => import('./DriverLicencesComponent'));
const DriverWorkPreferencesComponent = lazy(() => import('./DriverWorkPreferencesComponent'));
const DriverExperienceComponent = lazy(() => import('./DriverExperienceComponent'));
const DriverLanguagesComponent = lazy(() => import('./DriverLanguagesComponent'));
const DriverEducationComponent = lazy(() => import('./DriverEducationComponent'));

const DriverProfilePage: React.FC<DriverProfilePageProps> = ({session }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  if (!session) {
    router.push('/auth/login');
  }

  const { data: driverLicences, isLoading: isLoadingLicences, isError: isErrorLicences } = useQuery({ 
    queryKey: ['driverProfileLicences', session?.user.id], 
    queryFn: (): Promise<DriverLicenceProfileDTO | undefined> => getDriverLicenceByUserId(session?.user.id ?? '') 
  });
  
  const { data: experiences, isLoading: isLoadingExperiences, isError: isErrorExperiences } = useQuery({ 
    queryKey: ['driverProfileExperiences', session?.user.id], 
    queryFn: () => getExperiencesByUserId(session?.user.id ?? '') 
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['driverProfile', session?.user.id], 
    queryFn: () =>  getDriverProfileData(session?.user.id ?? '') 
  });
  const { preferences, educations, languajes} = data ?? {};

  const { data: countries, isLoading: isLoadingCountries, isError: isErrorCountries } = useQuery({ 
    queryKey: ['countries'], queryFn: () => getCountries() 
  });
  const { data: encoders, isLoading: isLoadingEncoders, isError: isErrorEncoders} = useQuery({ 
    queryKey: ['encoders'], 
    queryFn: () => getEncoderTypeData() 
  });
  
  const updateDriverLicences = () => {
    queryClient.invalidateQueries({ queryKey: ['driverProfileLicences', session?.user.id] });
  }
  const updateDriverExperiences = () => {
    queryClient.refetchQueries({ queryKey: ['driverProfileExperiences', session?.user.id] });
  }
  const updateDriverProfile = () => {
    queryClient.invalidateQueries({ queryKey: ['driverProfile', session?.user.id] });
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: {xs: 'center', md: 'flex-start'},
      paddingTop: 2,
      gap: 4,
      maxWidth: '100%',
      width: '100%'
    }} >
      <Typography variant='h4' component='h1' sx={{ fontWeight: 900 }}>Resumen</Typography>
      <Grid container spacing={2}>
        <Grid size={{xs: 12}}>
          <AccordionComponent title='Licencias de conducción' 
            expandedDefault={!isLoadingLicences}
            loading={isLoadingLicences}
            >
            <DriverLicencesComponent data={driverLicences} encoders={encoders} countries={countries} saveAction={updateDriverLicences} />
          </AccordionComponent>
        </Grid>
        <Grid size={{xs: 12}}>
          <AccordionComponent title='Experiencia'
            expandedDefault={false}             
            loading={isLoadingExperiences}
          >
            <DriverExperienceComponent 
              session={session}
              encoders={encoders ?? []}
              data={experiences ?? []}
              saveAction={updateDriverExperiences}  
            />
          </AccordionComponent>
        </Grid>
        <Grid size={{xs: 12}}>
          <AccordionComponent title='Preferencias de empleo' 
            expandedDefault={false}
            loading={isLoading}  
          >
            <DriverWorkPreferencesComponent data={preferences} encoders={encoders} saveAction={updateDriverProfile}/>
          </AccordionComponent>
        </Grid>
        {/* Problema de scroll lateral  */}
        <Grid size={{xs: 12}}>
          <AccordionComponent title='Estudios'
            expandedDefault={false}             
            loading={isLoading}
          >
            <DriverEducationComponent
              session={session}
              data={educations ?? []}
              saveAction={updateDriverProfile}
            />
          </AccordionComponent>
        </Grid>
        <Grid size={{xs: 12}}>
          <AccordionComponent title='Idiomas'
            expandedDefault={false}             
            loading={isLoading}
          >
            <DriverLanguagesComponent 
              session={session}
              data={languajes ?? []}
              saveAction={updateDriverProfile}
            />
          </AccordionComponent>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DriverProfilePage;