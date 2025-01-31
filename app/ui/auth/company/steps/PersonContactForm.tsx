import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import  Grid from '@mui/material/Grid2';
import { SignUpCompanyFormData, State } from '@/lib/definitions';
import useUtilsHook from '@/app/ui/shared/hooks/useUtils';
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ControllerTextFieldComponent } from '@/app/ui/shared/custom/components/form/ControllersReactHForm';

interface PersonContactFormProps {
  control: Control<Partial<SignUpCompanyFormData>>;
  register: UseFormRegister<Partial<SignUpCompanyFormData>>;
  watch: UseFormWatch<Partial<SignUpCompanyFormData>>;
  setValue: UseFormSetValue<Partial<SignUpCompanyFormData>>;
  errors: State;
}

export default function PersonContactForm({ 
  control, errors 
}: PersonContactFormProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControllerTextFieldComponent
          control={control}
          label="Nombre"
          name="contactPerson.name"
          formState={errors}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControllerTextFieldComponent
          label="Apellidos"
          name="contactPerson.lastnames"
          control={control}
          formState={errors}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControllerTextFieldComponent
          label="Cargo en la Empresa"
          name="contactPerson.companyPosition"
          control={control}
          formState={errors}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControllerTextFieldComponent
          label="Teléfono"
          name="contactPerson.phoneNumber"
          control={control}
          formState={errors}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ControllerTextFieldComponent
          label="Correo Electrónico"
          name="contactPerson.email"
          control={control}
          formState={errors}
        />
      </Grid>
    </Grid>
  );
}