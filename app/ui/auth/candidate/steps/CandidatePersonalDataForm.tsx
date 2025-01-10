'use client';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Province, SignUpCandidateFormData, State, ValidationCIFNIFResult } from '@/lib/definitions';
import Grid from '@mui/material/Grid2';
import { SelectChangeEvent } from '@mui/material';
import dayjs from 'dayjs';
import { validateCIFNIFFormat } from '@/lib/actions';
import { DateMobilePickerComponent, DatePickerComponent } from '@/app/ui/shared/custom/components/datePickerCustom';
import { getCountries, getProvincesByCountryId } from '@/lib/data/geolocate';
import useUtilsHook from '@/app/ui/shared/hooks/useUtils';
import { Control, Controller, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import useMediaQueryData from '@/app/ui/shared/hooks/useMediaQueryData';
import { useQuery } from '@tanstack/react-query';
import { ControllerDateTimeMobilePickerComponent, ControllerDateTimePickerComponent, ControllerSelectFieldComponent, ControllerTextFieldComponent } from '@/app/ui/shared/custom/components/form/ControllersReactHForm';

type CadidateUserFormProps = {
  control: Control<Partial<SignUpCandidateFormData>>;
  watch: UseFormWatch<Partial<SignUpCandidateFormData>>;
  register: UseFormRegister<Partial<SignUpCandidateFormData>>;
  setValue: UseFormSetValue<Partial<SignUpCandidateFormData>>;
  formData: SignUpCandidateFormData;
  setFormData: (data: any) => void;
  errors: State;
}


export default function CandidatePersonalDataForm({
  control, watch, register, setValue, formData, errors, setFormData
}: CadidateUserFormProps) {
	const { handleZodError, handleZodHelperText } = useUtilsHook();
  const { mediaQuery } = useMediaQueryData();
	const [cifError, setCifError] = useState<string | null>(null);
	const [provinces, setProvinces] = useState<Province[]>([]);
  
  console.log(watch('birthdate'));

  
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

	const handleInputContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value } = e.target;
		if (name === 'cifnif' && value.length == 0) {
      if (value.length == 0) setCifError(null);
      value = value.toUpperCase();
    }
		setFormData({contactInfo: {...formData.contactInfo, [name]: value }});
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	const handleSelectChange = async (e: SelectChangeEvent<string>) => {
		const { name, value } = e.target;
		let contactInfo = formData.contactInfo;
		//Get provinces of the selected country
		if(name === 'contactInfo.country' && countries) {
			const country = countries.find((country) => country.id === parseInt(value));
			if (country && country.cod_iso2) {
				const provinces: Province[] | undefined = await getProvincesByCountryId(country.id);
				if (provinces == undefined || provinces.length == 0) {
						contactInfo.province = '';
						setProvinces([]);		
				}else {
						setProvinces(provinces);
				}
			}
		}
		setFormData({contactInfo: {...contactInfo, [name]: value }});
	}

	//Validación de CIF/NIF
  const handleCifNifValidation = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
		const valid: ValidationCIFNIFResult | undefined = await validateCIFNIFFormat(value);
    if (valid && valid.valid) {
      setCifError(null);
      setFormData({ company: { ...formData, [name]: value } });
    } else {
      const message = valid?.message || 'El CIF/NIF introducido no es válido';
      setCifError(message);
    }
  }

  const cifnifError = () => {
    if (cifError) {
      return true;
    } else {
      return handleZodError(errors, 'cifnif');
    }
  }

  const cifnifHelperText = () => {
    if (cifError) {
      return cifError;
    } else {
      return handleZodHelperText(errors, 'cifnif');
    }
  }

  const handleDateChange = (e: any) => {
    const { value } = e.target;
    setValue('birthdate', new Date(value) as Date);
  }

	return (
    <>
      <Grid container spacing={2}>
        <Grid size={{xs:12, sm: 6}}>
          <ControllerTextFieldComponent
            control={control}
            value={formData.email}
            label="Nombre"
            name="name"
            formState={errors}
          />
        </Grid>
        <Grid size={{xs:12, sm: 6}}>
          <ControllerTextFieldComponent
            control={control}
            value={formData.lastname}
            label="Apellidos"
            name="lastname"
            formState={errors}
          />
        </Grid>
        <Grid size={{xs:12, sm: 6}}>
          <ControllerTextFieldComponent
            control={control}
            value={formData.cifnif}
            label="CIF/NIF"
            formState={errors}
            {...register('cifnif', { 
              onBlur: (e) => {
                handleCifNifValidation(e);
              },
            })}
            sx={{ 
              '& .MuiInputBase-root': { 
                textTransform: 'uppercase' 
              },
            }}
          />
        </Grid>
        
        <Grid size={{xs:12, sm: 6}}>
          <ControllerTextFieldComponent
            control={control}
            value={formData.contactInfo.streetAddress}
            label="Dirección"
            name="contactInfo.streetAddress"
            formState={errors}
          />
        </Grid>
        <Grid size={{xs:12}}>
          {mediaQuery == null ? null :
            mediaQuery ? (
						<DatePickerComponent 
							label="Fecha de nacimiento"
              name='birthdate'
							value={dayjs(formData.birthdate)} 
							errors={errors}
							setValue={(value) => handleDateChange({target: {name: 'birthdate', value: new Date(value?.format('YYYY-MM-DD') || '')}})} 
              />
            ) : (
						<DateMobilePickerComponent 
							label="Fecha de nacimiento"
                name='birthdate'
                value={dayjs(formData.birthdate)}
                errors={errors}
                setValue={(value) => handleDateChange({target: {name: 'birthdate', value: new Date(value?.format('YYYY-MM-DD') || '')}})} 
              />
            )
          }
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}> 
          <ControllerSelectFieldComponent
            control={control}
            label="País"
            name="contactInfo.country"
            options={countries?.map((country) => ({value: country.name_es ?? '', label: country.id.toString(), id: country.id.toString()}))}
            isLoading={isCountriesLoading}
            extraChangeFunction={handleSelectChange}
            placeholder='Selecciona un país'
            formState={errors}
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
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ControllerTextFieldComponent
            label="Código Postal"
            name="contactInfo.zip"
            control={control}
            formState={errors}    
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ControllerTextFieldComponent
            label="Localidad"
            name="contactInfo.locality"
            control={control}
            formState={errors}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ControllerTextFieldComponent 
            control={control}
            label="Teléfono Móvil"
            name="contactInfo.mobilePhone"
            formState={errors}
          />
        </Grid>
        
      </Grid>
    </>

  )
}

