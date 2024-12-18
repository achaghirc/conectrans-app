import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Button, CircularProgress, Divider, SnackbarCloseReason, Typography } from '@mui/material'
import { EducationDTO } from '@/lib/definitions'
import TableEducationComponent from '../../shared/custom/components/table/TableEducationComponent'
import { AddCircleOutlineOutlined } from '@mui/icons-material'
import AddEducationComponent from '../../shared/auth/AddEducationComponent'
import { deleteEducations, saveEducationData } from '@/lib/data/education'
import { Session } from 'next-auth'
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom'
import { SUCCESS_MESSAGE_SNACKBAR } from '@/lib/utils'

type DriverEducationComponentProps = {
  session: Session | null;
  data: EducationDTO[];
  saveAction: () => void;
}

const DriverEducationComponent: React.FC<DriverEducationComponentProps> = (
  { session, data, saveAction}
) => {
  const [snackbarProps, setSnackbarProps] = React.useState<SnackbarCustomProps>({
    open: false,
    handleClose: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => handleCloseSnackbar(event, reason),
  } as SnackbarCustomProps);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [changedData, setChangedData] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false)
  const [educationToEdit, setEducationToEdit] = React.useState<EducationDTO>();
  const [educations, setEducations] = React.useState<EducationDTO[]>(data)
  
  useEffect(() => {
    if (data) {
      setEducations(data);
    }
  }, [data])
  
  const handleAddEducations = (educationsArr: EducationDTO[]) => {
    setChangedData(true);
    setEducations(educationsArr);
  }

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    setSnackbarProps({...snackbarProps, open: false});
  }

  const handleDeleteEducation = (education: EducationDTO) => {
    const newEducations = educations.filter((edu) => edu !== education);
    if (newEducations.every((edu: EducationDTO) => data.includes(edu)) && data.length === newEducations.length) {
      setChangedData(false);
    }else {
      setChangedData(true);
    }
    setEducations(newEducations);
  }
  const handleEditEducation = (education: EducationDTO) => {
    setEducationToEdit(education);
    setOpen(true);
  }
  const educationComponentClose = () => {
    setEducationToEdit(undefined);
    setOpen(false);
  }

  const update = async () => {
    setLoading(true);
    let message = SUCCESS_MESSAGE_SNACKBAR;
    let severity = snackbarProps.severity;
    const newEducations = educations.filter((edu) => !data.includes(edu));

    let saveFunction: Promise<void> | undefined;
    let deleteFunction: Promise<void> | undefined;
    if(newEducations.length > 0) {
      //Save here new educations
      saveFunction = saveEducationData(newEducations, session?.user.id ?? '');
    }

    const educationsToDelete = data.filter((edu) => !educations.includes(edu));
    if(educationsToDelete.length > 0) {
      //Delete here educations
      deleteFunction = deleteEducations(educationsToDelete);
    }
    const [saveResult, deleteResult] = await Promise.allSettled([saveFunction, deleteFunction]);

    if (saveResult.status == 'rejected' || deleteResult.status == 'rejected'){
      message =  'Error actualizando los datos de estudios';
      severity = 'error';
    }

    if (saveResult.status == 'fulfilled' || deleteResult.status == 'fulfilled') {
      severity = 'success';
    }
    saveAction();
    setChangedData(false);
    setLoading(false);
    setSnackbarProps({...snackbarProps, open: true, message: message, severity: severity});
  }
  const EducationsTableMemo = React.memo(function EducationsTableMemo({ educations }: { educations: EducationDTO[] }) {
    return (
      <TableEducationComponent 
        educations={educations ?? []}
        deleteEducationExperience={(row) => handleDeleteEducation(row)}
        editEducationExperience={(row) => handleEditEducation(row)}
      />
    )
  });
  return (
    <Box 
      component={'div'}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2
      }}
    >
      <Grid size={{ xs: 12 }}>
        <Box>
          <Typography color='textPrimary' component={'h3'} variant='h6'  sx={{ fontSize: 16, fontWeight: 500 }}>
            Estudios
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }}/>
        <Grid size={{ xs: 12 }}>
          <EducationsTableMemo educations={educations} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box 
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}
          >
            <Button 
              variant='outlined' 
              color='primary' 
              startIcon={<AddCircleOutlineOutlined />}
              onClick={() => setOpen(true)}
              sx={{ alignItems: 'center', mt: 2 }}
              >
                Añadir estudios
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end'}}>
        <Button 
          endIcon={loading ? <CircularProgress size={20} /> : null}
          variant='outlined' 
          color='secondary' 
          onClick={update} 
          disabled={!changedData}
        >
          Guardar
        </Button>
      </Grid>
      <AddEducationComponent
        open={open}
        onClose={educationComponentClose}
        educations={educations}
        editEducation={educationToEdit}
        setEducations={(value:EducationDTO[]) => handleAddEducations(value)}
      />
       <SnackbarCustom
        {...snackbarProps}
      />
    </Box>
  )
}

export default DriverEducationComponent
