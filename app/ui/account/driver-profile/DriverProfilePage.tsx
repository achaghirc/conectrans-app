'use client';
import React, { use, useEffect } from 'react'
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AccordionComponent from '../../shared/custom/components/accordion/AccordionComponent';
import DriverLicencesComponent from './DriverLicencesComponent';
import DriverWorkPreferencesComponent from './DriverWorkPreferencesComponent';
import DriverExperienceComponent from './DriverExperienceComponent';
import { getDriverLicenceByDriverProfileId } from '@/lib/data/driver-licence';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEncoderTypeByIdsIn, getEncoderTypeData } from '@/lib/data/encoderType';
import { getDriverPreferencesByUserId } from '@/lib/data/preferences';
import { getExperiencesByUserId } from '@/lib/data/experiences';
import { getEducationDataByUserId } from '@/lib/data/education';
import { getPersonLanguageByUserId } from '@/lib/data/languaje';
import { getCountries } from '@/lib/data/geolocate';

type DriverProfilePageProps = {
  session: Session | null;
}


const DriverProfilePage: React.FC<DriverProfilePageProps> = ({session}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  if (!session) {
    router.push('/auth/login');
  }

  const { data: countries, isLoading: isLoadingCountries, isError: isErrorCountries } = useQuery({ queryKey: ['countries'], queryFn: () => getCountries() });
  const { data: encoders, isLoading: isLoadingEncoders, isError: isErrorEncoders} = useQuery({ queryKey: ['encoders'], queryFn: () => getEncoderTypeData() });
  const { data, isLoading, isError } = useQuery({ queryKey: ['driverProfile'+session?.user.id], queryFn: () =>  getDriverLicenceByDriverProfileId(session?.user.id ?? '') });
  const { data: employmentPreferences, isLoading: isLoadingEmploymentPreferences, isError: isErrorEmploymentPreferences } = useQuery({ queryKey: ['employmentPreferences'+session?.user.id], queryFn: () => getDriverPreferencesByUserId(session?.user.id ?? '') });
  
  const {data: experiences, isLoading: isLoadingExperiences, isError: isErrorExperiences} = useQuery({ queryKey: ['experiences'+session?.user.id], queryFn: () => getExperiencesByUserId(session?.user.id ?? '') });
  const {data: educations, isLoading: isLoadingEducations, isError: isErrorEducations} = useQuery({ queryKey: ['estudies'+session?.user.id], queryFn: () => getEducationDataByUserId(session?.user.id ?? '') });
  const {data: personLanguages, isLoading: isLoadingPersonLanguages, isError: isErrorPersonLanguages} = useQuery({ queryKey: ['personLanguages'+session?.user.id], queryFn: () => getPersonLanguageByUserId(session?.user.id ?? '') });

  
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error...</div>
  }

  const updateDriverLicences = () => {
    queryClient.invalidateQueries({ queryKey: ['driverProfile'+session?.user.id] });
  }
  const updateDriverPreferences = () => {
    queryClient.invalidateQueries({ queryKey: ['employmentPreferences'+session?.user.id] });
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      padding: 2,
    }} >
      <Typography variant='h4' component='h1' sx={{ fontWeight: 900 }}>Resumen</Typography>
      <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column'}}>
        <Grid>
          <AccordionComponent title='Licencias de conducción' expandedDefault={true}>
            <DriverLicencesComponent data={data} encoders={encoders} countries={countries} saveAction={updateDriverLicences} />
          </AccordionComponent>
        </Grid>
        <Grid>
          <AccordionComponent title='Preferencias de empleo' expandedDefault={false} loading={isLoadingEmploymentPreferences}>
            <DriverWorkPreferencesComponent data={employmentPreferences} encoders={encoders} saveAction={updateDriverPreferences}/>
          </AccordionComponent>
        </Grid>
        <Grid>
          <AccordionComponent title='Experiencia y Estudios' expandedDefault={false} 
            loading={isLoadingEducations || isLoadingExperiences || isLoadingPersonLanguages}>
            <DriverExperienceComponent 
              session={session} 
              encoders={encoders ?? []}
              educations={educations ?? []}
              data={experiences ?? []}
              personLanguages={personLanguages ?? []}
            />
          </AccordionComponent>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DriverProfilePage;