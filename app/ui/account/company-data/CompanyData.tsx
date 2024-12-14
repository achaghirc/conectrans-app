'use client';
import React, { ChangeEvent, useEffect } from 'react'
import { CompanyDTO, Country, Province } from '@/lib/definitions';
import { Box, Button, CircularProgress, Divider, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { AddPhotoAlternateOutlined } from '@mui/icons-material';
import { getCompanyByUserId, updateCompanyData } from '@/lib/data/company';
import { getCountries, getProvincesByCountryId } from '@/lib/data/geolocate';
import { getActitivies } from '@/lib/data/activity';
import { set } from 'zod';
import CompanyDataSkeleton from '../../shared/custom/components/skeleton/CompanyDataSkeleton';
import { error } from 'console';
import ProfileComponent from '../../shared/account/ProfileComponent';
import ProvincesInputComponent from '../../shared/custom/components/provincesInputComponent';
import CountryInputComponent from '../../shared/custom/components/countryInputComponent';

export type CompanyDataProps = {
    session: Session | null;

}


const CompanyData: React.FC<CompanyDataProps> = ({session}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = React.useState<number>(0);
  const [selectedProvince, setSelectedProvince] = React.useState<string>('');
  const [companyDataSubmit, setCompanyDataSubmit] = React.useState<CompanyDTO>({} as CompanyDTO);
  
  const updateCompanyByData = updateCompanyData.bind(null,companyDataSubmit);
  
  if(!session) {
    router.push('/');
    return;
  }
  
  const {data: companyData, isLoading: isCompanyLoading, isError: isCompanyError, error: companyError} = useQuery({
    queryKey: ['getCompanyData', session.user.id], 
    queryFn: () => getCompanyByUserId(session.user.id ?? ''),
  });
  
  const {data: countries, isLoading: isCountriesLoading, isError: isCountriesError, error: countriesError} = useQuery({
    queryKey: ['countries'], 
    queryFn: getCountries
  });

  const { data: provincesData, isLoading: isProvincesLoading } = useQuery({
    queryKey: ['provinces', selectedCountry],
    queryFn: () => getProvincesByCountryId(selectedCountry),
    enabled: !!selectedCountry, // Fetch provinces only when a country is selected
  });

  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: getActitivies,
  });

  const onAction = async () => {
    console.log('Submit');
    setIsSaving(true);
    const company: CompanyDTO = await updateCompanyByData();
    console.log(company);
    setCompanyDataSubmit(company);
    queryClient.refetchQueries({ queryKey: ['getCompanyData', session.user.id] });
    queryClient.refetchQueries({queryKey: ['getUserData', session.user.id] });
    setIsSaving(false);
  }

  useEffect(() => {
    if(companyData != undefined) {
      setCompanyDataSubmit(companyData);
    }
    if (companyData?.locationCountryId) {
      setSelectedCountry(companyData.locationCountryId);
    }
    if (companyData?.locationState) {
      setSelectedProvince(companyData.locationState);
    }
  }, [companyData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | number>) => {
  
    const { name, value } = e.target;
    if (name === 'locationCountryId') {
      setSelectedCountry(value as number);
    }
    if (name === 'locationState') {
      setSelectedProvince(value as string);
    }
    setCompanyDataSubmit({ ...companyDataSubmit, [name]: value });
  }

  const getProvincesInput = () => {
    if (provincesData && provincesData.length == 0) {
      return (
        <TextField
          fullWidth
          label="Provincia"
          name="locationState"
          value={selectedProvince}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
          required
        />
      );
    }
    return (
      <FormControl fullWidth>
        <InputLabel>Provincia</InputLabel>
        <Select
          label='Provincia'
          name='locationState'
          value={selectedProvince}
          placeholder={isProvincesLoading ? 'Loading...' : 'Selecciona una provincia'}
          onChange={(e:SelectChangeEvent<string>) => handleInputChange(e)}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
                overflow: 'auto',
              }
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            }
          }}
          sx={{
            textAlign: 'start'
          }}
        > 
          {isProvincesLoading ? (
            <MenuItem disabled>Loading...</MenuItem>
          ) : (
            provincesData && provincesData.map((province) => (
            <MenuItem key={province.id} value={province.cod_iso2}>
              {province.name}
            </MenuItem>
          )))
          }
        </Select>
      </FormControl>
    );
  }

  if (isCompanyLoading || isCountriesLoading || companyDataSubmit == undefined) return <CompanyDataSkeleton />;
  if (isCompanyError || isCountriesError) throw new Error(countriesError?.message + ' ' +companyError?.message);
  
  return (
    <form action={onAction}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column'
          }}
        gap={2} 
      >
        <ProfileComponent assetUrl={companyDataSubmit?.assetUrl} title={companyDataSubmit?.name ?? ''} subtitle={companyDataSubmit?.description ?? ''} />
        <Box margin={3}>
          <Typography variant='body1' component={'h2'} color='textPrimary' fontWeight={'bold'} textAlign={'start'}>
            Datos de la Empresa
          </Typography>
          <Divider />
        </Box>
        <Grid container spacing={2} sx={{ pl: 2, pr: 2}}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              value={companyDataSubmit?.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Nombre Social"
              name="socialName"
              value={companyDataSubmit?.socialName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={companyDataSubmit?.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Cif/Nif"
              name="cifnif"
              value={companyDataSubmit?.cifnif}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Teléfono fijo"
              name="phone"
              value={companyDataSubmit?.phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Dirección"
              name="locationStreet"
              value={companyDataSubmit?.locationStreet}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CountryInputComponent
              countries={countries}
              inputName='locationCountryId'
              selectedCountry={selectedCountry}
              handleInputChange={handleInputChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ProvincesInputComponent
              provincesData={provincesData}
              isProvincesLoading={isProvincesLoading}
              selectedProvince={selectedProvince}
              inputName='locationState'
              handleInputChange={handleInputChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Localidad"
              name="locationCity"
              value={companyDataSubmit?.locationCity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Código Postal"
              name="locationZip"
              value={companyDataSubmit?.locationZip}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth 
                // error={handleZodError(errors, 'country')} 
                required
              >
                <InputLabel aria-label='activityCode'>Tipo de Actividad</InputLabel>
                <Select 
                  label="Tipo de Actividad"
                  id='activityCode'
                  name='activityCode'
                  value={companyDataSubmit?.activityCode ?? ''}
                  onChange={(e: SelectChangeEvent<string>) => handleInputChange(e)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        overflow: 'auto',
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}	
                  sx={{
                    textAlign: 'start'
                  }}
                >
                  <MenuItem value=''>Selecciona una actividad</MenuItem>
                  {activities && activities.map((activity) => (
                    <MenuItem key={activity.id} value={activity.code}>
                      {activity.name}
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>{handleZodHelperText(errors, 'country')}</FormHelperText> */}
              </FormControl>
          </Grid>
        </Grid>
        <Box sx={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          m: 2
        }}>
          <Button 
            endIcon={isSaving ? <CircularProgress color={'success'} size={25} /> : null}
            type='submit' 
            variant='outlined' 
            color='secondary' 
            onClick={() => setIsSaving(true)}
            >
              <Typography>Guardar</Typography>
            </Button>
        </Box>
      </Box>
    </form>
  )
}

export default CompanyData;

