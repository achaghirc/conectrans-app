import { Province, State } from '@/lib/definitions';
import { OfferDTO } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import { ControllerSelectFieldComponent, ControllerTextFieldComponent } from '@/app/ui/shared/custom/components/form/ControllersReactHForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const selectedCountry = offer?.location.countryId ?? 64;
  
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
    setValue('location.countryId', selectedCountry.toString() as unknown as never);
    populateProvinces(selectedCountry);
  }, []);

  const extraChangeFunction = (event: any) => {
    const { name, value } = event.target;
    if (name === 'location.countryId') {
      const countryId = countries?.find(country => country.name_es === value)?.id;
      if(countryId != undefined && selectedCountry !== countryId) {
        setValue('location.state', '' as unknown as never);
        populateProvinces(countryId);
      }
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerTextFieldComponent
          label="Dirección"
          name="location.street"
          control={control}
          value={offer?.location.street ?? ''}
          placeholder='Avenida Marqúes de paradas'
          formState={formState}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerTextFieldComponent
          label="Número"
          name="location.number"
          control={control}
          value={offer?.location.number ?? ''}
          placeholder='13, 2º'
          formState={formState}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerSelectFieldComponent
          label='País'
          name='location.countryId'
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
            name="location.state"
            control={control}
            value={offer?.location.state ?? ''}
            formState={formState}    
          />
        ) : (
          <ControllerSelectFieldComponent
            label="Provincia"
            name="location.state"
            control={control}
            value={offer?.location.state ?? ''}
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
          name="location.city"
          control={control}
          value={offer?.location.city ?? ''}
          formState={formState}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerTextFieldComponent
          label="Código Postal"
          name="location.zip"
          control={control}
          value={offer?.location.zip ?? ''}
          formState={formState}
        />
      </Grid>
    </Grid>
  );
}

export default OfferLocationStep;
