'use client';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect } from 'react'
import { AccountProps } from './AccountPage';
import { getUserByEmail } from '@/lib/data/user';
import { PersonDTO, User } from '@/lib/definitions';
import { getPersonByUserId } from '@/lib/data/person';
import { useQuery, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, FormControl, FormControlLabel, IconButton, InputLabel, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { AddPhotoAlternateOutlined, ExpandMoreOutlined } from '@mui/icons-material';
import ProfileComponent from '../../shared/account/ProfileComponent';
import { DatePickerComponent } from '../../shared/custom/components/datePickerCustom';

import dayjs from 'dayjs';
import { getCountries, getProvincesByCountryId } from '@/lib/data/geolocate';
import ProvincesInputComponent from '../../shared/custom/components/provincesInputComponent';
import CountryInputComponent from '../../shared/custom/components/countryInputComponent';
import AccordionComponent from '../../shared/custom/components/accordion/AccordionComponent';


const AccountUserComponent: React.FC<AccountProps> = ({session}) => {
  const router = useRouter();
  if (!session) {return;}
  const [selectedCountry, setSelectedCountry] = React.useState<number>(0);
  const [selectedProvince, setSelectedProvince] = React.useState<string>('');
  const [hasCar, setHasCar] = React.useState<boolean>(false);
  const [relocateOption, setRelocateOption] = React.useState<boolean>(false);
  const fetchUserData = () : Promise<User | undefined> => getUserByEmail(session.user.email ?? '');
  const fetchPersonData = () : Promise<PersonDTO | undefined> => getPersonByUserId(session.user.id ?? '');

  const { data, isLoading, isError, error} = useQuery({queryKey: ['userData'], queryFn: fetchUserData})
  const { data: personData, isLoading: personIsLoading, isError: personIsError, error: personError} = useQuery({queryKey: ['personData'], queryFn: fetchPersonData})

  const {data: countries, isLoading: isCountriesLoading, isError: isCountriesError, error: countriesError} = useQuery({
    queryKey: ['countries'], 
    queryFn: getCountries
  });

  const { data: provincesData, isLoading: isProvincesLoading } = useQuery({
    queryKey: ['provinces', selectedCountry],
    queryFn: () => getProvincesByCountryId(selectedCountry),
    enabled: !!selectedCountry, // Fetch provinces only when a country is selected
  });

  useEffect(() => {
    if (personData?.location?.countryId) {
      setSelectedCountry(personData.location.countryId);
    }
    if (personData?.location?.state) {
      setSelectedProvince(personData.location.state);
    }
    if (personData?.hasCar) {
      setHasCar(personData.hasCar);
    }
    if (personData?.relocateOption) {
      setRelocateOption(personData.relocateOption);
    }
  }, [personData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | number>) => {
  
    const { name, value } = e.target;
    if (name === 'country') {
      setSelectedCountry(value as number);
    }
    if (name === 'state') {
      setSelectedProvince(value as string);
    }
  }


  if (isLoading || personIsLoading) {
    return <div>Loading...</div>
  }

  return (
    <Box sx={{ display: 'flex', flexDirection:'column' }} gap={3}>
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ProfileComponent assetUrl={personData?.assetUrl} title={personData?.name ?? ''} subtitle={data?.email ?? ''} />
      </Box>
      <Grid container spacing={3} sx={{ display: 'flex', flexDirection: 'column'}}>
        <AccordionComponent title={'Datos de la cuenta'} expandedDefault={true}>
          <Grid container spacing={2} mt={3}>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                sx={{width: {xs: '95%', sm: '80%'}}}
                label="Email"
                name="email"
                value={data?.email}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                sx={{width: {xs: '95%', sm: '80%'}}}
                label="Contraseña"
                name="password"
                type='password'
                value={data?.password.substring(0, 6)}
              />
            </Grid>
          </Grid>
        </AccordionComponent>
        <AccordionComponent title='Datos personales' expandedDefault={false}>
          <Grid container spacing={2} mt={3}>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                fullWidth
                sx={{width: { sm: '80%'}}}
                label="Email"
                name="email"
                value={personData?.name}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                fullWidth
                sx={{width: { sm: '80%'}}}
                label="Apellidos"
                name="lastname"      
                value={personData?.lastname}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                fullWidth
                label="DNI/NIE"
                name="cifnif"      
                value={personData?.document}
                sx={{
                  width: { sm: '80%'},
                  paddingTop: 'calc(1 * var(--mui-spacing))',
                  '.MuiInputLabel-root.MuiFormLabel-filled':{
                    transform: 'translate(15px, -0px) scale(0.75) !important',
                  },
                  '.MuiInputLabel-root': {
                    transform: 'translate(14px, 25px) scale(1) !important',
                  },
                  '.MuiInputLabel-root.Mui-focused':{
                    transform: 'translate(15px, -0px) scale(0.75) !important',
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <DatePickerComponent
                label="Fecha de nacimiento"
                value={dayjs(personData?.birthdate)}
                errors={{}}
                width={{ sm: '80%'}}
                setValue={() => {}}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                fullWidth
                sx={{width: { sm: '80%'}}}
                label="Teléfono fijo"
                name="landlinePhone"      
                value={personData?.landlinePhone}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                fullWidth
                sx={{width: { sm: '80%'}}}
                label="Dirección"
                name="address"      
                value={personData?.location?.street}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                fullWidth
                sx={{width: { sm: '80%'}}}
                label="Localidad"
                name="city"      
                value={personData?.location?.city}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <Box
                sx={{width: { sm: '80%'}}}
              >
                <CountryInputComponent
                  countries={countries}
                  inputName='country'
                  selectedCountry={selectedCountry}
                  handleInputChange={handleInputChange}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <Box sx={{width: { sm: '80%'}}}>
                <ProvincesInputComponent 
                  provincesData={provincesData}
                  isProvincesLoading={isProvincesLoading}
                  selectedProvince={selectedProvince}
                  inputName='state'
                  handleInputChange={handleInputChange}              
                  />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                fullWidth
                sx={{width: { sm: '80%'}}}
                label="Código Postal"
                name="state"      
                value={personData?.location?.zip}
              />
            </Grid>
          </Grid>
        </AccordionComponent>
        <AccordionComponent title='Preferencias de empleo' expandedDefault={false}>
          <Grid container spacing={2} mt={3}>
            <Grid size={{ xs: 12, sm: 6}}
              sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: {xs: 'space-between', sm: 'flex-start'}}}
            >
              <Typography variant='h6' component={'h1'} fontWeight={'bold'} color='textPrimary'>
                Vehículo propio
              </Typography>
              <Switch
                id='hasCar'
                name='hasCar'
                checked={hasCar ?? false}
                onChange={() => setHasCar(!hasCar)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}
              sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: {xs: 'space-between', sm: 'flex-start'}}}
            >
              <Typography variant='h6' component={'h1'} fontWeight={'bold'} color='textPrimary'>
                Disponible para reubicación
              </Typography>
              <Switch
                id='relocateOption'
                name='relocateOption'
                checked={relocateOption ?? false}
                onChange={() => setRelocateOption(!relocateOption)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Grid>
          </Grid>
        </AccordionComponent>
      </Grid>
    </Box>
  )
}

export default AccountUserComponent;


