import { State, validateCompanyData } from '@/lib/actions';
import { getActitivies } from '@/lib/data/activity';
import { Activity } from '@/lib/definitions';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField, MenuItem, Typography, Box, Avatar, InputAdornment, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ChangeEvent, useActionState, useState } from 'react';

type PasswordType = 'password' | 'confirmPassword';
interface EmpresaFormProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    socialName: string;
    comercialName: string;
    tipoActividad: string;
    logo: File | null;
  };
  errors: State;
  setFormData: (data: any) => void;
  activities: Activity[] | undefined;
}

const tiposDeActividad = ['Tecnología', 'Construcción', 'Salud', 'Educación'];

export default function CompanyForm({ formData,activities, errors, setFormData }: EmpresaFormProps) {
  const [logo, setLogo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ empresa: { ...formData, [name]: value } });
  };

  const handleClickShowPassword = (type: PasswordType) => {
    if (type === 'password') setShowPassword(!showPassword);
    if (type === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ empresa: { ...formData, logo: e.target.files[0] } });
			setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveLogo = () => {  
    setFormData({ empresa: { ...formData, logo: null } });
    setLogo(null);
  }

  const inputPropShowPassword = (type: PasswordType) => {
    return (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => handleClickShowPassword(type)}
          edge="end"
        >
          {type === 'password' && showPassword ? <Visibility /> : type === 'password' && !showPassword ? <VisibilityOff /> : type === 'confirmPassword' && showConfirmPassword ? <Visibility /> : <VisibilityOff />}  
        </IconButton>
      </InputAdornment>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          label="Correo electrónico"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder='example@email.com'
          error={errors.errors?.some((el) => el.path.includes('email'))}
          helperText={errors.errors?.some((el) => el.path.includes('email')) ? 'Correo electrónico no válido': ''}
        />
      </Grid>
      <Grid size={{xs:12, sm: 6}}>
        <TextField
          fullWidth
          label="Contraseña"
          type={!showPassword ? "password" : "text"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('password'))}
          helperText={errors.errors?.some((el) => el.path.includes('password')) ? errors.errors?.filter((el) => el.path.includes('password'))[0].message : ''}
          slotProps={{
            input:{
              endAdornment: inputPropShowPassword('password')
            }
          }}
        />
      </Grid>
      <Grid size={{xs:12, sm: 6}}>
        <TextField
          fullWidth
          label="Confirmar Contraseña"
          type={!showConfirmPassword ? "password" : "text"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('confirmPassword'))}
          helperText={errors.errors?.some((el) => el.path.includes('confirmPassword')) ? errors.errors?.filter((el) => el.path.includes('confirmPassword'))[0].message : ''}
          slotProps={{
            input:{
              endAdornment: inputPropShowPassword('confirmPassword')
            }
          }}
        />
      </Grid>
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          label="Razón Social"
          name="socialName"
          value={formData.socialName}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('socialName'))}
          helperText={errors.errors?.some((el) => el.path.includes('socialName')) ? 'Campo obligatorio': ''}
        />
      </Grid>
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          label="Nombre Comercial"
          name="comercialName"
          value={formData.comercialName}
          onChange={handleInputChange}
          error={errors.errors?.some((el) => el.path.includes('comercialName'))}
          helperText={errors.errors?.some((el) => el.path.includes('comercialName')) ? 'Campo obligatorio': ''}
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
          {activities && activities.map((tipo) => (
            <MenuItem key={tipo.code} value={tipo.code}>
              {tipo.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Typography variant="body1" textAlign={'start'} fontWeight={'700'}>Logo de la Empresa</Typography>
      {logo ? (
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center'}}>
          <Box mt={0}>
            <Avatar src={logo} alt="Vista previa del logo" sx={{ width: 100, height: 100 }} />
          </Box>
        </Grid>
      ) : (
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center'}}>
          <Box mt={0}>
            <Avatar sx={{ width: 100, height: 100 }} />
          </Box>
        </Grid>
      )}
      <Grid size={{ xs:12 }} sx={{ display: 'flex', justifyContent: 'center'}}>
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
    </Grid>
  );
}