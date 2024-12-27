'use client';
import React, { ChangeEvent, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Button, CircularProgress, Divider, FormControl, FormHelperText, IconButton, Skeleton, SnackbarCloseReason, Typography } from '@mui/material'
import TableExperiencesComponent from '../../shared/custom/components/table/TableExperiencesComponent'
import { AddCircleOutlineOutlined, FilePresentOutlined, RemoveCircleOutline } from '@mui/icons-material'
import ExperienceComponent from '../../shared/auth/ExperienceComponent'
import { AssetSlimDTO, CloudinaryRemoveResponse, CloudinaryUploadResponse, EducationDTO, ExperienceDTO, PersonLanguageDTO } from '@/lib/definitions'
import { Session } from 'next-auth'
import { EncoderType } from '@prisma/client'
import { deleteExperiences, saveExperiences } from '@/lib/data/experiences';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAssetFileByUserId, removeAssetFromDatabase, saveAssetOnDatabase } from '@/lib/data/asset';
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { removeFileFromCloud, uploadFileToCloud } from '@/lib/services/cloudinary';
import { set } from 'zod';
import { SUCCESS_MESSAGE_SNACKBAR } from '@/lib/constants';;

type DriverExperienceComponentProps = {
  session: Session | null;
  encoders: EncoderType[];
  data: ExperienceDTO[];
  saveAction: () => void;
}


const DriverExperienceComponent: React.FC<DriverExperienceComponentProps> = (
  { session, encoders, data, saveAction}
) => {
  const queryClient = useQueryClient();
  const [snackbarProps, setSnackbarProps] = React.useState<SnackbarCustomProps>({
    open: false,
    handleClose: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => handleCloseSnackbar(event, reason),
  } as SnackbarCustomProps);
  const [message, setMessage] = React.useState<string>('');

  const [loading, setLoading] = React.useState<boolean>(false);
  const [changedData, setChangedData] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false)

  const [experiences, setExperiences] = React.useState<ExperienceDTO[]>(data)
  const experienceTypes: EncoderType[] = React.useMemo(() => encoders.filter((encoder) => encoder.type === 'EXPERIENCE_TYPE'), [encoders]);
  const [file, setFile] = React.useState<File | null>(null);
  const [summaryFile, setSummaryFile] = React.useState<AssetSlimDTO | undefined>(undefined);
  const [isDeleted, setIsDeleted] = React.useState<boolean>(false);

  const { data: assetFile, isLoading: isLoadingAssetFile, isError: isErrorAssetFile } = useQuery({
    queryKey: ['assetFile', session?.user.id],
    queryFn: (): Promise<AssetSlimDTO | undefined> => getAssetFileByUserId(session?.user.id ?? '')
  });

  useEffect(() => {
    if (data) {
      setExperiences(data);
    } 
  }, [data])

  useEffect(() => {
    if (assetFile && assetFile.id) {
      setSummaryFile(assetFile);
    }
  }, [assetFile])

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    setSnackbarProps({...snackbarProps, open: false});
  }

  const handleAddExperience = (experience: ExperienceDTO) => {
    setChangedData(true);
    setExperiences([...experiences, experience]);
  }
  const handleDeleteExperience = (experience: ExperienceDTO) => {
    const newExperiences = experiences.filter((exp) => exp !== experience);
    if (newExperiences.every((exp) => data.includes(exp)) && data.length === newExperiences.length) {
      setChangedData(false);
    } else {
      setChangedData(true);
    }
    setExperiences(newExperiences);
  }

  const addFileFunction = (file: File) => {
    setChangedData(true);
    setFile(file);
    setSummaryFile({
      id: 0,
      publicId: '',
      url: '',
      secureUrl: '',
      height: 0,
      width: 0,
      format: file.type,
      originalFilename: file.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
  const removeFileFunction = (file: AssetSlimDTO) => {
    setChangedData(true);
    setIsDeleted(true);
    setSummaryFile(undefined);
  }

  const update = async () => {
    setLoading(true);

    let saveFunction: Promise<void> = Promise.resolve();
    let deleteFunction: Promise<void> = Promise.resolve();
    const newExperiences = experiences.filter((exp) => !data.includes(exp));
    
    if(newExperiences.length > 0) {
      //Save here new experiences
      const experiencesToSave: ExperienceDTO[] = newExperiences.map((exp) => {
        return {...exp, 
          id: undefined,
          experienceTypeId: experienceTypes.find((type) => type.name === exp.experienceType)?.id ?? 0,
        };
      });
      saveFunction = saveExperiences(experiencesToSave, session?.user.id ?? '');
    }
  
    //Delete here experiences
    const experiencesToDelete: ExperienceDTO[] = data.filter((exp) => !experiences.includes(exp));
    deleteFunction = deleteExperiences(experiencesToDelete);
        
    await handleDeleteFile().then(() => {
      console.log('ok');
    }).catch(err => {
      setSnackbarProps({...snackbarProps, open: true, message: message, severity: 'error'});
      console.error('Error en el proceso gestion de ficheros:', err);
      return;
    });
    
    await handleUploadFile().catch((err) => {
      setSnackbarProps({...snackbarProps, open: true, message: message, severity: 'error'});
      console.error('Error subiendo el nuevo archivo, Intentelo de nuevo', err);
      return;
    });
    
    const [
      saveResult, deleteResult
    ] = await Promise.allSettled([saveFunction, deleteFunction]);

    if (saveResult.status === 'rejected' || deleteResult.status === 'rejected') {
      setSnackbarProps({...snackbarProps, open: true, message: message, severity: 'error'});
      console.error('Error en el proceso de registro:', saveResult.status, deleteResult.status);
      return;
    }

    saveAction();
    setChangedData(false);
    setLoading(false);
    setSnackbarProps({...snackbarProps, open: true, message: SUCCESS_MESSAGE_SNACKBAR, severity: 'success'});
    setIsDeleted(false);
    queryClient.refetchQueries({queryKey: ['assetFile', session!.user.id]});
  }

  const handleUploadFile = async () => {
    if (file) {
      try {
        const cloudinaryResponse: CloudinaryUploadResponse = await uploadFileToCloud(file, session?.user.email ?? '');
        await saveAssetOnDatabase(cloudinaryResponse, session!.user.id ?? '');
      } catch (e:any) {
        if (file) {
          setFile(null);
        }
        setMessage('Error al subir el archivo');
      }
    }
  }
  const handleDeleteFile = async () => {
    if (!isDeleted) {
      return;
    }
    try {
      const cloudinaryResponse: CloudinaryRemoveResponse = await removeFileFromCloud(assetFile!.publicId, assetFile!.format!);
      if (cloudinaryResponse && cloudinaryResponse.result === 'ok') {
        await removeAssetFromDatabase(assetFile!.id);
      } else {
        setMessage('Error al borrar el archivo');
      }
    } catch (e:any) {
      setMessage('Error en el proceso de borrado del archivO');
    }
  }


  const TableExperinciesComponentMemo = React.memo(function TableExperinciesComponentMemo({experiencesData}: {experiencesData: ExperienceDTO[]}) {
    return <TableExperiencesComponent experiences={experiencesData} deleteExperience={handleDeleteExperience} />;
  })

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
            Experiencias
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }}/>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TableExperinciesComponentMemo experiencesData={experiences ?? []} />
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
              Añadir experiencia
          </Button>
        </Box>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Box>
          <Typography color='textPrimary' component={'h3'} variant='h6'  sx={{ fontSize: 16, fontWeight: 500 }}>
            Currículum
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }}/>
        <SummaryAssetFile
          assetFile={summaryFile} 
          isLoadingAssetFile={isLoadingAssetFile}
          isErrorAssetFile={isErrorAssetFile}
          addFile={addFileFunction} 
          removeFile={removeFileFunction} 
        />
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
      <ExperienceComponent
				experienceTypes={experienceTypes}
				open={open}
				setValue={handleAddExperience}
				setOpen={(value:boolean) => setOpen(value)}
			/>
      <SnackbarCustom 
        {...snackbarProps}
      />
    </Box>
  )
}

export default DriverExperienceComponent


const SummaryAssetFile: React.FC<{assetFile: AssetSlimDTO | undefined, isLoadingAssetFile: boolean, isErrorAssetFile: boolean, addFile: (file: File) => void, removeFile: (file: AssetSlimDTO) => void}> = ({assetFile, isLoadingAssetFile, isErrorAssetFile, addFile, removeFile}) => {
  const [fileError, setFileError] = React.useState<string | null>(null);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if(e.target.files[0].size > 25000000){
        setFileError('El tamaño del archivo no puede ser mayor a 25MB');
        return;
      }
      addFile(e.target.files[0]);
      setFileError(null);
    } else {
      setFileError('El archivo no es válido');
    }
  };

  const handleRemoveFile = () => {
    removeFile(assetFile!);
  }

  if (isLoadingAssetFile) {
    return <SummayAssetFileSkeleton />
  }


  return (
    <>
      {assetFile == undefined  || assetFile.id == undefined ? (
        <Grid size={{ xs:12 }} sx={{ display: 'flex', justifyContent: 'center'}}>
          <FormControl fullWidth error={fileError ? true : false} variant='outlined'>
            <Button
              variant="outlined"
              onClick={() => document.getElementById('file')?.click()}
              component="span"
            >
              <input 
                id='file'
                type="file" 
                accept={'.pdf, .doc, .docx, .jpg, .png'}
                onChange={handleFileChange}
                style={{ display: 'none', marginTop: '8px' }}
              />
              Cargar Archivo
            </Button>
            <FormHelperText>{fileError}</FormHelperText>
          </FormControl>
        </Grid>
      ) : (
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >	
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
            }}
          >
            <FilePresentOutlined sx={{ width: 30, height: 30}} />
            <Typography variant='body1' fontWeight={'semibold'}>
              {`${assetFile.originalFilename}`}
            </Typography>
          </Box>
            <IconButton onClick={() => handleRemoveFile()}>
              <RemoveCircleOutline color='error' />
            </IconButton>
        </Box>
      )}
    </>
  )
}


const SummayAssetFileSkeleton: React.FC<{}> = () =>  {
  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >	
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}
      >
        <Skeleton variant="rectangular" width={30} height={30} />
        <Skeleton variant="text" width={200} sx={{ ml: 1 }} />
      </Box>
      <IconButton>
        <Skeleton variant="circular" width={24} height={24} />
      </IconButton>
    </Box>
  )
}