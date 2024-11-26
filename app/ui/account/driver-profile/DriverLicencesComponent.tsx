import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { Autocomplete, Button, CircularProgress, FormControl, Switch, TextField, Typography } from '@mui/material';
import { DriverLicenceDTO, DriverProfile, EncoderType } from '@prisma/client';
import { Country, DriverLicenceProfileDTO } from '@/lib/definitions';
import { updateDriverLicences } from '@/lib/data/driver-licence';
import { updateDriverProfile } from '@/lib/data/driver-profile';

type DriverLicencesComponentProps = {
  countries: Country[] | undefined;
  data: DriverLicenceProfileDTO | undefined;
  encoders: EncoderType[] | undefined;
  saveAction?: () => void;
}
const licenceEncoderTypes = ['CARNET', 'CARNET_ADR'];
const DriverLicencesComponent: React.FC<DriverLicencesComponentProps> = (
  {data, encoders, countries ,saveAction}
) => {
  const [hasCapCertificate, setHasCapCertificate] = React.useState<boolean>(data?.hasCapCertificate ?? false);
  const [hasDigitalTachograph, setHasDigitalTachograph] = React.useState<boolean>(data?.hasDigitalTachograph ?? false);
  if (!data) {
    return null;
  }
  const [loading, setLoading] = useState<boolean>(false);
  const [changedData, setChangedData] = useState<boolean>(false);
  const licenceEncoders: EncoderType[] = encoders?.filter((encoder) =>  encoder.type === 'CARNET') ?? [];
  const adrLicencesEncoders: EncoderType[] = encoders?.filter((encoder) => encoder.type === 'CARNET_ADR') ?? [];
  const [driverLicence, setDriverLicence] = useState<DriverLicenceDTO>(data.licences.filter((driverLicence) => driverLicence.LicenceType.type === 'CARNET')[0]);
  const [driverAdrLicenceTypes, setDriverAdrLicenceTypes] = useState<EncoderType[]>(data.licences.filter((driverLicence) => driverLicence.LicenceType.type === 'CARNET_ADR').map((el) => el.LicenceType)); 
  
  const update = async () => {
    setLoading(true);
    const newData: DriverProfile = {
      id: data.driverProfileId,
      personId: data.personId,
      hasCapCertification: hasCapCertificate,
      hasDigitalTachograph: hasDigitalTachograph,
    }
    await updateDriverProfile(newData);
    await updateLicenceData();
    saveAction && saveAction(); 
    setLoading(false);
  }

  const updateLicenceData = async () => {
    const licencesDelete: DriverLicenceDTO[] = [];
    const licences = [];
    if (driverLicence) {
      licences.push(driverLicence);
    }
    
    const driverAdrLicences = data.licences.filter((driverLicence) => driverLicence.LicenceType.type === 'CARNET_ADR');
    driverAdrLicences.forEach((el, index) => {
      if(!driverAdrLicenceTypes.find((adr) => adr.id === el.LicenceType.id)) {
        licencesDelete.push(el);
      } else if (driverAdrLicenceTypes.find((adr) => adr.id === el.LicenceType.id)) {
        licences.push(el);
      }
    });
    driverAdrLicenceTypes.forEach((el, index) => {
      if(!driverAdrLicences.find((adr) => adr.LicenceType.id === el.id)) {
        const newLicence: DriverLicenceDTO = {
          id: undefined,
          driverProfileId: driverLicence.driverProfileId,
          licenceTypeId: el.id,
          countryId: driverLicence.countryId,
          LicenceType: el,
          Country: driverLicence.Country,
        }
        licences.push(newLicence);
      }
    })
    await updateDriverLicences(licences, licencesDelete);
  }


  return (
    <Grid container spacing={4} p={1}>
      <Grid size={{ xs: 12, sm: 6}}>
        <FormControl fullWidth>
          <Autocomplete
            id="licenceType"
            options={licenceEncoders ?? []}
            getOptionLabel={(option) => option.name}
            value={driverLicence.LicenceType ?? null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
              {...params}
              sx={{width: {xs: '95%', sm: '80%'}}}
              label="Carnet de conducir"
              name="carnet"
              />
            )}
            onChange={(event, newValue) => {
              if (!newValue) {
                return;
              }
              setDriverLicence({...driverLicence, LicenceType: newValue, licenceTypeId: newValue.id});
              setChangedData(true);
            }}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}>
        <FormControl fullWidth>
          <Autocomplete
            id="country"
            options={countries ?? []}
            getOptionLabel={(option) => option.name_es + ' (' + option.cod_iso2 + ')'}
            value={driverLicence.Country ?? []}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
              {...params}
              sx={{width: {xs: '95%', sm: '90%'}}}
              label="Carnet ADR"
              name="adrCode"
              />
            )}
            onChange={(event, newValue) => {
              event.preventDefault();
              if (!newValue) {
                return;
              }
              setDriverLicence({...driverLicence, Country: newValue, countryId: newValue.id});
              // Update the adr driver licences to the new country
              driverAdrLicenceTypes.forEach((el, index) => {
                setDriverAdrLicenceTypes((prev) => {
                  const newAdrLicences = prev.map((el) => {
                    return {
                      ...el,
                      countryId: newValue.id
                    }
                  });
                  return newAdrLicences;
                });
              });
              setChangedData(true);
            }}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 12}}>
        <FormControl fullWidth>
            <Autocomplete
              id="licenceType"
              multiple
              options={adrLicencesEncoders ?? []}
              getOptionLabel={(option) => option.name}
              value={driverAdrLicenceTypes ?? []}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                {...params}
                sx={{width: {xs: '95%', sm: '90%'}}}
                label="Carnet ADR"
                name="adrCode"
                />
              )}
              onChange={(event, newValue) => {
                event.preventDefault();
                if (!newValue) {
                  return;
                }
                setChangedData(true);
                setDriverAdrLicenceTypes(newValue);
              }}
            />
          </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}
        sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: {xs: 'space-between', sm: 'flex-start'}}}
      >
        <Typography variant='h6' component={'h1'} sx={{ fontWeight: 700, fontSize: 16 }} color='textPrimary'>
          Certificado CAP
        </Typography>
        <Switch
          id='hasCapCertificate'
          name='hasCapCertificate'
          checked={hasCapCertificate ?? false}
          onChange={() => {
            setHasCapCertificate(!hasCapCertificate);
            setChangedData(true);
          }}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}
        sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: {xs: 'space-between', sm: 'flex-start'}}}
      >
        <Typography variant='h6' component={'h1'} sx={{ fontWeight: 700, fontSize: 16 }} color='textPrimary'>
          Tacógrafo digital
        </Typography>
        <Switch
          id='hasDigitalTachograph'
          name='hasDigitalTachograph'
          checked={hasDigitalTachograph ?? false}
          onChange={() => {
            setHasDigitalTachograph(!hasDigitalTachograph);
            setChangedData(true);
          }}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </Grid>
      <Grid size={{ xs: 12 }} display={'flex'} justifyContent={'flex-end'}>
        <Button 
          endIcon={loading ? <CircularProgress size={20} /> : null}
          variant='outlined' 
          color='secondary' 
          onClick={update} 
          disabled={!changedData}
        >
          Guardar
        </Button>
      </Grid>
    </Grid>
  )
}

export default DriverLicencesComponent
