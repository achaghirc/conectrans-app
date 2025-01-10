'use client';
import { ControllerTextFieldComponent } from '@/app/ui/shared/custom/components/form/ControllersReactHForm';
import useUtilsHook from '@/app/ui/shared/hooks/useUtils';
import { PasswordType, SignUpCandidateFormData, State, ValidationCIFNIFResult } from '@/lib/definitions';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2';
import React, { ChangeEvent, useState } from 'react'
import { Control, UseFormSetValue } from 'react-hook-form';

type CadidateUserFormProps = {
  control: Control<Partial<SignUpCandidateFormData>>;
  setValue: UseFormSetValue<Partial<SignUpCandidateFormData>>;
  formData: SignUpCandidateFormData;
  setFormData: (data: any) => void;
  errors: State;
}

export default function CadidateUserForm({
  control, setValue, formData, errors, setFormData
}: CadidateUserFormProps) {
  const { handleZodError, handleZodHelperText } = useUtilsHook();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = (type: PasswordType) => {
    if (type === 'password') setShowPassword(!showPassword);
    if (type === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value } );
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
        <ControllerTextFieldComponent 
          control={control}
          label="Correo electrónico"
          name="email"
          formState={errors}

        />
      </Grid>
      <Grid size={{xs:12, sm: 6}}>
        <ControllerTextFieldComponent
          label='Contraseña'
          control={control}
          name="password"
          formState={errors}
          type={!showPassword ? "password" : "text"}
          inputAdornment={inputPropShowPassword('password')}

        />
      </Grid>
      <Grid size={{xs:12, sm: 6}}>
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
