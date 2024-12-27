'use client';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, Suspense, useEffect, useMemo } from 'react'
import AccountDataComponent from '../AccountDataComponent';
import { AccountForm, PersonDTO, State } from '@/lib/definitions';
import { getPersonById, updatePersonPreferences } from '@/lib/data/person';
import { useQuery } from '@tanstack/react-query';
import { Box, IconButton, InputAdornment, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ProfileComponent from '../../shared/account/ProfileComponent';
import AccordionComponent from '../../shared/custom/components/accordion/AccordionComponent';
import { UserDTO } from '@prisma/client';
import PersonEmploymentPreferencesComponent from './PersonEmploymentPreferencesComponent';
import { CloseOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import ModalCheckPassComponent from '../../shared/account/ModalCheckPassComponent';
import { checkPasswordUser, updateUserHandler } from '@/lib/data/user';
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { ACTUAL_PASSWORD_VALIDATION_ERROR, ERROR_MESSAGE_SNACKBAR, ERROR_MESSAGE_SNACKBAR_COMPANY, ERROR_MESSAGE_SNACKBAR_SERVER, ERROR_MESSAGE_SNACKBAR_VALIDATION, PASSWORD_DEFAULT, SUCCESS_MESSAGE_SNACKBAR } from '@/lib/constants';
import useUtilsHook from '../../shared/hooks/useUtils';
import useUserData from '../../shared/hooks/useUserData';
import { Session } from 'next-auth';


const UserPersonDataComponent = React.lazy(() => import('./UserPersonDataComponent'));

type AccountUserProps = {
  session: Session | null;
}

const AccountUserComponent: React.FC<AccountUserProps> = ({session}) => {
  const { handleZodError, handleZodHelperText} = useUtilsHook();
  const router = useRouter();
  if (!session) {return;}

  const [formState, setFormState] = React.useState<State>({
    message: '',
    errors: []
  });
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
  })
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const { userData } = useUserData(session);
  const [user, setUser] = React.useState<UserDTO>(userData);
  const fetchPersonData = () : Promise<PersonDTO | undefined> => getPersonById(session.user.personId ?? 0);
  const { data: personData, isLoading: personIsLoading, isError: personIsError, error: personError} = useQuery({queryKey: ['personData'], queryFn: fetchPersonData})

  useEffect(() => {
    if (!userData){
      router.push('/auth/login');
    } else {
      setUser(userData);
    }
  }, [userData])
  
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
    setUser({...user, [name]: value});
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

  const handleClose = (value: boolean) => {
    setOpenModal(value);
  }

  const updateFunction = async (value: UserDTO) => {
    setLoading(true);
    try{
      const res = await checkPasswordUser(session.user.email, value.confirmPassword)
      if(!res){
        setSnackbarProps({...snackbarProps, open: true, message: ACTUAL_PASSWORD_VALIDATION_ERROR, severity: 'error'})
        return;
      } else {
        const result : UserDTO | State = await updateUserHandler(formState, user, changedForm, session.user.email);
        if('message' in result || 'errors' in result){
          const res = result as State;
          const {message} = res;
          setFormState(res);
          console.log(res);
          setSnackbarProps({...snackbarProps, open: true, message: message ?? ERROR_MESSAGE_SNACKBAR_VALIDATION, severity: 'error'})
        } else {
          setSnackbarProps({...snackbarProps, open: true, message: SUCCESS_MESSAGE_SNACKBAR, severity: 'success'})
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
      setSnackbarProps({...snackbarProps, open: true, message: ERROR_MESSAGE_SNACKBAR_SERVER, severity: 'error'})
    }
    
  }

  const updateEmployeePreferences = async () => {
    if (!userData.personId) {
      router.push('/auth/login');
      return;
    }
    const res = await updatePersonPreferences(userData.personId, hasCar, relocateOption);
    if (res instanceof String) {
      setSnackbarProps({...snackbarProps, open: true, message: ERROR_MESSAGE_SNACKBAR, severity: 'error'})
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
        <ProfileComponent assetUrl={user?.assetUrl} title={user?.name ?? ''} subtitle={user?.email ?? ''} />
      </Box>
      <Grid container spacing={3} sx={{ display: 'flex', flexDirection: 'column'}}>
        <Grid size={{ xs: 12 }}>
          <AccountDataComponent session={session} setSnackbarProps={handleSnackbarSons}/>
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
        userData={user}
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