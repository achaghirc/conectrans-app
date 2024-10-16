'use client';
import { validateCIFNIFFormat } from '@/lib/actions';
import { PasswordType, SignUpCandidateFormData, State, ValidationCIFNIFResult } from '@/lib/definitions';
import { handleZodError, handleZodHelperText } from '@/lib/utils';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2';
import React, { ChangeEvent, useState } from 'react'

type CadidateUserFormProps = {
  formData: SignUpCandidateFormData;
  setFormData: (data: any) => void;
  errors: State;
}

export default function CadidateUserForm({formData, errors, setFormData}: CadidateUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = (type: PasswordType) => {
    if (type === 'password') setShowPassword(!showPassword);
    if (type === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormData({ company: { ...formData, [name]: value } });
  };

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
          value={formData.password}
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
          value={formData.confirmPassword}
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
    </Grid>
  )
}
