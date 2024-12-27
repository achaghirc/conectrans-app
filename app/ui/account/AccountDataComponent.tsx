'use client';
import React, { ChangeEvent, useEffect, useReducer } from 'react'
import { checkPasswordUser, updateUserHandler } from '@/lib/data/user'
import { AccountForm, State } from '@/lib/definitions';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Session } from 'next-auth'
import useUserData from '../shared/hooks/useUserData';
import ButtonCustom from '../shared/custom/components/button/ButtonCustom';
import { UserDTO } from '@prisma/client';
import AccordionComponent from '../shared/custom/components/accordion/AccordionComponent';
import { useRouter } from 'next/navigation';
import { SnackbarCustomProps } from '../shared/custom/components/snackbarCustom';
import ModalCheckPassComponent from '../shared/account/ModalCheckPassComponent';
import useUtilsHook from '../shared/hooks/useUtils';
import { CloseOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { ACTUAL_PASSWORD_VALIDATION_ERROR, ERROR_MESSAGE_SNACKBAR_SERVER, ERROR_MESSAGE_SNACKBAR_VALIDATION, PASSWORD_DEFAULT, SUCCESS_MESSAGE_SNACKBAR } from '@/lib/constants';

export type AccountProps = {
    session: Session | null;
    setSnackbarProps: (snackbarProps: Partial<SnackbarCustomProps>) => void;
}

const AccountDataComponent: React.FC<AccountProps> = React.memo((
  {session, setSnackbarProps}
) => {
	const router = useRouter();
  if (!session) {
    router.push('/auth/login');
    return;
  }
  //Errors en el formulario
  const [formState, setFormState] = React.useState<State>({
    message: '',
    errors: []
  });
  const { handleZodError, handleZodHelperText } = useUtilsHook();
  const { userData } = useUserData(session);
  const [user, setUser] = React.useState<UserDTO>(userData);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleClose = (value: boolean) => {
    setOpenModal(value);
  }

  const [changedForm, setChangedForm] = React.useState<AccountForm>({
    email: false,
    password: false,
  })


  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);


  const handleUserDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
  
    setChangedForm({...changedForm, [name]: true});
    setUser({...user, [name]: value});
  }

  const updateFunction = async (value: UserDTO) => {
    setLoading(true);
    try{
      const res = await checkPasswordUser(session.user.email, value.confirmPassword)
      if(!res){
        setSnackbarProps({open: true, message: ACTUAL_PASSWORD_VALIDATION_ERROR, severity: 'error'})
        setLoading(false);
        return;
      } else {
        const result : UserDTO | State = await updateUserHandler(formState, user, changedForm, session.user.email);
        if('message' in result || 'errors' in result){
          const res = result as State;
          const {message} = res;
          setFormState(res);
          console.log(res);
          setSnackbarProps({open: true, message: message ?? ERROR_MESSAGE_SNACKBAR_VALIDATION, severity: 'error'})
        } else {
          setSnackbarProps({open: true, message: SUCCESS_MESSAGE_SNACKBAR, severity: 'success'})
          setChangedForm({
            email: false,
            password: false
          });
          setFormState({
            message: '',
            errors: []
          });
        }
      }
      setLoading(false);
    }catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      setSnackbarProps({open: true, message: ERROR_MESSAGE_SNACKBAR_SERVER, severity: 'error'})
    }
    
  }

  const inputPropShowPassword = () => {
		return (
		  <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setShowPassword(!showPassword)}
          edge="end"
          sx={{ display: changedForm.password ? 'block' : 'none' }}
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}  
        </IconButton>
        <IconButton
          aria-label="toogle password reset"
          onClick={() => {
            setChangedForm({...changedForm, password: false});
            setUser({...user, password: PASSWORD_DEFAULT})
          }}
        >
          {changedForm.password && <CloseOutlined />}
        </IconButton>
		  </InputAdornment>
		)
	}

  if (!user || user.email == '') {
    return <AccordionComponent
      title='Datos de la cuenta' 
      expandedDefault={false}
      loading={true}
    >
      <></>
    </AccordionComponent>
  }
  return (
    <>
      <AccordionComponent
        title='Datos de la cuenta' 
        expandedDefault={true}
        loading={false}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            padding: 2,
            margin: '0px auto',
            height: '100%',
            width: '98%',
            borderRadius: 5,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                sx={{width: {xs: '95%', sm: '80%'}}}
                label="Email"
                name="email"
                autoFocus={false}
                value={user?.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleUserDataChange(e)}
                onBlur={() => {
                  if (user.email === session.user.email){
                    setChangedForm({...changedForm, email: false});
                  }
                }}
                error={handleZodError(formState, 'email')}
                helperText={handleZodHelperText(formState, 'email')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                sx={{width: {xs: '95%', sm: '80%'}}}
                label="Contraseña"
                name="password"
                type={showPassword && changedForm.password ? 'text' : 'password'}
                value={user?.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleUserDataChange(e)}
                onFocus={() => {
                  if(changedForm.password == false){
                    setUser({...user, password: ''})
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: inputPropShowPassword()
                  }
                }}
                error={handleZodError(formState, 'password')}
                helperText={handleZodHelperText(formState, 'password')}
              />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ButtonCustom
                title='Guardar'
                color='secondary'
                onClick={() => setOpenModal(true)}
                loading={loading}
                disable={changedForm.email == false && changedForm.password == false}
              />
            </Grid>
          </Grid>
        </Box>
      </AccordionComponent>
      <ModalCheckPassComponent
        userData={user}
        open={openModal}
        setOpen={handleClose}
        onSave={updateFunction}
      />
  </>
  )
});

export default AccountDataComponent;