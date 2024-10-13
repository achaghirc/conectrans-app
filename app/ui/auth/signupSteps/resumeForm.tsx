import { SignUpCompanyFormData } from '@/lib/definitions';
import { Box, Typography, Divider, Avatar } from '@mui/material';
import { Sign } from 'crypto';

interface ResumeFormProps {
  formData: SignUpCompanyFormData;
};


export default function ResumeForm({ formData }: ResumeFormProps) {
  const { company, contactInfo, contactPerson } = formData;

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
        <Avatar src={company.logo ? URL.createObjectURL(company.logo) : undefined} sx={{ width: 100, height: 100 }} />  
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Typography variant="body1">Correo Electrónico: {company.email}</Typography>
          <Typography variant="body1">Razón Social: {company.socialName}</Typography>
          <Typography variant="body1">Nombre Comercial: {company.comercialName}</Typography>
          <Typography variant="body1">Tipo de Actividad: {company.activityType}</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Datos de Contacto</Typography>
      <Typography variant="body1">Dirección: {contactInfo.streetAddress}</Typography>
      <Typography variant="body1">Código Postal: {contactInfo.zip}</Typography>
      <Typography variant="body1">País: {contactInfo.country}</Typography>
      <Typography variant="body1">Provincia: {contactInfo.province}</Typography>
      <Typography variant="body1">Localidad: {contactInfo.locality}</Typography>
      <Typography variant="body1">Teléfono Móvil: {contactInfo.mobilePhone}</Typography>
      <Typography variant="body1">Teléfono Fijo: {contactInfo.landlinePhone}</Typography>
      <Typography variant="body1">Sitio Web: {contactInfo.website}</Typography>
      <Typography variant="body1">Correo Electrónico de contactInfo: {contactInfo.contactEmail}</Typography>
      <Typography variant="body1">Descripción: {contactInfo.description}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Persona de Contacto</Typography>
      <Typography variant="body1">Nombre: {contactPerson.name}</Typography>
      <Typography variant="body1">Apellidos: {contactPerson.lastnames}</Typography>
      <Typography variant="body1">Cargo: {contactPerson.companyPosition}</Typography>
      <Typography variant="body1">Teléfono: {contactPerson.phoneNumber}</Typography>
      <Typography variant="body1">Correo Electrónico: {contactPerson.email}</Typography>
    </Box>
  );
}