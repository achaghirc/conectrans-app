import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import Grid from '@mui/material/Grid2';

interface ContactoFormProps {
  formData: {
    direccion: string;
    codigoPostal: string;
    pais: string;
    provincia: string;
    localidad: string;
    telefonoMovil: string;
    telefonoFijo: string;
    sitioWeb: string;
    emailContacto: string;
    descripcion: string;
  };
  setFormData: (data: any) => void;
}

export default function ContactForm({ formData, setFormData }: ContactoFormProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ contacto: { ...formData, [name]: value } });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Dirección"
          name="direccion"
          value={formData.direccion}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField
          fullWidth
          label="Código Postal"
          name="codigoPostal"
          value={formData.codigoPostal}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField
          fullWidth
          label="País"
          name="pais"
          value={formData.pais}
          onChange={handleInputChange}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="Provincia"
            name="provincia"
            value={formData.provincia}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="Localidad"
            name="localidad"
            value={formData.localidad}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="Teléfono Móvil"
            name="telefonoMovil"
            value={formData.telefonoMovil}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="Teléfono Fijo"
            name="telefonoFijo"
            value={formData.telefonoFijo}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Sitio Web"
            name="sitioWeb"
            value={formData.sitioWeb}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Correo Electrónico de Contacto"
            name="emailContacto"
            value={formData.emailContacto}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
    );
  }