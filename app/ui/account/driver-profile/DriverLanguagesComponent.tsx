import React, { useEffect } from 'react'
import { PersonLanguageDTO } from '@/lib/definitions'
import Grid from '@mui/material/Grid2'
import { Box, Button, CircularProgress, Divider, SnackbarCloseReason, Typography } from '@mui/material'
import LanguagesComponentSignUp from '../../shared/auth/LanguageComponentSignup'
import { useQuery } from '@tanstack/react-query'
import { deletePersonLanguages, getLanguages, savePersonLanguages } from '@/lib/data/languaje'
import { Session } from 'next-auth'
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom'
import { SUCCESS_MESSAGE_SNACKBAR } from '@/lib/constants';

type DriverLanguagesComponentProps = {
  session: Session | null;
  data: PersonLanguageDTO[];   
  saveAction: () => void;
}

const DriverLanguagesComponent: React.FC<DriverLanguagesComponentProps> = (
  { session, data, saveAction }
) => {
  const [snackbarProps, setSnackbarProps] = React.useState<SnackbarCustomProps>({
    open: false,
    handleClose: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => handleCloseSnackbar(event, reason),
  } as SnackbarCustomProps);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [changedData, setChangedData] = React.useState<boolean>(false);
  const {data: languages, isLoading: isLoadingLanguages, isError: isErrorLanguages} = useQuery({ queryKey: ['languages'], queryFn: () => getLanguages()});
  const [selectedLenguages, setSelectedLanguages] = React.useState<PersonLanguageDTO[]>(data ?? []);

  useEffect(() => {
    if (data) {
      setSelectedLanguages(data);
    }
  }, [data])

  const handleAddLanguage = (value: PersonLanguageDTO) => {
    setChangedData(true);
    const newLanguages = [...selectedLenguages, value];
    setSelectedLanguages(newLanguages);
  }
  const handleDeleteLanguage = (value: PersonLanguageDTO) => {
    setChangedData(true);
    const newLanguages = selectedLenguages.filter((lang) => lang.languageCode !== value.languageCode);
    if (newLanguages.every((lang) => data.includes(lang)) && data.length === newLanguages.length) {
      setChangedData(false);
    } else {  
      setChangedData(true);
    }
    setSelectedLanguages(newLanguages);
  }

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarProps({...snackbarProps, open: false});
  }

  const update = async () => {
    setLoading(true);
    let message = SUCCESS_MESSAGE_SNACKBAR;
    let severity = snackbarProps.severity;
    let saveFunction: Promise<void> | undefined;
    let deleteFunction: Promise<void> | undefined;

    const newLanguages = selectedLenguages.filter((lang) => !data.includes(lang));
    if (newLanguages.length > 0) {
      saveFunction = savePersonLanguages(newLanguages,session?.user.id ?? '');
    }

    const languagesToDelete = data.filter((lang) => !selectedLenguages.includes(lang));
    if (languagesToDelete.length > 0) {
      deleteFunction = deletePersonLanguages(languagesToDelete);
    }

    const [saveResult, deleteResult] = await Promise.allSettled([saveFunction, deleteFunction]);

    if (saveResult.status == 'rejected' || deleteResult.status == 'rejected'){
      message =  'Error actualizando los datos de estudios';
      severity = 'error';
    }

    if (saveResult.status == 'fulfilled' && deleteResult.status == 'fulfilled') {
      severity = 'success';
    }
    saveAction();
    setChangedData(false);
    setLoading(false);
    setSnackbarProps({...snackbarProps, open: true, message: message, severity: severity});
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3
      }}
    >
      <Grid size={{ xs: 12 }}>
        <Box>
          <Typography color='textPrimary' component={'h3'} variant='h6'  sx={{ fontSize: 16, fontWeight: 500 }}>
            Idiomas
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }}/>
        <Grid size={{ xs: 12 }}>
          <LanguagesComponentSignUp
            languages={languages ?? []}
            handleAddLanguage={handleAddLanguage}
            handleDeleteLanguage={handleDeleteLanguage}
            selectedLenguages={selectedLenguages ?? []}
            loadingLanguages={isLoadingLanguages}
            isError={isErrorLanguages}
          />
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
      <SnackbarCustom
        {...snackbarProps}
      />
    </Box>
  )
}

export default DriverLanguagesComponent
