import { Activity, PasswordType, SignUpCompanyFormData, State, ValidationCIFNIFResult } from '@/lib/definitions';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Typography, Box, Avatar, InputAdornment, IconButton, FormHelperText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ChangeEvent, use, useRef, useState } from 'react';
import { validateCIFNIFFormat } from '@/lib/actions';
import { useQuery } from '@tanstack/react-query';
import { getActitivies } from '@/lib/data/activity';
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ControllerSelectFieldComponent, ControllerTextFieldComponent } from '@/app/ui/shared/custom/components/form/ControllersReactHForm';
import useUtilsHook from '@/app/ui/shared/hooks/useUtils';

interface CompanyFormProps {
  control: Control<Partial<SignUpCompanyFormData>>;
  register: UseFormRegister<Partial<SignUpCompanyFormData>>;
  watch: UseFormWatch<Partial<SignUpCompanyFormData>>;
  setValue: UseFormSetValue<Partial<SignUpCompanyFormData>>;
  errors: State;
}

export default function CompanyForm({ control, register, watch, setValue, errors }: CompanyFormProps) {
  const { handleZodError, handleZodHelperText } = useUtilsHook();
  const [logo, setLogo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cifError, setCifError] = useState<string | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: registerRef, ...rest} = register('company.logo');

  const {data: activities, isLoading: isActivityLoading} = useQuery({
    queryKey: ['activities'],
    queryFn: () => getActitivies(),
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });

  const handleClickShowPassword = (type: PasswordType) => {
    if (type === 'password') setShowPassword(!showPassword);
    if (type === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file : File = e.target.files[0] as File;
      setValue('company.logo', file);
			setLogo(URL.createObjectURL(file));
    }
  };
  //Validación de CIF/NIF
  const handleCifNifValidation = async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = watch('company.cifnif');
    const valid: ValidationCIFNIFResult | undefined = await validateCIFNIFFormat(value);
    if (valid && valid.valid) {
      setCifError(null);
    } else {
      const message = valid?.message || 'El CIF/NIF introducido no es válido';
      setCifError(message);
    }
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
        <ControllerTextFieldComponent 
          control={control}
          label='Correo electrónico'
          formState={errors}
          name="company.email"
          placeholder='Nombre de la empresa'
        />
      </Grid>
      <Grid size={{xs:12, sm: 6}}>
        <ControllerTextFieldComponent 
          control={control}
          label='Contraseña'
          formState={errors}
          name="company.password"
          type={!showPassword ? "password" : "text"}
          placeholder='Contraseña'
          inputAdornment={inputPropShowPassword('password')}          
        />
      </Grid>
      <Grid size={{xs:12, sm: 6}}>
        <ControllerTextFieldComponent 
          control={control}
          label='Confirmar Contraseña'
          formState={errors}
          name="company.confirmPassword"
          type={!showConfirmPassword ? "password" : "text"}
          placeholder='Confirmar contraseña'
          inputAdornment={inputPropShowPassword('confirmPassword')}  
        />
      </Grid>
      <Grid size={{xs:12}}>
        <ControllerTextFieldComponent 
          control={control}
          label='Razón Social'
          formState={errors}
          name="company.socialName"
          placeholder='Razón Social'
        />
      </Grid>
      <Grid size={{xs:12}}>
        <ControllerTextFieldComponent 
          control={control}
          label='Nombre Comercial'
          formState={errors}
          name="company.comercialName"
          placeholder='Nombre Comercial'
        />
      </Grid>
      <Grid size={{xs:12}}>
        <ControllerTextFieldComponent 
          control={control}
          label='CIF/NIF'
          formState={errors}
          placeholder='CIF/NIF'
          {...register('company.cifnif', { 
            onBlur: (e) => {
              handleCifNifValidation(e);
            },
          })}
        />
      </Grid>
      <Grid size={{xs:12}}>
        <ControllerSelectFieldComponent
          control={control}
          label='Tipo de Actividad'
          formState={errors}
          name="company.activityType"
          options={!isActivityLoading ? activities?.map((tipo: Activity) => ({value: tipo.name, label: tipo.code, id: tipo.id!.toString()})) : []}
          placeholder='Selecciona una actividad'
          isLoading={isActivityLoading}
        />
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
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
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
              type="file" 
              accept="image/*" 
              {...rest}
              ref={(e => {
                registerRef(e);
                hiddenInputRef.current = e;
              })}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <FormHelperText error={handleZodError(errors, "company.logo")}>{handleZodHelperText(errors, "company.logo")}</FormHelperText>
        </Box>
      </Grid>	
    </Grid>
  );
}