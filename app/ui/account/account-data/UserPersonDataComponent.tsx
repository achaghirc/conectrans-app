import React, { ChangeEvent, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { AccountForm, Country, LocationDTO, PersonDTO, Province } from '@/lib/definitions';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
// import ProvincesInputComponent, { ProvincesInputComponentProps } from '../../shared/custom/components/provincesInputComponent';
import { DatePickerComponent } from '../../shared/custom/components/datePickerCustom';
import CountryInputComponent from '../../shared/custom/components/countryInputComponent';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import ButtonCustom from '../../shared/custom/components/button/ButtonCustom';
import { useForm, SubmitHandler } from "react-hook-form"
import { getCountries, getGeolocationData, getProvincesByCountryId } from '@/lib/data/geolocate';
import { useQuery } from '@tanstack/react-query';
import { updatePerson } from '@/lib/data/person';
import { updateLocation } from '@/lib/data/location';
import { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { count } from 'console';
import { set } from 'zod';
import ProvincesInputComponent from '../../shared/custom/components/provincesInputComponent';

dayjs.locale('es');


type UserPersonDataComponentProps = {
  personData: PersonDTO;
  setSnackbarProps?: (props: Partial<SnackbarCustomProps>) => void;
  handleChange?: (e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | number>) => void;
}

type ChangetPersonForm = {
  name: boolean;
  lastname: boolean;
  document: boolean;
  birthdate: boolean;
  landlinePhone: boolean;
  hasCar: boolean;
  relocateOption: boolean;
}
type changedLocationForm = {
  countryId: boolean;
  state: boolean;
  city: boolean;
  zip: boolean;
  street: boolean;
}
const createInitialFormState = (): ChangetPersonForm => ({
  name: false,
  lastname: false,
  document: false,
  birthdate: false,
  landlinePhone: false,
  hasCar: false,
  relocateOption: false,
});
const createInitialLocationFormState = (): changedLocationForm => ({
  countryId: false,
  state: false,
  city: false,
  zip: false,
  street: false,
});
const createInitialPersonData = (): PersonDTO => ({
  name: '',
  lastname: '',
  document: '',
  birthdate: new Date(),
  landlinePhone: '',
  hasCar: false,
  relocateOption: false,
} as PersonDTO);
const createLocationData = (): LocationDTO => ({
  countryId: 64,
  state: '',
  city: '',
  zip: '',
  street: '',
} as LocationDTO);

const UserPersonDataComponent: React.FC<UserPersonDataComponentProps> = (
  {personData, setSnackbarProps}
) => {
  const [selectedCountry, setSelectedCountry] = React.useState<number>(0);
  const [selectedProvince, setSelectedProvince] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  
  const {data: countries, isLoading: isCountriesLoading, isError: isCountriesError, error: countriesError} = useQuery({
    queryKey: ['countries'], 
    queryFn: getCountries
  });

  const { data: provinces, isLoading: isProvincesLoading } = useQuery({
    queryKey: ['provinces', selectedCountry],
    queryFn: () => getProvincesByCountryId(selectedCountry),
    enabled: !!selectedCountry, // Fetch provinces only when a country is selected
  });
  
  const [changedForm, setChangedForm] = React.useState<ChangetPersonForm>(createInitialFormState());
  const [changedLocationForm, setChangedLocationForm] = React.useState<changedLocationForm>(createInitialLocationFormState());
  const [data, setData] = React.useState<PersonDTO>(personData ?? createInitialPersonData());
  const [location, setLocacation] = React.useState<LocationDTO>(personData?.location ?? createLocationData());

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'birthdate') {
      setData({...data, [name]: new Date(value)});
      return;
    }
    setData({...data, [name]: value});
    setChangedForm({...changedForm, [name]: true});
  }

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocacation({...location, [name]: value});
    setChangedLocationForm({...changedLocationForm, [name]: true});
  }


  useEffect(() => {
    if (!personData) return;
    setData(personData);
    if(personData.location){
      setLocacation(personData.location);
      if (personData.location.countryId) {
        setSelectedCountry(personData.location.countryId);
      }
      if (personData.location.state) {
        setSelectedProvince(personData.location.state);
      }
    }
  },[personData]);

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | number>) => {
    const { name, value } = e.target;
    if (name === 'country') {
      setSelectedCountry(value as number);
      setChangedLocationForm({...changedLocationForm, ["countryId"]: true});
      setLocacation({...location, countryId: value as number});
      return;
    }
    if (name === 'state') {
      setSelectedProvince(value as string);
      setChangedLocationForm({...changedLocationForm, [name]: true});
      setLocacation({...location, state: value as string});
      return;
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    const locationSave = {...data.location, 
      ...location, 
      id: location.id ?? 0,
      countryId: selectedCountry,
      state: selectedProvince,
      createdAt: location.createdAt ?? new Date(), 
      updatedAt: new Date()};
    data.location = locationSave as LocationDTO;
    //Save person and location data
    const personUpdated = Object.values(changedForm).some(value => value === true);
    const locationUpdated = Object.values(changedLocationForm).some(value => value === true);
    const [ personResult, locationResult ] = await Promise.allSettled([
      personUpdated ? updatePerson(data) : Promise.resolve({status: 'fulfilled'}),
      locationUpdated ? updateLocation(locationSave) : Promise.resolve({status: 'fulfilled'}),
    ])

    if(personResult.status === 'rejected' || locationResult.status === 'rejected'){
      console.error('Error saving person or location data or person data');
      setLoading(false);
      setSnackbarProps && setSnackbarProps({open: true, message: 'Se ha producido un error al guardar los datos', severity: 'error'});
      return;
    }
    if(personResult.status === 'fulfilled' && locationResult.status === 'fulfilled'){
      console.log('Datos guardados correctamente');
      setSnackbarProps && setSnackbarProps({open: true, message: 'Datos guardados correctamente', severity: 'success'});
      setLoading(false);
    }
  }

  return (
    <Grid container spacing={2} mt={3}>
      <Grid size={{ xs: 12, sm: 6}}>
        <TextField
          fullWidth
          sx={{width: { sm: '80%'}}}
          label="Name"
          name="name"
          value={data.name ?? ''}
          onChange={handleFormChange}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}>
        <TextField
          fullWidth
          sx={{width: { sm: '80%'}}}
          label="Apellidos"
          name="lastname"      
          value={data.lastname ?? ''}
          onChange={handleFormChange}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}>
        <TextField
          fullWidth
          label="DNI/NIE"
          name="document"      
          value={data.document ?? ''}
          onChange={handleFormChange}
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
          value={dayjs(data.birthdate ?? '')}
          errors={{}}
          width={{ sm: '80%'}}
          setValue={() => {}}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}>
        <TextField
          fullWidth
          sx={{width: { sm: '80%'}}}
          label="Teléfono Móvil"
          name="phone"    
          value={data.phone ?? ''}
          onChange={handleFormChange}
          placeholder='640493049'  
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}>
        <TextField
          fullWidth
          sx={{width: { sm: '80%'}}}
          label="Dirección"
          name="street"      
          value={location.street}
          placeholder='Calle Olivo 12, 3ºA'
          onChange={handleLocationChange}
          helperText='El formato debe cumplir por ejemplo Calle Olivo 12, 3ºA'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}>
        <TextField
          fullWidth
          sx={{width: { sm: '80%'}}}
          label="Localidad"
          name="city"   
          placeholder='Zalamea de la Serena'   
          value={location.city}
          onChange={handleLocationChange}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}>
        <Box
          sx={{width: { sm: '80%'}}}
        >
          <CountryInputComponent
            countries={countries ?? []}
            inputName='country'
            selectedCountry={selectedCountry}
            handleInputChange={handleInputChange}
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}>
        <Box sx={{width: { sm: '80%'}}}>
          <ProvincesInputComponent
            provincesData={provinces ?? []}
            inputName='state'
            selectedProvince={selectedProvince}
            isProvincesLoading={isProvincesLoading}
            handleInputChange={handleInputChange}
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}>
        <TextField
          fullWidth
          sx={{width: { sm: '80%'}}}
          label="Código Postal"
          name="zip"      
          value={location.zip}
          onChange={handleLocationChange}
        />
      </Grid>
      <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end'}}>
        <ButtonCustom 
          title='Guardar'
          loading={loading}
          color='secondary'
          onClick={handleSubmit}
          disable={Object.values(changedForm).every(value => value === false) && Object.values(changedLocationForm).every(value => value === false)}
          type='submit'
        />
      </Grid>
    </Grid>
  );

}

export default UserPersonDataComponent;