import { ControllerSelectFieldComponent, ControllerSelectFieldOptions, ControllerSelectMultiFieldComponent, ControllerTextFieldComponent } from "@/app/ui/shared/custom/components/form/ControllersReactHForm";
import { State } from "@/lib/definitions";
import { EncoderType, Offer, OfferDTO } from "@prisma/client";
import React, { useEffect, useLayoutEffect } from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import Grid from "@mui/material/Grid2";
import { DateMobilePickerComponent, DatePickerComponent } from "@/app/ui/shared/custom/components/datePickerCustom";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";
import useUtilsHook from "@/app/ui/shared/hooks/useUtils";
import { MAX_WORDS_DESCRIPTION_500 } from "@/lib/constants";
import useMediaQueryData from "@/app/ui/shared/hooks/useMediaQueryData";

type OfferInformationStepProps = {
  control: Control<Partial<Offer>>;
  formState: State;
  encoders: EncoderType[] | undefined;
  offer?: OfferDTO;
  watch: UseFormWatch<Partial<OfferDTO>>;
  setValue: UseFormSetValue<Partial<OfferDTO & { startDate: Date; endDate: Date }>>;
}



const OfferInformationStep: React.FC<OfferInformationStepProps> = (
  { control, formState, encoders, offer, watch, setValue}
) => {
  const { handleZodError, handleZodHelperText, countWords } = useUtilsHook();
  const { mediaQuery } = useMediaQueryData();
  useEffect(() => {
    if(watch('startDate') === undefined ){
      if(offer?.startDate) 
        setValue('startDate', dayjs(offer.startDate).toDate());
      else 
        setValue('startDate', dayjs(new Date()).toDate());
    }
    if (watch('endDate') === undefined) {
      if(offer?.endDate) 
        setValue('endDate', dayjs(offer.endDate).toDate());
      else 
        setValue('endDate', dayjs(new Date()).toDate());
    }
  }, [])

  return (
    <Grid container spacing={2}>
      {/* //hidden id */}
      <Grid size={{ xs: 12, md: 6 }} style={{ display: 'none' }}>
        <ControllerTextFieldComponent
          label="ID"
          name="id"
          control={control}
          value={offer?.id.toString() ?? '0'}
          formState={formState}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerTextFieldComponent
          label="Título"
          name="title"
          control={control}
          value={offer?.title ?? ''}
          formState={formState}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerTextFieldComponent
          label="Subtitulo"
          name="subtitle"
          control={control}
          value={offer?.subtitle ?? ''}
          formState={formState}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {mediaQuery ? (
          <DatePickerComponent
            label="Fecha de inicio"
            name="startDate"
            value={watch('startDate') ? dayjs(watch('startDate')) : dayjs(new Date())}
            setValue={(value) => setValue('startDate', value ? value.toDate() : undefined)}
            errors={formState}
          />
        ) : (
          <DateMobilePickerComponent
            label="Fecha de inicio"
            name="startDate"
            value={watch('startDate') ? dayjs(watch('startDate')) : dayjs(new Date())}
            setValue={(value) => setValue('startDate', value ? value.toDate() : undefined)}
            errors={formState}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {mediaQuery ? (
          <DatePickerComponent
            label="Fecha límite"
            name="endDate"
            value={watch('endDate') ? dayjs(watch('endDate')) : dayjs(new Date())}
            setValue={(value) => setValue('endDate', value ? value.toDate() : undefined)}
            errors={formState}
          />
        ) : (
          <DateMobilePickerComponent
            label="Fecha límite"
            name="endDate"
            value={watch('endDate') ? dayjs(watch('endDate')) : dayjs(new Date())}
            setValue={(value) => setValue('endDate', value ? value.toDate() : undefined)}
            errors={formState}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerTextFieldComponent
          label="Salario / Banda salarial"
          name="salary"
          control={control}
          value={offer?.salary ?? ''}
          formState={formState}
          placeholder="20.000€ - 30.000€ brutos anuales (según valía)"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerSelectMultiFieldComponent
          label='Tipo de empleo'
          name='employmentType'
          control={control}
          value={offer?.employmentType.map(employmentType => employmentType.name) ?? []}
          formState={formState}
          options={encoders?.filter(encoder => encoder.type === 'EMPLOYEE_TYPE').map(encoder => ({value: encoder.code, label: encoder.name, id: encoder.id.toString()})) ?? []}
          />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerSelectFieldComponent
          label="Tipo de Contrato"
          name="contractType"
          control={control}
          value={offer?.contractType ?? ''}
          formState={formState}
          placeholder="Indefinido, Temporal, Prácticas..."
          options={[
            {value: 'Indefinido', label: 'INDEFINIDO', id: 'INDEFINIDO'} as ControllerSelectFieldOptions,
            {value: 'Temporal', label: 'TEMPORAL', id: 'TEMPORAL'} as ControllerSelectFieldOptions,
            {value: 'Prácticas', label: 'PRACTICAS', id: 'PRACTICAS'} as ControllerSelectFieldOptions,
          ]}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControllerSelectFieldComponent
          label="Jornada"
          name="workDay"
          control={control}
          value={offer?.workDay ?? ''}
          formState={formState}
          placeholder="Completa, Parcial."
          options={[
            {value: 'Completa', label: 'COMPLETA', id: 'COMPLETA'} as ControllerSelectFieldOptions,
            {value: 'Parcial', label: 'PARCIAL', id: 'PARCIAL'} as ControllerSelectFieldOptions,
          ]}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ControllerTextFieldComponent
          label="Descripción"
          name="description"
          control={control}
          value={offer?.description ?? ''}
          formState={formState}
          placeholder="Descripción de la oferta"
          multiline
          rows={6}
        />
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="body1"></Typography>
          <Typography variant="body2" color={countWords(watch('description') ?? '') > MAX_WORDS_DESCRIPTION_500 ? 'error' : 'textSecondary'}>
            {`${countWords(watch('description') ?? '')} / ${MAX_WORDS_DESCRIPTION_500} words`}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default OfferInformationStep