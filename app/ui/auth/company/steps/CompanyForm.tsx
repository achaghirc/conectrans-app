import { validateCompanyData } from '@/lib/validations/companySignupValidate';
import { getActitivies } from '@/lib/data/activity';
import { Activity, PasswordType, SignUpCompanyFormData, State, ValidationCIFNIFResult } from '@/lib/definitions';
import { handleZodError, handleZodHelperText } from '@/lib/utils';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField, MenuItem, Typography, Box, Avatar, InputAdornment, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ChangeEvent, useState } from 'react';
import { ZodIssue } from 'zod';
import { validateCIFNIFFormat } from '@/lib/actions';


interface CompanyFormProps {
  formData: SignUpCompanyFormData
  errors: State;
  setFormData: (data: any) => void;
  activities: Activity[] | undefined;
}

const tiposDeActividad = ['Tecnología', 'Construcción', 'Salud', 'Educación'];

export default function CompanyForm({ formData,activities, errors, setFormData }: CompanyFormProps) {
  const [logo, setLogo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cifError, setCifError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'cifnif' && value.length == 0) {
      if (value.length == 0) setCifError(null);
      value = value.toUpperCase();
    }
    setFormData({ company: { ...formData.company, [name]: value } });
  };

  const handleClickShowPassword = (type: PasswordType) => {
    if (type === 'password') setShowPassword(!showPassword);
    if (type === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ company: { ...formData.company, logo: e.target.files[0] } });
			setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };
  //Validación de CIF/NIF
  const handleCifNifValidation = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valid: ValidationCIFNIFResult | undefined = await validateCIFNIFFormat(value);
    if (valid && valid.valid) {
      setCifError(null);
      setFormData({ company: { ...formData.company, [name]: value } });
    } else {
      const message = valid?.message || 'El CIF/NIF introducido no es válido';
      setCifError(message);
    }
  }

  const handleRemoveLogo = () => {  
    setFormData({ company: { ...formData, logo: null } });
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

  const cifnifError = () => {
    if (cifError) {
      return true;
    } else {
      return handleZodError(errors, 'cifnif');
    }
  }

  const cifnifHelperText = () => {
    if (cifError) {
      return cifError;
    } else {
      return handleZodHelperText(errors, 'cifnif');
    }
  }


  return (
    <Grid container spacing={2}>
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          label="Correo electrónico"
          name="email"
          value={formData.company.email}
          onChange={handleInputChange}
          placeholder='example@email.com'
          error={handleZodError(errors, 'email')}
          helperText={handleZodHelperText(errors,'email')}
        />
      </Grid>
      <Grid size={{xs:12, sm: 6}}>
        <TextField
          fullWidth
          label="Contraseña"
          type={!showPassword ? "password" : "text"}
          name="password"
          value={formData.company.password}
          onChange={handleInputChange}
          error={handleZodError(errors,'password')}
          helperText={handleZodHelperText(errors,'password')}
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
          value={formData.company.confirmPassword}
          onChange={handleInputChange}
          error={handleZodError(errors,'confirmPassword')}
          helperText={handleZodHelperText(errors,'confirmPassword')}
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
          value={formData.company.socialName}
          onChange={handleInputChange}
          error={handleZodError(errors,'socialName')}
          helperText={handleZodHelperText(errors,'socialName')}
        />
      </Grid>
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          label="Nombre Comercial"
          name="comercialName"
          value={formData.company.comercialName}
          onChange={handleInputChange}
          error={handleZodError(errors,'comercialName')}
          helperText={handleZodHelperText(errors,'comercialName')}
        />
      </Grid>
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          label="CIF/NIF"
          name="cifnif"
          value={formData.company.cifnif}
          onBlur={handleCifNifValidation}
          onChange={handleInputChange}
          error={cifnifError()}
          helperText={cifnifHelperText()}
          required
        />
      </Grid>
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          select
          label="Tipo de Actividad"
          name="activityType"
          value={formData.company.activityType}
          onChange={handleInputChange}
          error={handleZodError(errors,'activityType')}
          helperText={handleZodHelperText(errors,'activityType')}
          required
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