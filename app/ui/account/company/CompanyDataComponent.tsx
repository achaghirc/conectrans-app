'use client';
import React, { ChangeEvent, useEffect } from 'react'
import { CompanyDTO, State } from '@/lib/definitions';
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid2';
import { getCompanyById, updateCompanyData } from '@/lib/data/company';
import { getCountries, getProvincesByCountryId } from '@/lib/data/geolocate';
import { getActitivies } from '@/lib/data/activity';
import CompanyDataSkeleton from '../../shared/custom/components/skeleton/CompanyDataSkeleton';
import ProvincesInputComponent from '../../shared/custom/components/provincesInputComponent';
import CountryInputComponent from '../../shared/custom/components/countryInputComponent';
import ButtonCustom from '../../shared/custom/components/button/ButtonCustom';
import { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { ERROR_MESSAGE_SNACKBAR_COMPANY, MAX_WORDS_DESCRIPTION, SUCCESS_MESSAGE_SNACKBAR } from '@/lib/constants';
import useUtilsHook from '../../shared/hooks/useUtils';
import { validateCompanyDataUpdate } from '@/lib/validations/companyValidate';
import { MenuProperties } from '../../shared/styles/styles';

export type CompanyDataProps = {
    session: Session | null;
    setSnackbarProps: (snackbarProps: Partial<SnackbarCustomProps>) => void;
}

const createInitialStateChanges = () => ({
  email: false,
  socialName: false,
  name: false,
  cifnif: false,
  phone: false,
  landlinePhone: false,
  locationStreet: false,
  locationCountryId: false,
  locationState: false,
  locationCity: false,
  locationZip: false,
  activityCode: false,
  description: false
})


const CompanyDataComponent: React.FC<CompanyDataProps> = (
  {session, setSnackbarProps}
) => {
  const router = useRouter();
  if(!session) {
    router.push('/');
    return;
  }
  const queryClient = useQueryClient();
  const { handleZodError, handleZodHelperText, countWords} = useUtilsHook();

  const [formState, setFormState] = React.useState<State>({
    message: '',
    errors: []
  });
  const [changedForm, setChangedForm] = React.useState(createInitialStateChanges());
  const [selectedCountry, setSelectedCountry] = React.useState<number>(0);
  const [selectedProvince, setSelectedProvince] = React.useState<string>('');

  const {data: companyData, isLoading: isCompanyLoading, isError: isCompanyError, error: companyError} = useQuery({
    queryKey: ['getCompanyData', session.user.id], 
    queryFn: () => getCompanyById(session.user.companyId ?? 0),
    enabled: !!session?.user.companyId
  });
  
  const {data: countries} = useQuery({
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

  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [companyDataSubmit, setCompanyDataSubmit] = React.useState<CompanyDTO>({} as CompanyDTO);
  const updateCompanyByData = updateCompanyData.bind(null,companyDataSubmit);

  const onAction = async () => {
    try{
      setIsSaving(true);
      const validate: State = await validateCompanyDataUpdate(formState, companyDataSubmit);
      if (validate.errors && validate.errors.length > 0) {
        setFormState(validate);
        setIsSaving(false);
        return;
      } else{
        setFormState({
          message: '',
          errors: []
        });
      }
      const company: CompanyDTO = await updateCompanyByData();
      if(company) {
        setCompanyDataSubmit(company);
        queryClient.refetchQueries({ queryKey: ['getCompanyData', session.user.id] });
        queryClient.refetchQueries({ queryKey: ['companyHeaderData', session.user.companyId] });
        setSnackbarProps({open: true, message: SUCCESS_MESSAGE_SNACKBAR, severity: 'success'});
      } else {
        setSnackbarProps({open: true, message: ERROR_MESSAGE_SNACKBAR_COMPANY, severity: 'error'});
      }
    } catch (error) {
      setSnackbarProps({open: true, message: ERROR_MESSAGE_SNACKBAR_COMPANY, severity: 'error'});
    }
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | number> | any) => {
  
    const { name, value } = e.target;
    if (name === 'locationCountryId') {
      setSelectedCountry(value as number);
    }
    if (name === 'locationState') {
      setSelectedProvince(value as string);
    }
    setChangedForm({...changedForm, [name]: true});
    setCompanyDataSubmit({ ...companyDataSubmit, [name]: value });
  }

  if(isCompanyLoading) {
    return <CompanyDataSkeleton />
  }
  if(isCompanyError) {
    return <Typography variant='h6'>{companyError?.message}</Typography>
  }

  return (
    <form action={onAction}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column'
          }}
        gap={2} 
      >
        <Grid container spacing={2} sx={{ pl: 2, pr: 2}}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              value={companyDataSubmit?.email ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              error={handleZodError(formState, 'email')}
              helperText={handleZodHelperText(formState, 'email')}

            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Nombre Social"
              name="socialName"
              value={companyDataSubmit?.socialName ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              error={handleZodError(formState, 'socialName')}
              helperText={handleZodHelperText(formState, 'socialName')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={companyDataSubmit?.name ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              error={handleZodError(formState, 'name')}
              helperText={handleZodHelperText(formState, 'name')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Cif/Nif"
              name="cifnif"
              value={companyDataSubmit?.cifnif ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              error={handleZodError(formState, 'cifnif')}
              helperText={handleZodHelperText(formState, 'cifnif')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Teléfono móvil"
              name="phone"
              value={companyDataSubmit?.phone ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              error={handleZodError(formState, 'phone')}
              helperText={handleZodHelperText(formState, 'phone')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Teléfono fijo"
              name="landlinePhone"
              value={companyDataSubmit?.landlinePhone ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              error={handleZodError(formState, 'landlinePhone')}
              helperText={handleZodHelperText(formState, 'landlinePhone')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Dirección"
              name="locationStreet"
              value={companyDataSubmit?.locationStreet ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              error={handleZodError(formState, 'locationStreet')}
              helperText={handleZodHelperText(formState, 'locationStreet')}
              placeholder='Calle Olivo 12, 3ºA'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CountryInputComponent
              countries={countries}
              inputName='locationCountryId'
              selectedCountry={selectedCountry ?? 64}
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
              value={companyDataSubmit?.locationCity ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              error={handleZodError(formState, 'locationCity')}
              helperText={handleZodHelperText(formState, 'locationCity')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Código Postal"
              name="locationZip"
              value={companyDataSubmit?.locationZip ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              error={handleZodError(formState, 'locationZip')}
              helperText={handleZodHelperText(formState, 'locationZip')}
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
                  error={handleZodError(formState, 'activityCode')}
                  MenuProps={MenuProperties}	
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
                <FormHelperText>{handleZodHelperText(formState, 'activityCode')}</FormHelperText>
              </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={companyDataSubmit.description}
              onChange={handleInputChange}
              multiline
              rows={6}
              error={handleZodError(formState, 'description')}
              helperText={handleZodHelperText(formState, 'description')}
              required
            />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1"></Typography>
              <Typography variant="body2" color={countWords(companyDataSubmit.description) > MAX_WORDS_DESCRIPTION ? 'error' : 'textSecondary'}>
                {`${countWords(companyDataSubmit.description)} / ${MAX_WORDS_DESCRIPTION} words`}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          m: 2
        }}>
          <ButtonCustom
            title='Guardar'
            loading={isSaving}
            disable={Object.values(changedForm).every((value) => value === false) ?? false}
            color='secondary'
            onClick={() => setIsSaving(true)}
            type='submit'
          />
        </Box>
      </Box>
    </form>
  )
}

export default CompanyDataComponent;

