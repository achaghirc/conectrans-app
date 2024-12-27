import React, { ChangeEvent, useEffect, useLayoutEffect, useState } from 'react'
import { EducationDTO, State } from '@/lib/definitions'
import Grid from '@mui/material/Grid2';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, styled, TextField } from '@mui/material';
import { DateMobilePickerComponent, DatePickerComponent } from '../custom/components/datePickerCustom';
import dayjs from 'dayjs';
import { AddCircleOutline } from '@mui/icons-material';
import { ZodIssue } from 'zod';
import { validateEducation } from '@/lib/validations/educationValidate';
import useUtilsHook from '../hooks/useUtils';


const CustomDialog =  styled(Dialog)(({ theme }) => ({
	'& .MuiDialog-paper': {
		width: '100% !important',
		maxWidth: '700px',
		borderRadius: '15px',
	},
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}));


type AddEducationComponentProps = {
	educations: EducationDTO[];
	open: boolean;
  editEducation: EducationDTO |undefined;
	errors?: State;
	setEducations: (data: EducationDTO[]) => void;
	onClose: () => void;
}

export default function AddEducationComponent({
	educations,
	open,
  editEducation,
	errors, 
	setEducations,
	onClose}: AddEducationComponentProps) {
  const [mediaQuery, setMediaQuery] = useState<boolean | null>(null); 
  const [education, setEducation] = useState<EducationDTO>({
		title: '',
		center: '',
    specialty: '',
		startYear: new Date(new Date().setHours(23,0,0,0)),
		endYear: new Date(new Date().setHours(23,0,0,0)),
	} as EducationDTO);
	const { handleZodError, handleZodHelperText } = useUtilsHook();
  const [err, setErr] = useState<State>(errors ?? {message: null, errors: []});

  useEffect(() => {
    if (editEducation && editEducation != undefined) {
      setEducation(editEducation);
    } else {
      setEducation({
        title: '',
        center: '',
        specialty: '',
        startYear: new Date(new Date().setHours(23,0,0,0)),
        endYear: new Date(new Date().setHours(23,0,0,0)),
      } as EducationDTO);
    }
  }, [editEducation]);

	useLayoutEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 600px)');
		setMediaQuery(mediaQuery.matches);
		mediaQuery.addEventListener('change', (e) => {
			setMediaQuery(e.matches);
		});
	},[]);

    
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setEducation({...education, [name]: value});
	}
  const handleDateChange = (e: any) => {
    const {name, value} = e.target;
    setEducation({...education, [name]: new Date(value)});
  }

	const handleClose = async () => {

    const validate = await validateEducation(err, education);
    if (validate.errors!.length > 0) {
      setErr(validate);
      return;
    }
    if(editEducation) {
      const index = educations.findIndex((exp) => exp === editEducation);
      educations[index] = education;
      setEducations(educations);
    } else {
      // Add new education
      setEducations([...educations, education]);
    }
    setEducation({} as EducationDTO);
    setErr({message: null, errors: []});
    onClose();
	}
  
  return (
		<CustomDialog
			onClose={onClose}
			open={open}
			aria-label='add-education-dialog'
			fullWidth={mediaQuery ? true : false}
		>
			<DialogTitle sx={{ m: 0, p: 2 }} id="experience-dialog-title">Estudio</DialogTitle>
			<Divider variant='middle' />
			<DialogContent>
				<Grid container spacing={2} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
					<Grid size={{ xs: 12, sm: 6 }}>
						<TextField
              fullWidth
              label='Título'
              name='title'
              value={education.title}
              onChange={handleChange}
              error={handleZodError(err, 'title')}
              helperText={handleZodHelperText(err, 'title')}
              required
              />
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<TextField
              fullWidth
              label='Centro'
              name='center'
              value={education.center}
              onChange={handleChange}
              error={handleZodError(err, 'center')}
              helperText={handleZodHelperText(err, 'center')}
              required
              />
					</Grid>
					<Grid size={{ xs:12, sm: 6}}>
						{mediaQuery == null ? null :
							mediaQuery ? (
								<DatePickerComponent 
									label='Fecha Inicio' 
                  name='startYear'
									value={dayjs(education.startYear)} 
									errors={err}
									setValue={(value) => handleDateChange({target: {name: 'startYear', value: new Date(value?.format('YYYY-MM-DD') || '')}})} 
								/>
							) : (
								<DateMobilePickerComponent 
									label='Fecha Inicio' 
                  name='startYear'
									value={dayjs(education.startYear)} 
									errors={err}
									setValue={(value) => handleDateChange({target: {name: 'startYear', value: new Date(value?.format('YYYY-MM-DD') || '')}})} 
								/>
							)
						}
					</Grid>
					<Grid size={{xs:12, sm: 6}}>
						{mediaQuery == null ? null :
							mediaQuery ? (
								<DatePickerComponent 
									label='Fecha fin'
                  name='endYear'
									value={dayjs(education.endYear)} 
									errors={err}
									setValue={(value) => handleDateChange({target: {name: 'endYear', value: new Date(value?.format('YYYY-MM-DD') || '')}})} 
								/>
							) : (
								<DateMobilePickerComponent 
									label='Fecha fin'
                  name='endYear'
									value={dayjs(education.endYear)} 
									errors={err}
									setValue={(value) => handleDateChange({target: {name: 'endYear', value: new Date(value?.format('YYYY-MM-DD') || '')}})} 
								/>
							)
						}
					</Grid>
					
				</Grid>
			</DialogContent>
			<DialogActions sx={{ display: 'flex', mr: 3, mb: 2}}>
				<Button 
					variant='contained' 
					color='error' 
					onClick={() => {
						onClose();
					}} 
					sx={{ mr: 2 }}
					>
						Cancelar
				</Button>
				<Button 
					variant='outlined' 
					onClick={handleClose} 
					startIcon={<AddCircleOutline />}
				>
					Añadir
				</Button>
			</DialogActions>
		</CustomDialog>
  )
}
