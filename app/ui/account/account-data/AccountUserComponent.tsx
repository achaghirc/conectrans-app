'use client';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, Suspense, useEffect, useMemo } from 'react'
import { AccountProps } from './AccountPage';
import { AccountForm, PersonDTO, Province } from '@/lib/definitions';
import { getPersonById, getPersonByUserId, updatePersonPreferences } from '@/lib/data/person';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, IconButton, InputAdornment, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ProfileComponent from '../../shared/account/ProfileComponent';
import { getGeolocationData, getProvincesByCountryId } from '@/lib/data/geolocate';
import AccordionComponent from '../../shared/custom/components/accordion/AccordionComponent';
import { UserDTO } from '@prisma/client';
import PersonEmploymentPreferencesComponent from './PersonEmploymentPreferencesComponent';
import ButtonCustom from '../../shared/custom/components/button/ButtonCustom';
import { CloseOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import ModalCheckPassComponent from '../../shared/account/ModalCheckPassComponent';
import { checkPasswordUser, updateUserHandler } from '@/lib/data/user';
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { SUCCESS_MESSAGE_SNACKBAR } from '@/lib/utils';

const PASSWORD_DEFAULT = '***********';

const UserPersonDataComponent = React.lazy(() => import('./UserPersonDataComponent'));

const AccountUserComponent: React.FC<AccountProps> = ({session}) => {
  const router = useRouter();
  if (!session) {return;}
  
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [hasCar, setHasCar] = React.useState<boolean>(false);
  const [relocateOption, setRelocateOption] = React.useState<boolean>(false);
  
  const handleCloseSnackbar = () => {
    setSnackbarProps({...snackbarProps, open: false})
  }
  const [snackbarProps, setSnackbarProps] = React.useState<SnackbarCustomProps>({
    open: false, 
    handleClose: handleCloseSnackbar,
    message: '',
    severity: 'success'
  })
  const handleSnackbarSons = (snackbarProps: Partial<SnackbarCustomProps>) => {
    const {open, message, severity} = snackbarProps;
    setSnackbarProps({
      ...snackbarProps,
      open: open ?? false,
      message: message ?? '',
      severity: severity ?? 'success',
      handleClose: handleCloseSnackbar
    })
  }
  const [changedForm, setChangedForm] = React.useState<AccountForm>({
    email: false,
    password: false,
  }
  )
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const [userData, setUserData] = React.useState<UserDTO>({
    email: '',
    password: '',
    id: '',
    name: '',
    roleCode: '',
    assetUrl: 'https://res.cloudinary.com/dgmgqhoui/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_grey,b_rgb:262c35/v1734182403/default-logo-user_fj0tu3.png',
  } as UserDTO);
  
  const fetchPersonData = () : Promise<PersonDTO | undefined> => getPersonById(session.user.personId ?? 0);
  const { data: personData, isLoading: personIsLoading, isError: personIsError, error: personError} = useQuery({queryKey: ['personData'], queryFn: fetchPersonData})

  const getUserData = useMemo(() => {
    if (!session) return null;
    const {user} = session;

    if (!user) return null;
    
    return {
      ...userData,
      email: user.email || '',
      password: PASSWORD_DEFAULT,
      id: user.id || '',
      name: user.name || '',
      roleCode: user.roleCode || '',
      assetUrl: user.assetUrl ?? userData.assetUrl,
      personId: session.user.personId
    } as UserDTO;
  }, [session]);

  useEffect(() => {
    if (!session.user){
      router.push('/auth/login');
    } else {
      const user = getUserData;
      if (user)
        setUserData(user);
    }
  }, [session, getUserData]);
  
  useEffect(() => {
    if (!personData) return;
    if (personData.hasCar) {
      setHasCar(personData.hasCar);
    }
    if (personData.relocateOption) {
      setRelocateOption(personData.relocateOption);
    }
  }, [personData]);

  
  const handleUserDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
  
    setChangedForm({...changedForm, [name]: true});
    setUserData({...userData, [name]: value});
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
            setUserData({...userData, password: PASSWORD_DEFAULT})
          }}
        >
          {changedForm.password && <CloseOutlined />}
        </IconButton>
		  </InputAdornment>
		)
	}

  const handleClose = (value: boolean) => {
    setOpenModal(value);
  }

  const updateFunction = async (value: UserDTO) => {
    setLoading(true);
    try{
      const res = await checkPasswordUser(session.user.email, value.confirmPassword)
      if(!res){
        setSnackbarProps({...snackbarProps, open: true, message: 'Contraseña actual incorrecta, por favor recupera tu contraseña si no la recuerdas', severity: 'error'})
      } else {
        const result : UserDTO | string = await updateUserHandler(userData, changedForm, session.user.email);
        if (result instanceof String) {
          setSnackbarProps({...snackbarProps, open: true, message: result as string, severity: 'error'})
        } else {
          setSnackbarProps({...snackbarProps, open: true, message: SUCCESS_MESSAGE_SNACKBAR, severity: 'success'})
        }
      }
      setLoading(false);
      setChangedForm({
        email: false,
        password: false
      })
    }catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      setSnackbarProps({...snackbarProps, open: true, message: 'Error en el servidor actualizando los datos, contacte con el administrador.', severity: 'error'})
    }
    
  }

  const updateEmployeePreferences = async () => {
    if (!userData.personId) {
      router.push('/auth/login');
      return;
    }
    const res = await updatePersonPreferences(userData.personId, hasCar, relocateOption);
    if (res instanceof String) {
      setSnackbarProps({...snackbarProps, open: true, message: 'Error actualizando los datos, intentelo de nuevo', severity: 'error'})
      return;
    } else {
      const {hasCar, relocateOption} = res as {hasCar: boolean, relocateOption: boolean};
      setHasCar(hasCar);
      setRelocateOption(relocateOption);
      setSnackbarProps({...snackbarProps, open: true, message: SUCCESS_MESSAGE_SNACKBAR, severity: 'success'})
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection:'column' }} gap={3}>
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ProfileComponent assetUrl={userData?.assetUrl} title={userData?.name ?? ''} subtitle={userData?.email ?? ''} />
      </Box>
      <Grid container spacing={3} sx={{ display: 'flex', flexDirection: 'column'}}>
        <Grid size={{ xs: 12 }}>
          <AccordionComponent title={'Datos de la cuenta'} expandedDefault={true}>
            <Grid container spacing={2} mt={3}>
              <Grid size={{ xs: 12, sm: 6}}>
                <TextField
                  sx={{width: {xs: '95%', sm: '80%'}}}
                  label="Email"
                  name="email"
                  autoFocus={false}
                  value={userData?.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleUserDataChange(e)}
                  onBlur={() => {
                    if (userData.email === session.user.email){
                      setChangedForm({...changedForm, email: false});
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6}}>
                <TextField
                  sx={{width: {xs: '95%', sm: '80%'}}}
                  label="Contraseña"
                  name="password"
                  type={showPassword && changedForm.password ? 'text' : 'password'}
                  value={userData?.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleUserDataChange(e)}
                  onFocus={() => {
                    if(changedForm.password == false){
                      setUserData({...userData, password: ''})
                    }
                  }}
                  slotProps={{
                    input: {
                      endAdornment: inputPropShowPassword()
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                <ButtonCustom 
                  title='Guardar'
                  loading={loading}
                  color='secondary'
                  onClick={() => setOpenModal(true)}
                  disable={changedForm.email == false && changedForm.password == false}
                />
              </Grid>
            </Grid>
          </AccordionComponent>
        </Grid>
        <Grid size={{ xs: 12 }}>
          {/* Person data */}
          <Suspense fallback={
            <AccordionComponent title='Datos personales' expandedDefault={false} loading={true} >
              <Typography variant='body1' color='textSecondary'>Cargando datos...</Typography> 
            </AccordionComponent>}
          >
            <AccordionComponent 
              title='Datos personales' 
              expandedDefault={false}
              loading={personIsLoading}
            >
              <UserPersonDataComponent
                personData={personData!} 
                setSnackbarProps={handleSnackbarSons}
                />
            </AccordionComponent>
          </Suspense>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AccordionComponent title='Preferencias de empleo' 
            expandedDefault={false} 
            loading={personIsLoading}
          >
            <PersonEmploymentPreferencesComponent
              hasCar={hasCar}
              relocateOption={relocateOption}
              setHasCar={setHasCar}
              setRelocateOption={setRelocateOption}
              saveAction={updateEmployeePreferences}
            />
          </AccordionComponent>
        </Grid>
      </Grid>
      <ModalCheckPassComponent 
        userData={userData}
        open={openModal}
        setOpen={handleClose}
        onSave={updateFunction}
      />
      <SnackbarCustom 
        {...snackbarProps}
      
      />
    </Box>
  )
}

export default AccountUserComponent;