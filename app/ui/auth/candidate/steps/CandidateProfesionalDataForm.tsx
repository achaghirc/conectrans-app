import React, { ChangeEvent, useLayoutEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { Autocomplete, Avatar, Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Icon, IconButton, InputLabel, ListItemText, MenuItem, MenuProps, Paper, Select, SelectChangeEvent, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Country, EducationDTO, EncoderType, Licence, PersonLanguageDTO, SignUpCandidateFormData, SignUpExperienceData, State } from '@/lib/definitions';
import { handleZodError, handleZodHelperText } from '@/lib/utils';
import { DateMobilePickerComponent, DatePickerComponent } from '@/app/ui/shared/custom/components/datePickerCustom';
import dayjs from 'dayjs';
import { AddCircleOutline, AddCircleOutlineOutlined, AddCircleSharp, FilePresentOutlined, RemoveCircleOutline } from '@mui/icons-material';
import ExperienceComponent from '@/app/ui/shared/auth/ExperienceComponent';
import { MenuProperties } from '@/app/ui/shared/styles/styles';
import TableExperiencesComponent from '@/app/ui/shared/custom/components/table/TableExperiencesComponent';
import TableEducationComponent from '@/app/ui/shared/custom/components/table/TableEducationComponent';
import AddEducationComponent from '@/app/ui/shared/auth/AddEducationComponent';
import { useQuery } from '@tanstack/react-query';
import { getLanguages } from '@/lib/data/languaje';
import { Languages } from '@prisma/client';
import TableLanguageComponent from '@/app/ui/shared/custom/components/table/TableLanguageComponent';
import LanguagesComponentSignUp from '@/app/ui/shared/auth/LanguageComponentSignup';

type CadidateUserFormProps = {
    formData: SignUpCandidateFormData;
    setFormData: (data: any) => void;
    errors: State;
	countries: Country[];
	encoders: EncoderType[];
}

const getEncoderTypeByCode = (encoders: EncoderType[], encoderCode: string) => {
	return encoders.filter((e) => e.type === encoderCode);
}


export default function CandidateProfesionalDataForm({formData, errors, countries,encoders, setFormData}: CadidateUserFormProps) {
	const [mediaQuery, setMediaQuery] = useState<boolean | null>(null);
  const [educationToEdit, setEducationToEdit] = useState<EducationDTO>();
	const [open, setOpen] = useState<boolean>(false);
	const [openEducationComponent, setOpenEducationComponent] = useState<boolean>(false);
	const licenceCodes = getEncoderTypeByCode(encoders,'CARNET');
	const workRanges = getEncoderTypeByCode(encoders,'WORK_SCOPE')
	const adrLicences = getEncoderTypeByCode(encoders, 'CARNET_ADR');
	const employeeType = getEncoderTypeByCode(encoders, 'EMPLOYEE_TYPE');
	const experiences = getEncoderTypeByCode(encoders, 'EXPERIENCE_TYPE');
	const [fileError, setFileError] = useState<string | null>(null);

  const { data: languages, isLoading: loadingLanguages, isError: isError } = useQuery({queryKey: ['languages'], queryFn: () =>  getLanguages()});

	const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { value } = e.target;
		const licenceType = licenceCodes.find((type) => type.code === value);
		setFormData({licence: {...formData.licence, code: licenceType?.code, name: licenceType?.name}})
	}
    	
	useLayoutEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 600px)');
		setMediaQuery(mediaQuery.matches);
		mediaQuery.addEventListener('change', (e) => {
			setMediaQuery(e.matches);
		});
	},[]);

    
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			if(e.target.files[0].size > 25000000){
				setFileError('El tamaño del archivo no puede ser mayor a 25MB');
				return;
			}
		  	setFormData({ ...formData, summaryFile: e.target.files[0] });
			setFileError(null);
		} else {
			setFileError('El archivo no es válido');
			setFormData({ ...formData, summaryFile: null });
		}
	};
	const handleRemoveFile = () => {
		setFormData({ ...formData, summaryFile: null });
	}

	const handleFormControlSelect = (e: SelectChangeEvent<string | string[]>) => {
			e.preventDefault();
			const { name, value } = e.target;
			if(name === 'workRange' || name === 'employeeType'){
				setFormData({...formData, [name]: value});
			} else {
				setFormData({licence: {...formData.licence, [name]: value}});
			}
	}

  const handleAddLanguage = (selectedLanguage: PersonLanguageDTO) => { 
    setFormData({...formData, languages: [...formData.languages, selectedLanguage]});
  }
  const handleDeleteLanguage = (language: PersonLanguageDTO) => {
    const newLanguages = formData.languages.filter((lang) => lang !== language);
    setFormData({...formData, languages: newLanguages});
  }

  const handleAddStudies = (education: EducationDTO) => {
    const newEducations = [...formData.educations, education];
    setFormData({...formData, educations: newEducations});
  }

  const handleDeleteStudies = (education: EducationDTO) => {
    const newEducations = formData.educations.filter((edu) => edu !== education);
    setFormData({...formData, educations: newEducations});
  }

  const handleEditEducation = (education: EducationDTO) => {
    setEducationToEdit(education);
    setOpenEducationComponent(true);
  }

	const handleCheckChange = (e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
		e.preventDefault();
		const { name, id } = e.target;
		let value = 'No'
		if (name === 'Si' && checked){
				value = 'Si'
		}
		setFormData({licence: {...formData.licence, [id]: value}})
	}

	const deleteExperience = (row: SignUpExperienceData) => {
		const newExperiences = formData.experiences.filter((exp) => exp !== row);
		setFormData({...formData, experiences: newExperiences});
	}

  return (
		<>
			<Grid container spacing={2} sx={{ display: 'flex', flexDirection: {xs: 'row', sm: 'row'} }}>
				<Grid size={{ xs:12, sm: 6 }}>
					<TextField
						fullWidth
						select
						label="Tipo de carnet"
						name="code"
						value={formData.licence.code ?? ''}
						onChange={handleSelectChange}
						error={handleZodError(errors,'code')}
						helperText={handleZodHelperText(errors,'code')}
						required
					>
						{licenceCodes && licenceCodes.map((tipo) => (
							<MenuItem key={tipo.code} value={tipo.code}>
								{tipo.name}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<FormControl fullWidth error={handleZodError(errors, 'country')} required>
						<InputLabel>País de emisión</InputLabel>
						<Select
							label="País de emisión"
							id='country'
							name='country'
							value={formData.licence.country.toString()}
							onChange={(e:SelectChangeEvent<string>) => handleFormControlSelect(e)}
							MenuProps={MenuProperties}
						>
							{countries.map((country) => (
								<MenuItem key={country.id} value={country.id}>
									{country.name_es}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{handleZodHelperText(errors, 'country')}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid size={{ xs: 12 }}>
					<FormControl fullWidth error={handleZodError(errors, 'adrCode')}>
						<InputLabel id="adr_carnet">Carnet de mercancías peligrosas</InputLabel>
						<Select
							label='Carnet de mercancías peligrosas'
							id='adr_carnet'
							multiple
							name="adrCode"
							value={formData.licence.adrCode ?? []}
							onChange={(e: SelectChangeEvent<string | string[]>) => handleFormControlSelect(e)}
							MenuProps={MenuProperties}
						>
							{adrLicences && adrLicences.map((tipo) => (
								<MenuItem key={tipo.code} value={tipo.code}>
									{tipo.name}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{handleZodHelperText(errors, 'adrCode') ?? 'Carnet de mercancías peligrosas'}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid size={{ xs: 12 }}>
					<FormControl fullWidth error={handleZodError(errors, 'employeeType')}>
						<InputLabel id="employeeType">Tipo de empleo</InputLabel>
						<Select
							label='Tipo de empleo'
							id='employeeType'
							multiple
							name="employeeType"
							value={formData.employeeType ?? []}
							renderValue={(selected) => selected.join(', ')}
							onChange={(e: SelectChangeEvent<string[]>) => handleFormControlSelect(e)}
							MenuProps={MenuProperties}
						>
							{employeeType && employeeType.map((tipo) => (
								<MenuItem key={tipo.code} value={tipo.name}>
									<Checkbox checked={formData.employeeType ? formData.employeeType.includes(tipo.name) : false} />
									<ListItemText primary={tipo.name} />
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{handleZodHelperText(errors, 'employeeType') ?? 'Tipo de empleado'}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid size={{ xs: 6, sm: 6 }}>
					<Box sx={{ pl: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
						<FormLabel component={"label"}>
								Tarjeta digital
						</FormLabel>
						<FormGroup sx={{ display: 'flex', flexDirection: 'row'}}>
							<FormControlLabel
								control={<Checkbox 
									checked={formData.licence.digitalTachograph === 'Si'} 
									onChange={handleCheckChange} 
									name='Si' 
									id='digitalTachograph'
								/>}
								label={'Si'}
								/>
							<FormControlLabel
								control={<Checkbox 
									checked={formData.licence.digitalTachograph === 'No' || formData.licence.digitalTachograph == undefined} 
									onChange={(e:ChangeEvent<HTMLInputElement>, checked: boolean ) => handleCheckChange(e, checked)} 
									name='No' 
									id='digitalTachograph'
									/>
								}
								label={'No'}
								/>
						</FormGroup>
						<FormHelperText>{handleZodHelperText(errors, 'digitalTachograph')}</FormHelperText>
					</Box>
				</Grid>
				<Grid size={{ xs: 6, sm: 6 }}>
					<Box sx={{ pl: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
						<FormLabel component={"label"}>
								Certificado CAP
						</FormLabel>
						<FormGroup sx={{ display: 'flex', flexDirection: 'row'}}>
							<FormControlLabel
								control={
									<Checkbox 
										checked={formData.licence.capCertificate === 'Si'} 
										onChange={handleCheckChange} 
										name='Si'
										id='capCertificate'
										/>
									}
								label={'Si'}
								/>
							<FormControlLabel
								control={
									<Checkbox 
										checked={formData.licence.capCertificate === 'No' || formData.licence.capCertificate == undefined} 
										onChange={(e:ChangeEvent<HTMLInputElement>, checked: boolean ) => handleCheckChange(e, checked)} 
										name='No' 
										id='capCertificate'
									/>}
								label={'No'}
								/>
						</FormGroup>
						<FormHelperText>{handleZodHelperText(errors, 'digitalTachograph')}</FormHelperText>
					</Box>
				</Grid>
				<Grid size={{ xs: 12 }}>
					<FormControl fullWidth error={handleZodError(errors, 'workRange')}>
						<InputLabel id="workRange">Ámbito de trabajo</InputLabel>
						<Select
							label='Ámbito de trabajo'
							id='workRange'
							multiple
							name="workRange"
							value={formData.workRange ?? []}
							renderValue={(selected) => selected.join(', ')}
							onChange={(e: SelectChangeEvent<string[]>) => handleFormControlSelect(e)}
							MenuProps={MenuProperties}
						>
							{workRanges && workRanges.map((tipo) => (
								<MenuItem key={tipo.code} value={tipo.name}>
									<Checkbox checked={formData.workRange.includes(tipo.name)} />
									<ListItemText primary={tipo.name} />
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{handleZodHelperText(errors, 'workRange') ?? 'Ambito de trabajo deseado'}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid size={{ xs: 12 }}>
					<Box>
						<Typography color='primary' component={'h3'} variant='h5' fontWeight={'semibold'}>
							Experiencia
						</Typography>
					</Box>
					<Divider sx={{ mb: 2 }}/>
				</Grid>
				<TableExperiencesComponent experiences={formData.experiences} deleteExperience={(row) => deleteExperience(row)} />
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
          <Typography color='primary' component={'h3'} variant='h5' fontWeight={'semibold'}>
            Educación
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }}/>
        <TableEducationComponent 
          educations={formData.educations} 
          deleteEducationExperience={handleDeleteStudies}
          editEducationExperience={handleEditEducation}
        />
        <Box 
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}
        >
          <Button 
            variant='outlined' 
            color='primary' 
            startIcon={<AddCircleOutlineOutlined />}
            onClick={() => setOpenEducationComponent(true)}
            sx={{ alignItems: 'center', mt: 2 }}
            >
              Añadir estudios
          </Button>
        </Box>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <LanguagesComponentSignUp
          languages={languages ?? []} 
          selectedLenguages={formData.languages} 
          loadingLanguages={loadingLanguages} 
          isError={isError} 
          handleAddLanguage={handleAddLanguage} 
          handleDeleteLanguage={handleDeleteLanguage}
        />
      </Grid>
			<Grid size={{ xs: 12 }}>
				<Box>
					<Typography color='primary' component={'h3'} variant='h5' fontWeight={'semibold'}>
						Curriculum
					</Typography>
				</Box>
				<Divider sx={{ mb: 0 }}/>
			</Grid>
			<Grid size={{ xs: 12 }} display={formData.summaryFile ? 'block' : 'none'}>
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
					<Typography variant='body1' fontWeight={'semibold'}>{formData.summaryFile?.name ?? ''}</Typography>
				</Box>
					<IconButton onClick={handleRemoveFile}>
						<RemoveCircleOutline color='error' />
					</IconButton>
				</Box>
			</Grid>
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
			<ExperienceComponent 
				open={open}
				formData={formData}
				experienceTypes={experiences}
				setFormData={setFormData}
				setOpen={(value:boolean) => setOpen(value)}
				errors={errors}
			/>
      <AddEducationComponent
        open={openEducationComponent}
        formData={formData}
        editEducation={educationToEdit}
        setOpen={setOpenEducationComponent}
        setFormData={setFormData}
      />
		</>
  )
}