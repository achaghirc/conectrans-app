import { Box, Typography, Divider, Avatar } from '@mui/material';

interface ResumeFormProps {
  formData: {
    empresa: {
      email: string;
      socialName: string;
      comercialName: string;
      tipoActividad: string;
      logo: File | null;
    };
    contacto: {
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
    personaContacto: {
      nombre: string;
      apellidos: string;
      cargo: string;
      telefono: string;
      email: string;
    };
  };
}

export default function ResumeForm({ formData }: ResumeFormProps) {
  const { empresa, contacto, personaContacto } = formData;

  return (
    <Box>
      <Typography variant="h4" textAlign={'center'}>Resumen</Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar src={empresa.logo ? URL.createObjectURL(empresa.logo) : undefined} sx={{ width: 100, height: 100 }} />  
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Typography variant="body1">Correo Electrónico: {empresa.email}</Typography>
          <Typography variant="body1">Razón Social: {empresa.socialName}</Typography>
          <Typography variant="body1">Nombre Comercial: {empresa.comercialName}</Typography>
          <Typography variant="body1">Tipo de Actividad: {empresa.tipoActividad}</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Datos de Contacto</Typography>
      <Typography variant="body1">Dirección: {contacto.streetAddress}</Typography>
      <Typography variant="body1">Código Postal: {contacto.codigoPostal}</Typography>
      <Typography variant="body1">País: {contacto.pais}</Typography>
      <Typography variant="body1">Provincia: {contacto.provincia}</Typography>
      <Typography variant="body1">Localidad: {contacto.localidad}</Typography>
      <Typography variant="body1">Teléfono Móvil: {contacto.telefonoMovil}</Typography>
      <Typography variant="body1">Teléfono Fijo: {contacto.telefonoFijo}</Typography>
      <Typography variant="body1">Sitio Web: {contacto.sitioWeb}</Typography>
      <Typography variant="body1">Correo Electrónico de Contacto: {contacto.emailContacto}</Typography>
      <Typography variant="body1">Descripción: {contacto.descripcion}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Persona de Contacto</Typography>
      <Typography variant="body1">Nombre: {personaContacto.nombre}</Typography>
      <Typography variant="body1">Apellidos: {personaContacto.apellidos}</Typography>
      <Typography variant="body1">Cargo: {personaContacto.cargo}</Typography>
      <Typography variant="body1">Teléfono: {personaContacto.telefono}</Typography>
      <Typography variant="body1">Correo Electrónico: {personaContacto.email}</Typography>
    </Box>
  );
}