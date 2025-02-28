'use client';
import { ControllerTextFieldComponent } from '@/app/ui/shared/custom/components/form/ControllersReactHForm';
import useUtilsHook from '@/app/ui/shared/hooks/useUtils';
import { PasswordType, SignUpCandidateFormData, State, ValidationCIFNIFResult } from '@/lib/definitions';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react'
import { Control, UseFormSetValue } from 'react-hook-form';

type CadidateUserFormProps = {
  control: Control<Partial<SignUpCandidateFormData>>;
  errors: State;
}

export default function CadidateUserForm({
  control, errors
}: CadidateUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = (type: PasswordType) => {
    if (type === 'password') setShowPassword(!showPassword);
    if (type === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
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
    <Grid container spacing={2} maxWidth={'md'} sx={{mx: 'auto', mt: 2}}>
      <Grid size={{xs:12}}>
        <ControllerTextFieldComponent 
          control={control}
          label="Correo electrónico"
          name="email"
          formState={errors}

        />
      </Grid>
      <Grid size={{xs:12}}>
        <ControllerTextFieldComponent
          label='Contraseña'
          control={control}
          name="password"
          formState={errors}
          type={!showPassword ? "password" : "text"}
          inputAdornment={inputPropShowPassword('password')}

        />
      </Grid>
      <Grid size={{xs:12}}>
        <ControllerTextFieldComponent 
          control={control}
          label='Confirmar Contraseña'
          name="confirmPassword"
          formState={errors}
          type={!showConfirmPassword ? "password" : "text"}
          inputAdornment={inputPropShowPassword('confirmPassword')}
        />
      </Grid>
    </Grid>
  )
}
