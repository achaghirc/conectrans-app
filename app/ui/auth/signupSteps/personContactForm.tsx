import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import  Grid from '@mui/material/Grid2';
import { State } from '@/lib/actions';

interface PersonContactFormProps {
  formData: {
    nombre: string;
    apellidos: string;
    cargo: string;
    telefono: string;
    email: string;
  };
  errors: State;
  setFormData: (data: any) => void;
  
}

export default function PersonContactForm({ formData, errors, setFormData }: PersonContactFormProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ personaContacto: { ...formData, [name]: value } });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('nombre'))}
          helperText={errors.errors?.some((el) => el.path.includes('nombre')) ? errors.errors?.filter((el) => el.path.includes('nombre'))[0].message : ''}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Apellidos"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('apellidos'))}
          helperText={errors.errors?.some((el) => el.path.includes('apellidos')) ? errors.errors?.filter((el) => el.path.includes('apellidos'))[0].message : ''}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Cargo en la Empresa"
          name="cargo"
          value={formData.cargo}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('cargo'))}
          helperText={errors.errors?.some((el) => el.path.includes('cargo')) ? errors.errors?.filter((el) => el.path.includes('cargo'))[0].message : ''}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('telefono'))}
          helperText={errors.errors?.some((el) => el.path.includes('telefono')) ? errors.errors?.filter((el) => el.path.includes('telefono'))[0].message : ''}
          required
        />
      </Grid>
      <Grid size={{xs: 12}}>
        <TextField
          fullWidth
          label="Correo Electrónico"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('email'))}
          helperText={errors.errors?.some((el) => el.path.includes('email')) ? errors.errors?.filter((el) => el.path.includes('email'))[0].message : ''}
          required
        />
      </Grid>
    </Grid>
  );
}