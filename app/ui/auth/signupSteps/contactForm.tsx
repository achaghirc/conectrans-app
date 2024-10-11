import {  TextField } from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { ZodIssue } from 'zod';
import { State } from '@/lib/actions';

interface ContactoFormProps {
  formData: {
    streetAddress: string;
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
  errors: State;
}

export default function ContactForm({ formData, errors, setFormData }: ContactoFormProps) {
  const inputRef = useRef(null);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ contacto: { ...formData, [name]: value } });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          type='text'
          label="Dirección"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('streetAddress'))}
          helperText={errors.errors?.some((el) => el.path.includes('streetAddress')) ? errors.errors?.filter((el) => el.path.includes('streetAddress'))[0].message : ''}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Código Postal"
          name="codigoPostal"
          value={formData.codigoPostal}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('codigoPostal'))}
          helperText={errors.errors?.some((el) => el.path.includes('codigoPostal')) ? errors.errors?.filter((el) => el.path.includes('codigoPostal'))[0].message : ''}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="País"
          name="pais"
          value={formData.pais}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('pais'))}
          helperText={errors.errors?.some((el) => el.path.includes('pais')) ? errors.errors?.filter((el) => el.path.includes('pais'))[0].message : ''}
          required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Provincia"
            name="provincia"
            value={formData.provincia}
            onChange={handleInputChange}
            error={errors.errors?.some((el) => el.path.includes('provincia'))}
            helperText={errors.errors?.some((el) => el.path.includes('provincia')) ? errors.errors?.filter((el) => el.path.includes('provincia'))[0].message : ''}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Localidad"
            name="localidad"
            value={formData.localidad}
            onChange={handleInputChange}
            error={errors.errors?.some((el) => el.path.includes('localidad'))}
            helperText={errors.errors?.some((el) => el.path.includes('localidad')) ? errors.errors?.filter((el) => el.path.includes('localidad'))[0].message : ''}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Teléfono Móvil"
            name="telefonoMovil"
            value={formData.telefonoMovil}
            onChange={handleInputChange}
            error={errors.errors?.some((el) => el.path.includes('telefonoMovil'))}
            helperText={errors.errors?.some((el) => el.path.includes('telefonoMovil')) ? errors.errors?.filter((el) => el.path.includes('telefonoMovil'))[0].message : ''}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
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
            error={errors.errors?.some((el) => el.path.includes('emailContacto'))}
            helperText={errors.errors?.some((el) => el.path.includes('emailContacto')) ? errors.errors?.filter((el) => el.path.includes('emailContacto'))[0].message : ''}
            required
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
            maxRows={6}
            error={errors.errors?.some((el) => el.path.includes('descripcion'))}
            helperText={errors.errors?.some((el) => el.path.includes('descripcion')) ? errors.errors?.filter((el) => el.path.includes('descripcion'))[0].message : ''}
            required
          />
        </Grid>
      </Grid>
    );
  }