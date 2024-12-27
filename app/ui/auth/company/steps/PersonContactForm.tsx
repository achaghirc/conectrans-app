import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import  Grid from '@mui/material/Grid2';
import { SignUpCompanyFormData, State } from '@/lib/definitions';
import useUtilsHook from '@/app/ui/shared/hooks/useUtils';

interface PersonContactFormProps {
  formData: SignUpCompanyFormData;
  errors: State;
  setFormData: (data: any) => void;
  
}

export default function PersonContactForm({ formData, errors, setFormData }: PersonContactFormProps) {
  const { handleZodError, handleZodHelperText } = useUtilsHook();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ contactPerson: { ...formData.contactPerson, [name]: value } });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Nombre"
          name="name"
          value={formData.contactPerson.name}
          onChange={handleInputChange}
          error={handleZodError(errors,'name')}
          helperText={handleZodHelperText(errors,'name')}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Apellidos"
          name="lastnames"
          value={formData.contactPerson.lastnames}
          onChange={handleInputChange}
          error={handleZodError(errors,'lastnames')}
          helperText={handleZodHelperText(errors,'lastnames')}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Cargo en la Empresa"
          name="companyPosition"
          value={formData.contactPerson.companyPosition}
          onChange={handleInputChange}
          error={handleZodError(errors,'companyPosition')}
          helperText={handleZodHelperText(errors,'companyPosition')}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Teléfono"
          name="phoneNumber"
          value={formData.contactPerson.phoneNumber}
          onChange={handleInputChange}
          error={handleZodError(errors,'phoneNumber')}
          helperText={handleZodHelperText(errors,'phoneNumber')}
          required
        />
      </Grid>
      <Grid size={{xs: 12}}>
        <TextField
          fullWidth
          label="Correo Electrónico"
          name="email"
          value={formData.contactPerson.email}
          onChange={handleInputChange}
          error={handleZodError(errors,'email')}
          helperText={handleZodHelperText(errors,'email')}
          required
        />
      </Grid>
    </Grid>
  );
}