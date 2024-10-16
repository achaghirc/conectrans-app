import {  TextField } from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { SignUpCompanyFormData, State } from '@/lib/definitions';
import { handleZodError, handleZodHelperText } from '@/lib/utils';

interface ContactoFormProps {
  formData: SignUpCompanyFormData
  setFormData: (data: any) => void;
  errors: State;
}

export default function ContactForm({ formData, errors, setFormData }: ContactoFormProps) {
  const inputRef = useRef(null);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ contactInfo: { ...formData.contactInfo, [name]: value } });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          type='text'
          label="Dirección"
          name="streetAddress"
          value={formData.contactInfo.streetAddress}
          onChange={handleInputChange}
          error={handleZodError(errors, 'streetAddress')}
          helperText={handleZodHelperText(errors, 'streetAddress')}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Código Postal"
          name="zip"
          value={formData.contactInfo.zip}
          onChange={handleInputChange}
          error={handleZodError(errors, 'zip')}
          helperText={handleZodHelperText(errors, 'zip')}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="País"
          name="country"
          value={formData.contactInfo.country}
          onChange={handleInputChange}
          error={handleZodError(errors, 'country')}
          helperText={handleZodHelperText(errors, 'country')}
          required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Provincia"
            name="province"
            value={formData.contactInfo.province}
            onChange={handleInputChange}
            error={handleZodError(errors, 'province')}
            helperText={handleZodHelperText(errors, 'province')}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Localidad"
            name="locality"
            value={formData.contactInfo.locality}
            onChange={handleInputChange}
            error={handleZodError(errors, 'locality')}
            helperText={handleZodHelperText(errors, 'locality')}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Teléfono Móvil"
            name="mobilePhone"
            value={formData.contactInfo.mobilePhone}
            onChange={handleInputChange}
            error={handleZodError(errors, 'mobilePhone')}
            helperText={handleZodHelperText(errors, 'mobilePhone')}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Teléfono Fijo"
            name="landlinePhone"
            value={formData.contactInfo.landlinePhone}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Sitio Web"
            name="website"
            value={formData.contactInfo.website}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Correo Electrónico de Contacto"
            name="contactEmail"
            value={formData.contactInfo.contactEmail}
            onChange={handleInputChange}
            error={handleZodError(errors, 'contactEmail')}
            helperText={handleZodHelperText(errors, 'contactEmail')}
            required
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Descripción"
            name="description"
            value={formData.contactInfo.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            maxRows={6}
            error={handleZodError(errors, 'description')}
            helperText={handleZodHelperText(errors, 'description')}
            required
          />
        </Grid>
      </Grid>
    );
  }