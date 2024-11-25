import React, { ChangeEvent, useEffect, useLayoutEffect, useState } from 'react'
import { EducationDTO, SignUpCandidateFormData, State } from '@/lib/definitions'
import Grid from '@mui/material/Grid2';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, styled, TextField } from '@mui/material';
import { handleZodError, handleZodHelperText } from '@/lib/utils';
import { DateMobilePickerComponent, DatePickerComponent } from '../custom/components/datePickerCustom';
import dayjs from 'dayjs';
import { AddCircleOutline } from '@mui/icons-material';
import { set, ZodIssue } from 'zod';


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
	formData: SignUpCandidateFormData;
	errors?: State;
  editEducation: EducationDTO |undefined;
	setFormData: (data: any) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

export default function AddEducationComponent({
	formData,
	open,
  editEducation,
	errors, 
	setFormData,
	setOpen}: AddEducationComponentProps) {
  const [mediaQuery, setMediaQuery] = useState<boolean | null>(null); 
  const [education, setEducation] = useState<EducationDTO>({
		title: '',
		center: '',
    specialty: '',
		startYear: dayjs(new Date()).format('YYYY-MM-DD'),
		endYear: dayjs(new Date()).format('YYYY-MM-DD'),
	} as EducationDTO);
	const [err, setErr] = useState<State>(errors ?? {message: null, errors: []});
	const [error, setError] = useState(false);

  const maxWords = 250;
  
  useEffect(() => {
    if (editEducation) {
      setEducation(editEducation);
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

	const handleClose = () => {
			const start = dayjs(education.startYear)
			const end = dayjs(education.endYear)
			let errors: State= {message: null, errors: []};
			if (start == null ) {
				const state: ZodIssue = {code: 'invalid_literal', expected: '', received: '', path: ['Fecha Inicio'], message: 'Fecha inicio no puede estar vacía'};
				errors = {...err, message: state.message, errors: [state]};
			}	else {
				setEducation({...education, startYear: start.format('YYYY-MM-DD')});
			}
			if(end == null) {
				const state: ZodIssue = {code: 'invalid_literal', expected: '', received: '', path: ['Fecha Fin'], message: 'Fecha fin no puede estar vacía'};
				errors = {...err, message: state.message, errors: [state]};
			} else {
				setEducation({...education, endYear: end.format('YYYY-MM-DD')});
			}
			if (start.isAfter(end)) {
				const state: ZodIssue = {code: 'invalid_literal', expected: '', received: '', path: ['Fecha Inicio'], message: 'Fecha inicio anterior a la fecha fin'};
				errors = {...err, message: state.message, errors: [state]};
			} else {
				setErr({...err, message: null, errors: []});
			}
			
			if (errors.errors!.length > 0) {
				setErr(errors);
				return;
			}
      if(editEducation) {
        const index = formData.educations.findIndex((exp) => exp === editEducation);
        formData.educations[index] = education;
        setFormData({...formData, educations: formData.educations});
      } else {
        setFormData({...formData, educations: [...formData.educations, education]});
      }
			setOpen(false);
			setEducation({} as EducationDTO);
			setErr({message: null, errors: []});
	}
  
  return (
		<CustomDialog
			onClose={() => setOpen(false)}
			open={open}
			aria-label='add-education-dialog'
			fullWidth={mediaQuery ? true : false}
		>
			<DialogTitle sx={{ m: 0, p: 2 }} id="experience-dialog-title">Experiencia</DialogTitle>
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
									value={dayjs(education.startYear)} 
									errors={err}
									setValue={(value) => setEducation({...education, startYear: value?.format('YYYY-MM-DD') || ''})} 
								/>
							) : (
								<DateMobilePickerComponent 
									label='Fecha Inicio'  
									value={dayjs(education.startYear)} 
									errors={err}
									setValue={(value) =>setEducation({...education, startYear: value?.format('YYYY-MM-DD') || ''})} 
								/>
							)
						}
					</Grid>
					<Grid size={{xs:12, sm: 6}}>
						{mediaQuery == null ? null :
							mediaQuery ? (
								<DatePickerComponent 
									label='Fecha fin'
									value={dayjs(education.endYear)} 
									errors={err}
									setValue={(value) => setEducation({...education, endYear: value?.format('YYYY-MM-DD') || ''})} 
								/>
							) : (
								<DateMobilePickerComponent 
									label='Fecha fin'
									value={dayjs(education.endYear)} 
									errors={err}
									setValue={(value) => setEducation({...education, endYear: value?.format('YYYY-MM-DD') || ''})} 
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
						setOpen(false);
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
