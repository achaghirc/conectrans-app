import { Box, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react'
import ButtonCustom from '../../shared/custom/components/button/ButtonCustom';
import { ContactPerson } from '@prisma/client';
import { getContactPersonById, updateContantPerson } from '@/lib/data/contactPerson';
import { Session } from 'next-auth';
import { useQuery } from '@tanstack/react-query';
import CompanyPersonContactComponentSkeleton from '../../shared/custom/components/skeleton/CompanyPersonContactComponentSkeleton';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ControllerTextFieldComponent } from '../../shared/custom/components/form/ControllersReactHForm';
import { validateContactPersonData } from '@/lib/validations/contactPersonValidate';
import { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { ERROR_MESSAGE_SNACKBAR, SUCCESS_MESSAGE_SNACKBAR } from '@/lib/constants';
import { State } from '@/lib/definitions';
import { set } from 'zod';

type CompanyPersonContactComponentProps = {
  session: Session | null;
  setSnackbarProps: (snackbarProps: Partial<SnackbarCustomProps>) => void;
}

const createInitialStateChanges = () => {
  return {
    name: false,
    lastname: false,
    document: false,
    companyPosition: false,
    email: false,
    phone: false,
  }
}



const CompanyPersonContactComponent: React.FC<CompanyPersonContactComponentProps> = React.memo(function CompanyPersonContactComponent(
  {session, setSnackbarProps}
) {
  if (!session) {return;}
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formState, setFormState] = React.useState<State>({
    message: '',
    errors: []
  });
  const fetchPersonData = () : Promise<ContactPerson | null> => getContactPersonById(session.user.personId ?? 0);
  const { 
    data: personData, 
    isLoading: personIsLoading, 
    isError: personIsError, 
    error: personError
  } = useQuery({
    queryKey: ['contactPerson', session.user.companyId], 
    queryFn: fetchPersonData,
  })

  const {
    control,
    handleSubmit,
  } = useForm<ContactPerson>();

  const onSubmit: SubmitHandler<ContactPerson> = async (data: ContactPerson) => {
    try {
      setLoading(true);
      const validate: State = await validateContactPersonData(data);
      if (validate.errors && validate.errors.length > 0) {
        setFormState(validate);
        return;
      }
      const response = await updateContantPerson(data);
      if (setSnackbarProps) {
        setSnackbarProps({open: true, message: SUCCESS_MESSAGE_SNACKBAR, severity: 'success'});
      }
    } catch (error) {
      console.error(error);
      setSnackbarProps?.({open: true, message: ERROR_MESSAGE_SNACKBAR, severity: 'error'});
    } finally {
      setLoading(false)
    }
  }

  if (personIsLoading) {
      return <CompanyPersonContactComponentSkeleton />
  }
  if (personIsError) {
      throw new Error(personError ? personError.message : 'Error al cargar los datos de la cuenta');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...control.register('id')} value={personData?.id ?? ''} />
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<ControllerTextFieldComponent
            name="name"
            control={control}
            value={personData?.name ?? ''}
            label='Nombre'
            formState={formState}
          />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<ControllerTextFieldComponent
            name="lastname"
            control={control}
            value={personData?.lastname ?? ''}
            label='Apellidos'
            formState={formState}
          />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<ControllerTextFieldComponent
            name='document'
            control={control}
            value={personData?.document ?? ''}
            label='DNI/NIE'
            formState={formState}
          />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<ControllerTextFieldComponent
            name='companyPosition'
            control={control}
            value={personData?.companyPosition ?? ''}
            label='Puesto en la empresa'
            formState={formState}
          />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<ControllerTextFieldComponent
            name='email'
            control={control}
            value={personData?.email ?? ''}
            label='Correo electrónico'
            formState={formState}
          />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<ControllerTextFieldComponent
            name='phone'
            control={control}
            value={personData?.phone ?? ''}
            label='Teléfono'
            formState={formState}
          />
				</Grid>
				<Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
					<ButtonCustom 
            title='Guardar'
            loading={loading}
            disable={false}
            color='secondary'
            onClick={() => {}}
            type='submit'
          />
				</Grid>
      </Grid>
    </form>
  )
});

export default CompanyPersonContactComponent;
