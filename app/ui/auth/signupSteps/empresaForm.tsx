import { TextField, MenuItem, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ChangeEvent, useState } from 'react';

interface EmpresaFormProps {
  formData: {
    email: string;
    password: string;
    confirmarPassword: string;
    razonSocial: string;
    nombreComercial: string;
    tipoActividad: string;
    logo: File | null;
  };
  setFormData: (data: any) => void;
}

const tiposDeActividad = ['Tecnología', 'Construcción', 'Salud', 'Educación'];

export default function EmpresaForm({ formData, setFormData }: EmpresaFormProps) {
  const [logo, setLogo] = useState<string | null>(null);
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ empresa: { ...formData, [name]: value } });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ empresa: { ...formData, logo: e.target.files[0] } });
			setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          label="Correo electrónico"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid size={{xs:6}}>
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid size={{xs:6}}>
        <TextField
          fullWidth
          label="Confirmar Contraseña"
          type="password"
          name="confirmarPassword"
          value={formData.confirmarPassword}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          label="Razón Social"
          name="razonSocial"
          value={formData.razonSocial}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          label="Nombre Comercial"
          name="nombreComercial"
          value={formData.nombreComercial}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          select
          label="Tipo de Actividad"
          name="tipoActividad"
          value={formData.tipoActividad}
          onChange={handleInputChange}
        >
          {tiposDeActividad.map((tipo) => (
            <MenuItem key={tipo} value={tipo}>
              {tipo}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs:6 }}>
        <Typography variant="body1" textAlign={'start'}>Logo de la Empresa</Typography>
        <Box sx={{ mt: 1 }}>
            <label htmlFor='file' style={{
                border: '1px solid #ccc',
                display: 'inline-block',
                padding: '6px 12px',
                cursor: 'pointer',
                borderRadius: '3px',
                backgroundColor: '#f9f9f9',
                color: '#333',
                textAlign: 'center',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '1rem',
            }}>
                Seleccionar archivo
            </label>
            <input 
                id='file'
                type="file" accept="image/*" 
                onChange={handleFileChange} 
            />
        </Box>
      </Grid>
			{logo && (
        <Grid size={{ xs: 6 }}>
          <Typography variant="body1" textAlign={'start'}>Vista previa del logo</Typography>
					<Box mt={2}>
            <img src={logo} alt="Vista previa del logo" width={150} style={{ borderRadius: '50%' }}/>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}