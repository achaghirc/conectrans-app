import { State } from '@/lib/definitions';
import { EncoderType, OfferDTO } from '@prisma/client'
import React from 'react'
import { Control, UseFormSetValue } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import { ControllerSelectFieldComponent, ControllerSelectMultiFieldComponent } from '@/app/ui/shared/custom/components/form/ControllersReactHForm';
import { Box } from '@mui/material';

type OfferRequirementsStepProps = {
  control: Control<Partial<OfferDTO>>;
  formState: State;
  encoders: EncoderType[] | undefined;
  offer?: OfferDTO;
  setValue: UseFormSetValue<Partial<OfferDTO>>;
}

const OfferRequirementsStep: React.FC<OfferRequirementsStepProps> = (
  { control, formState, encoders, offer, setValue }
) => {
  return (
    <Box
      sx={{ 
        minWidth: '100%', 
        width: '100%' 
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ControllerSelectMultiFieldComponent
            label='Carnet necesario (multiple)'
            name='licenseType'
            control={control}
            value={offer?.licenseType?.map(license => license.name) ?? []}
            formState={formState}
            options={encoders?.filter(encoder => encoder.type === 'CARNET').map(encoder => ({value: encoder.code, label: encoder.name, id: encoder.id.toString()})) ?? []}
            />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ControllerSelectMultiFieldComponent
            label='Carnet ADR necesario'
            name='licenseAdr'
            control={control}
            value={offer?.licenseAdr?.map(license => license.name) ?? []}
            formState={formState}
            options={encoders?.filter(encoder => encoder.type === 'CARNET_ADR').map(encoder => ({value: encoder.code, label: encoder.name, id: encoder.id.toString()})) ?? []}
            />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ControllerSelectMultiFieldComponent
            label='Ámbito de trabajo'
            name='workRange'
            control={control}
            value={offer?.workRange?.map(workRange => workRange.name) ?? []}
            formState={formState}
            options={encoders?.filter(encoder => encoder.type === 'WORK_SCOPE').map(encoder => ({value: encoder.code, label: encoder.name, id: encoder.id.toString()})) ?? []}
            />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ControllerSelectFieldComponent
            label='Certificado CAP'
            name='capCertification'
            control={control}
            value={offer?.capCertification === true ? 'YES' : 'NO'}
            formState={formState}
            options={[
              {value: 'YES', label: 'Si', id: 'YES'},
              {value: 'NO', label: 'No', id: 'NO'}
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ControllerSelectFieldComponent
            label='Tacógrafo Digital'
            name='digitalTachograph'
            control={control}
            value={offer?.digitalTachograph === true ? 'YES' : 'NO'}
            formState={formState}
            options={[
              {value: 'YES', label: 'Si', id: 'YES'},
              {value: 'NO', label: 'No', id: 'NO'}
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ControllerSelectFieldComponent
            label='Oferta Anónima'
            name='isAnonymous'
            control={control}
            value={offer?.isAnonymous === true ? 'YES' : 'NO'}
            formState={formState}
            options={[
              {value: 'YES', label: 'Si', id: 'YES'},
              {value: 'NO', label: 'No', id: 'NO'}
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default OfferRequirementsStep
