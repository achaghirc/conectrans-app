import { ChangeEvent } from 'react';
import Grid from '@mui/material/Grid2';
import { SignUpCompanyFormData, State } from '@/lib/definitions';
import { getCountries, getProvincesByCountryId } from '@/lib/data/geolocate';
import { ControllerSelectFieldComponent, ControllerTextFieldComponent } from '@/app/ui/shared/custom/components/form/ControllersReactHForm';
import { useQuery } from '@tanstack/react-query';
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface ContactoFormProps {
  control: Control<Partial<SignUpCompanyFormData>>;
  register: UseFormRegister<Partial<SignUpCompanyFormData>>;
  watch: UseFormWatch<Partial<SignUpCompanyFormData>>;
  setValue: UseFormSetValue<Partial<SignUpCompanyFormData>>;
  errors: State;
}

export default function ContactForm({ 
  control, watch, setValue, errors
  }: ContactoFormProps) {
  
  const {data: countries, isLoading: isCountriesLoading} = useQuery({
    queryKey: ['countries'],
    queryFn: () => getCountries(),
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
  const countryId = watch('contactInfo.country');
  const {data: provincesData, isLoading: isProvincesLoading} = useQuery({
    queryKey: ['provinces', countryId],
    queryFn: () => getProvincesByCountryId(Number(countryId)),
    enabled: countryId !== undefined,
  });
  

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement> | any) => {
    const { name, value } = e.target;
    if(name === 'country') {
			const country = countries && countries.find((country) => country.id === parseInt(value));
			if (country && country.cod_iso2) {
        setValue('contactInfo.country', country.id);
        setValue('contactInfo.province', '');
			}
		}
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <ControllerTextFieldComponent
          control={control}
          label="Dirección"
          name="contactInfo.streetAddress"
          formState={errors}
          placeholder="Dirección"

        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControllerTextFieldComponent
          control={control}
          label="Código Postal"
          name="contactInfo.zip"
          formState={errors}
          placeholder="Código Postal"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControllerSelectFieldComponent
          control={control}
          label="País"
          name="contactInfo.country"
          extraChangeFunction={handleInputChange}
          options={countries?.map((country) => ({value: country.name_es ?? '', label: country.id.toString(), id: country.id.toString()}))}
          isLoading={isCountriesLoading}
          formState={errors}
          placeholder='Selecciona un país'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        {isProvincesLoading || (provincesData && provincesData.length == 0) ? (
          <ControllerTextFieldComponent
            label="Provincia"
            name="contactInfo.province"
            control={control}
            value={watch('contactInfo.province') ?? ''}
            formState={errors}    
          />
				) : (
					<ControllerSelectFieldComponent 
            control={control}
            label="Provincia"
            name="contactInfo.province"
            formState={errors}
            isLoading={isProvincesLoading}
            options={provincesData ? provincesData.map((province) => ({ value: province.name ?? '', label: province.name, id: province.name})) : []}
            extraChangeFunction={handleInputChange}
          />
				)}
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControllerTextFieldComponent
          control={control}
          label="Localidad"
          name="contactInfo.locality"
          formState={errors}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControllerTextFieldComponent 
          placeholder="Teléfono Móvil"
          label="Teléfono Móvil"
          name="contactInfo.mobilePhone"
          formState={errors}
          control={control}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControllerTextFieldComponent 
          placeholder="Teléfono Fijo"
          label="Teléfono Fijo"
          name="contactInfo.landlinePhone"
          formState={errors}
          control={control}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ControllerTextFieldComponent 
          placeholder="www.ejemplo.com"
          label="Sitio Web"
          name="contactInfo.website"
          formState={errors}
          control={control}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ControllerTextFieldComponent
          label='Correo Electrónico de Contacto'
          name='contactInfo.contactEmail'
          control={control}
          formState={errors}
          placeholder='email@gmail.com'
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ControllerTextFieldComponent
          label='Descripción'
          name='contactInfo.description'
          control={control}
          formState={errors}
          placeholder='Descripción de la empresa'
          rows={4}
          multiline
        />
      </Grid>
    </Grid>
  );
}