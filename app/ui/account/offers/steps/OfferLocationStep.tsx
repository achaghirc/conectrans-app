import { Province, State } from '@/lib/definitions';
import { OfferDTO } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import { ControllerSelectFieldComponent, ControllerTextFieldComponent } from '@/app/ui/shared/custom/components/form/ControllersReactHForm';
import { useQuery } from '@tanstack/react-query';
import { getCountries, getProvincesByCountryId } from '@/lib/data/geolocate';
import { set } from 'zod';

type OfferLocationStepProps = {
  control: Control<Partial<OfferDTO>>;
  offer?: OfferDTO;
  setValue: UseFormSetValue<Partial<OfferDTO>>;
  formState: State;
}


const OfferLocationStep: React.FC<OfferLocationStepProps> = (
  { control, offer, setValue, formState }
) => {
  const selectedCountry = offer?.Location.countryId ?? 64;
  
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isProvincesLoading, setIsProvincesLoading] = useState<boolean>(false);
  const {data: countries, isLoading: isCountriesLoading} = useQuery({
    queryKey: ['countries'], 
    queryFn: getCountries
  });

  const populateProvinces = async (countryId: number) => {
    setIsProvincesLoading(true);
    const provinces = await getProvincesByCountryId(countryId);
    if(provinces == undefined) 
      setProvinces([]);
    else
      setProvinces(provinces);
    setIsProvincesLoading(false);
  }

  useEffect(() => {
    if (selectedCountry == undefined) return;
    setValue('Location.countryId', selectedCountry.toString() as unknown as never);
    populateProvinces(selectedCountry);
  }, []);

  const extraChangeFunction = (event: any) => {
    const { name, value } = event.target;
    if (name === 'Location.countryId') {
      const countryId = countries?.find(country => country.name_es === value)?.id;
      if(countryId != undefined && selectedCountry !== countryId) {
        setValue('Location.state', '' as unknown as never);
        populateProvinces(countryId);
      }
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerTextFieldComponent
          label="Dirección"
          name="Location.street"
          control={control}
          value={offer?.Location.street ?? ''}
          placeholder='Avenida Marqúes de paradas'
          formState={formState}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerTextFieldComponent
          label="Número"
          name="Location.number"
          control={control}
          value={offer?.Location.number ?? ''}
          placeholder='13, 2º'
          formState={formState}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerSelectFieldComponent
          label='País'
          name='Location.countryId'
          control={control}
          value={selectedCountry ? selectedCountry.toString() : ''}
          formState={formState}
          options={countries?.map((country) => ({value: country.name_es ?? '', label: country.id.toString(), id: country.id.toString()}))}
          extraChangeFunction={extraChangeFunction}
          isLoading={isCountriesLoading}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {!isProvincesLoading && (!provinces || provinces.length === 0) ? (
          <ControllerTextFieldComponent
            label="Provincia"
            name="Location.state"
            control={control}
            value={offer?.Location.state ?? ''}
            formState={formState}    
          />
        ) : (
          <ControllerSelectFieldComponent
            label="Provincia"
            name="Location.state"
            control={control}
            value={offer?.Location.state ?? ''}
            formState={formState}
            isLoading={isProvincesLoading}
            options={provinces?.map((province) => ({ value: province.name ?? '', label: province.name, id: province.name}))}
            extraChangeFunction={extraChangeFunction}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerTextFieldComponent
          label="Localidad"
          name="Location.city"
          control={control}
          value={offer?.Location.city ?? ''}
          formState={formState}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerTextFieldComponent
          label="Código Postal"
          name="Location.zip"
          control={control}
          value={offer?.Location.zip ?? ''}
          formState={formState}
        />
      </Grid>
    </Grid>
  );
}

export default OfferLocationStep;
