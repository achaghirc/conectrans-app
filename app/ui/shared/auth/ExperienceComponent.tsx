import React, { ChangeEvent, useLayoutEffect, useState } from 'react'
import { EncoderType, SignUpCandidateFormData, SignUpExperienceData, State } from '@/lib/definitions'
import Grid from '@mui/material/Grid2';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, MenuProps, Select, SelectChangeEvent, styled, TextField, Typography } from '@mui/material';
import { handleZodError, handleZodHelperText } from '@/lib/utils';
import { encode } from 'punycode';
import { DateMobilePickerComponent, DatePickerComponent } from '../custom/components/datePickerCustom';
import dayjs from 'dayjs';
import { AddCircleOutline, AddCircleSharp, SaveAltOutlined } from '@mui/icons-material';
import { set, ZodIssue } from 'zod';


const MenuProperties : Partial<MenuProps>= {
    PaperProps: {
        style: {
            maxHeight: 300,
            overflow: 'auto',
        },
    },
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
    },
}

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


type ExperienceComponentProps = {
	experienceTypes: EncoderType[];
	formData: SignUpCandidateFormData;
	errors?: State;
	setFormData: (data: any) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

export default function ExperienceComponent({
	experienceTypes,
	formData,
	open,
	errors, 
	setFormData,
	setOpen}: ExperienceComponentProps) {
  const [mediaQuery, setMediaQuery] = useState<boolean | null>(null); 
  const [experiences, setExperiences] = useState<SignUpExperienceData>({
		experienceType: '',
		startYear: dayjs(new Date()).format('YYYY-MM-DD'),
		endYear: dayjs(new Date()).format('YYYY-MM-DD'),
		description: '',
	} as SignUpExperienceData);
	const [experiencesTypes, setExperiencesTypes] = useState<EncoderType[]>(experienceTypes);
	const [err, setErr] = useState<State>(errors ?? {message: null, errors: []});
	const [error, setError] = useState(false);

  const maxWords = 250;
	
	useLayoutEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 600px)');
		setMediaQuery(mediaQuery.matches);
		mediaQuery.addEventListener('change', (e) => {
			setMediaQuery(e.matches);
		});
	},[]);

    
	const handleChange = (e: SelectChangeEvent<string>) => {
			const {name, value} = e.target;
			setExperiences({...experiences, [name]: value});
	}

	const handleClose = () => {
		
		if(experiences.experienceType !== '') {	
			const start = dayjs(experiences.startYear)
			const end = dayjs(experiences.endYear)
			let errors: State= {message: null, errors: []};
			if (start == null ) {
				const state: ZodIssue = {code: 'invalid_literal', expected: '', received: '', path: ['Fecha Inicio'], message: 'Fecha inicio no puede estar vacía'};
				errors = {...err, message: state.message, errors: [state]};
			}	else {
				setExperiences({...experiences, startYear: start.format('YYYY-MM-DD')});
			}
			if(end == null) {
				const state: ZodIssue = {code: 'invalid_literal', expected: '', received: '', path: ['Fecha Fin'], message: 'Fecha fin no puede estar vacía'};
				errors = {...err, message: state.message, errors: [state]};
			} else {
				setExperiences({...experiences, endYear: end.format('YYYY-MM-DD')});
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
			setFormData({...formData, experiences: [...formData.experiences, experiences]});
			setOpen(false);
			setExperiences({} as SignUpExperienceData);
			setErr({message: null, errors: []});
		}	
	}
	const countWords = (text: string) => {
    return text ? text.length : 0;
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    const wordCount = countWords(inputText);

    if (wordCount > maxWords) {
      setError(true);
			return;
    } else {
      setError(false);
    }

    setExperiences({...experiences, description: inputText});
  };
  
  return (
		<CustomDialog
			onClose={() => setOpen(false)}
			open={open}
			aria-label='experience-dialog'
			fullWidth={mediaQuery ? true : false}
		>
			<DialogTitle sx={{ m: 0, p: 2 }} id="experience-dialog-title">Experiencia</DialogTitle>
			<Divider variant='middle' />
			<DialogContent>
				<Grid container spacing={2} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
					<Grid size={{ xs: 12, sm: 12 }}>
						<FormControl fullWidth error={handleZodError(err, 'experienceType')} required>
						<Autocomplete
							id="experienceType"
							options={experiencesTypes.map((type) => type.name)} // List of options from experiencesTypes
							freeSolo // Allows custom input
							value={experiences.experienceType ?? ''}
							onChange={(event, newValue) => handleChange({ target: { name: 'experienceType', value: newValue! } } as unknown as SelectChangeEvent<string>)}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Experiencia"
									variant="outlined"
									name="experienceType"
								/>
							)}
						/>
						</FormControl>
					</Grid>
					<Grid size={{ xs:12, sm: 6}}>
						{mediaQuery == null ? null :
							mediaQuery ? (
								<DatePickerComponent 
									label='Fecha Inicio' 
									value={dayjs(experiences.startYear)} 
									errors={err}
									setValue={(value) => setExperiences({...experiences, startYear: value?.format('YYYY-MM-DD') || ''})} 
								/>
							) : (
								<DateMobilePickerComponent 
									label='Fecha Inicio'  
									value={dayjs(experiences.startYear)} 
									errors={err}
									setValue={(value) =>setExperiences({...experiences, startYear: value?.format('YYYY-MM-DD') || ''})} 
								/>
							)
						}
					</Grid>
					<Grid size={{xs:12, sm: 6}}>
						{mediaQuery == null ? null :
							mediaQuery ? (
								<DatePickerComponent 
									label='Fecha fin'
									value={dayjs(experiences.endYear)} 
									errors={err}
									setValue={(value) => setExperiences({...experiences, endYear: value?.format('YYYY-MM-DD') || ''})} 
								/>
							) : (
								<DateMobilePickerComponent 
									label='Fecha fin'
									value={dayjs(experiences.endYear)} 
									errors={err}
									setValue={(value) => setExperiences({...experiences, endYear: value?.format('YYYY-MM-DD') || ''})} 
								/>
							)
						}
					</Grid>
					<Grid size={{xs:12, sm: 12}}>
						<TextField
							fullWidth
							label='Descripción'
							name='description'
							placeholder='Descripción de la experiencia, Nombre de la empresa, cargo, funciones, etc.'
							multiline
							rows={4}
							value={experiences.description}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleDescriptionChange(e)}
							error={handleZodError(err, 'description')}
							helperText={handleZodHelperText(err, 'description')}
							required
						/>
						<Box display="flex" justifyContent="space-between">
							<Typography variant="body1"></Typography>
							<Typography variant="body2" color={countWords(experiences.description) > maxWords ? 'error' : 'textSecondary'}>
								{`${countWords(experiences.description)} / ${maxWords} words`}
							</Typography>
						</Box>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions sx={{ display: 'flex', mr: 3, mb: 2}}>
				<Button 
					variant='contained' 
					color='error' 
					onClick={() => {
						setOpen(false);
						setExperiences({} as SignUpExperienceData);
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
