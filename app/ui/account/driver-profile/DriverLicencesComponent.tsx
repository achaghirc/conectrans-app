import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { Autocomplete, Box, Button, CircularProgress, FormControl, Skeleton, SnackbarCloseReason, Switch, TextField, Typography } from '@mui/material';
import { DriverLicenceDTO, DriverProfile, EncoderType } from '@prisma/client';
import { Country, DriverLicenceProfileDTO } from '@/lib/definitions';
import { updateDriverLicences } from '@/lib/data/driver-licence';
import { updateDriverProfile } from '@/lib/data/driver-profile';
import { DriverLicencesComponentSkeleton } from '../../shared/custom/components/skeleton/DriverLicencesSkeleton';
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { SUCCESS_MESSAGE_SNACKBAR } from '@/lib/constants';;

type DriverLicencesComponentProps = {
  countries: Country[] | undefined;
  data: DriverLicenceProfileDTO | undefined;
  encoders: EncoderType[] | undefined;
  saveAction?: () => void;
}
const DriverLicencesComponent: React.FC<DriverLicencesComponentProps> = (
  {data, encoders, countries ,saveAction}
) => {
  if (!data) {
    return <DriverLicencesComponentSkeleton />;
  }
  const [snackbarProps, setSnackbarProps] = React.useState<SnackbarCustomProps>({
    open: false,
    handleClose: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => handleCloseSnackbar(event, reason),
  } as SnackbarCustomProps);

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    setSnackbarProps({...snackbarProps, open: false});
  }

  const [hasCapCertificate, setHasCapCertificate] = React.useState<boolean>(data?.hasCapCertificate ?? false);
  const [hasDigitalTachograph, setHasDigitalTachograph] = React.useState<boolean>(data?.hasDigitalTachograph ?? false);
  const [loading, setLoading] = useState<boolean>(false);
  const [changedData, setChangedData] = useState<boolean>(false);
  const licenceEncoders: EncoderType[] = encoders?.filter((encoder) =>  encoder.type === 'CARNET') ?? [];
  const adrLicencesEncoders: EncoderType[] = encoders?.filter((encoder) => encoder.type === 'CARNET_ADR') ?? [];
  const [driverLicence, setDriverLicence] = useState<DriverLicenceDTO>(data.licences.filter((driverLicence) => driverLicence.LicenceType.type === 'CARNET')[0]);
  const [driverLicenceTypes, setDriverLicenceTypes] = useState<EncoderType[]>(data.licences.filter((driverLicence) => driverLicence.LicenceType.type === 'CARNET').map((el) => el.LicenceType));
  const [driverAdrLicenceTypes, setDriverAdrLicenceTypes] = useState<EncoderType[]>(data.licences.filter((driverLicence) => driverLicence.LicenceType.type === 'CARNET_ADR').map((el) => el.LicenceType)); 
  
  const update = async () => {
    setLoading(true);
    let message = SUCCESS_MESSAGE_SNACKBAR;
    let severity: SnackbarCustomProps['severity'] = 'success';
    
    const newData: DriverProfile = {
      id: data.driverProfileId,
      personId: data.personId,
      hasCapCertification: hasCapCertificate,
      hasDigitalTachograph: hasDigitalTachograph,
    }

    const [driverProfileResult, licenceDataResult] = await Promise.allSettled(
      [updateDriverProfile(newData), updateLicenceData]
    );
    if (driverProfileResult.status === 'rejected' || licenceDataResult.status === 'rejected'){
      message = 'Error actualizando los datos';
      severity = 'error';
    }

    saveAction?.(); 
    setLoading(false);
    setChangedData(false);
    setSnackbarProps({
      ...snackbarProps, 
      open: true,
      message: message,
      severity: severity
    })
  }

  const updateLicenceData = async () => {

    const driverLicences = data.licences;
    const selectedLicences = [...driverLicenceTypes, ...driverAdrLicenceTypes];
    const currentMap = new Map(driverLicences.map((licence:DriverLicenceDTO) => [licence.id, licence]));
    const updatedMap = new Map(selectedLicences.map((licence:EncoderType) => [driverLicences.find((item) => item.LicenceType.code == licence.code)?.id, {
      id: driverLicences.find((item) => item.LicenceType.code == licence.code)?.id ?? undefined,
      driverProfileId: driverLicence.driverProfileId,
      licenceTypeId: licence.id,
      countryId: driverLicence.countryId,
      LicenceType: licence,
      Country: driverLicence.Country,
    } as DriverLicenceDTO]));
    
    const licencesToDelete: DriverLicenceDTO[] = Array.from(currentMap.keys())
      .filter(x => !updatedMap.has(x))
      .map((id) => currentMap.get(id))
      .filter((licence): licence is DriverLicenceDTO => licence !== undefined)
    const licencesToAdd: DriverLicenceDTO[] = Array.from(updatedMap.keys())
      .filter(x => !currentMap.has(x))
      .map((id) => updatedMap.get(id))
      .filter((licence): licence is DriverLicenceDTO => licence !== undefined);

    await updateDriverLicences(licencesToAdd, licencesToDelete);
  }


  return (
    <Grid container spacing={3} p={0}>
      <Grid size={{ xs: 12, sm: 6}}>
        <FormControl fullWidth>
          <Autocomplete
            id="licenceType"
            multiple
            options={licenceEncoders ?? []}
            getOptionLabel={(option) => option.name}
            value={driverLicenceTypes ?? []}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
              {...params}
              sx={{width: {xs: '95%', sm: '100%'}}}
              label="Carnet de conducir"
              name="carnet"
              />
            )}
            onChange={(event, newValue) => {
              if (!newValue) {
                return;
              }
              setDriverLicenceTypes(newValue);
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
              sx={{width: {xs: '95%', sm: '100%'}}}
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
                sx={{width: {xs: '95%', sm: '100%'}}}
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
      <SnackbarCustom {...snackbarProps} />
    </Grid>
  )
}

export default DriverLicencesComponent