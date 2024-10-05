import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import  Grid from '@mui/material/Grid2';

interface PersonContactFormProps {
  formData: {
    nombre: string;
    apellidos: string;
    cargo: string;
    telefono: string;
    email: string;
  };
  setFormData: (data: any) => void;
}

export default function PersonContactForm({ formData, setFormData }: PersonContactFormProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ personaContacto: { ...formData, [name]: value } });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 6 }}>
        <TextField
          fullWidth
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField
          fullWidth
          label="Apellidos"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField
          fullWidth
          label="Cargo en la Empresa"
          name="cargo"
          value={formData.cargo}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField
          fullWidth
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid size={{xs: 12}}>
        <TextField
          fullWidth
          label="Correo Electrónico"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </Grid>
    </Grid>
  );
}