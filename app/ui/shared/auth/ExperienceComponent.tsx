import React, { ChangeEvent, useLayoutEffect, useState } from 'react'
import { EncoderType, ExperienceDTO, State } from '@/lib/definitions'
import Grid from '@mui/material/Grid2';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormHelperText, SelectChangeEvent, styled, TextField, Typography } from '@mui/material';
import { DateMobilePickerComponent, DatePickerComponent } from '../custom/components/datePickerCustom';
import dayjs from 'dayjs';
import { AddCircleOutline } from '@mui/icons-material';
import { ZodIssue } from 'zod';
import { validateExperience } from '@/lib/validations/experienceValidate';
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


type ExperienceComponentProps = {
	experienceTypes: EncoderType[];
	errors?: State;
	setValue: (data: ExperienceDTO) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

export default function ExperienceComponent({
	experienceTypes,
	open,
	errors, 
	setValue,
	setOpen}: ExperienceComponentProps) {
  const [mediaQuery, setMediaQuery] = useState<boolean | null>(null); 
  const [experience, setExperience] = useState<ExperienceDTO>({
		startYear: new Date(new Date().setHours(23,0,0,0)),
		endYear: new Date(new Date().setHours(23,0,0,0)),
		description: '',
	} as ExperienceDTO);
  const { handleZodError, handleZodHelperText } = useUtilsHook();
	const [err, setErr] = useState<State>(errors ?? {message: null, errors: []});

  const maxWords = 250;
	
	useLayoutEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 600px)');
		setMediaQuery(mediaQuery.matches);
		mediaQuery.addEventListener('change', (e) => {
			setMediaQuery(e.matches);
		});
	},[]);

  const handleDateChange = (e: any) => {
    const {name, value} = e.target;
    setExperience({...experience, [name]: new Date(value)});
  }
    
	const handleChange = (e: SelectChangeEvent<string>) => {
			const {name, value} = e.target;
			setExperience({...experience, [name]: value});
	}

  //TODO: HANDLE DATES AND ERRORS CORRECTLY
	const handleClose = async () => {
    const validate = await validateExperience(err, experience);
    if (validate.errors!.length > 0) {
      setErr(validate);
      return;
    }
    setOpen(false);
    setValue(experience);
    setExperience({} as ExperienceDTO);
    setErr({message: null, errors: []});	
	}
	const countWords = (text: string) => {
    return text ? text.length : 0;
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    const wordCount = countWords(inputText);
    if (wordCount > maxWords) {
			return;
    }
    setExperience({...experience, description: inputText});
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
							options={experienceTypes.map((type) => type.name)} // List of options from experiencesTypes
							freeSolo // Allows custom input
							value={experience.experienceType ?? ''}
							onChange={(event, newValue) => handleChange({ target: { name: 'experienceType', value: newValue! } } as unknown as SelectChangeEvent<string>)}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Experiencia"
									variant="outlined"
									name="experienceType"
                  value={''}
                  required={true}
								/>
							)}
						/>
						</FormControl>
            <FormHelperText error={handleZodError(err, 'experienceType')}>{handleZodHelperText(err, 'experienceType')}</FormHelperText>
					</Grid>
					<Grid size={{ xs:12, sm: 6}}>
						{mediaQuery == null ? null :
							mediaQuery ? (
								<DatePickerComponent 
									label='Fecha Inicio'
                  name='startYear'
									value={dayjs(experience.startYear)} 
									errors={err}
									setValue={(value) => handleDateChange({target: {name: 'startYear', value: new Date(value?.format('YYYY-MM-DD') || '')}})} 
								/>
							) : (
								<DateMobilePickerComponent 
									label='Fecha Inicio'  
                  name='startYear'
									value={dayjs(experience.startYear)} 
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
									value={dayjs(experience.endYear)} 
									errors={err}
									setValue={(value) => handleDateChange({target: {name: 'endYear', value: new Date(value?.format('YYYY-MM-DD') || '')}})} 
								/>
							) : (
								<DateMobilePickerComponent 
									label='Fecha fin'
                  name='endYear'
									value={dayjs(experience.endYear)} 
									errors={err}
									setValue={(value) => handleDateChange({target: {name: 'endYear', value: new Date(value?.format('YYYY-MM-DD') || '')}})} 
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
							value={experience.description}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleDescriptionChange(e)}
							error={handleZodError(err, 'description')}
							helperText={handleZodHelperText(err, 'description')}
							required
						/>
						<Box display="flex" justifyContent="space-between">
							<Typography variant="body1"></Typography>
							<Typography variant="body2" color={countWords(experience.description) > maxWords ? 'error' : 'textSecondary'}>
								{`${countWords(experience.description)} / ${maxWords} words`}
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
						setExperience({} as ExperienceDTO);
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
