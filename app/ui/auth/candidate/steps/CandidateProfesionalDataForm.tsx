import React, { ChangeEvent, useLayoutEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Icon, IconButton, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { Country, EducationDTO, EncoderType, PersonLanguageDTO, SignUpCandidateFormData, ExperienceDTO, State, Licence, CandidateLicence } from '@/lib/definitions';
import { AddCircleOutlineOutlined, FilePresentOutlined, RemoveCircleOutline } from '@mui/icons-material';
import ExperienceComponent from '@/app/ui/shared/auth/ExperienceComponent';
import { MenuProperties } from '@/app/ui/shared/styles/styles';
import TableExperiencesComponent from '@/app/ui/shared/custom/components/table/TableExperiencesComponent';
import TableEducationComponent from '@/app/ui/shared/custom/components/table/TableEducationComponent';
import AddEducationComponent from '@/app/ui/shared/auth/AddEducationComponent';
import { useQuery } from '@tanstack/react-query';
import { getLanguages } from '@/lib/data/languaje';
import LanguagesComponentSignUp from '@/app/ui/shared/auth/LanguageComponentSignup';
import useUtilsHook from '@/app/ui/shared/hooks/useUtils';
import { ControllerDateTimePickerComponent, ControllerSelectFieldComponent, ControllerSelectMultiFieldComponent } from '@/app/ui/shared/custom/components/form/ControllersReactHForm';
import { Control, SubmitHandler, useForm, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { getEncoderTypeData } from '@/lib/data/encoderType';
import TableLicenceComponent from '@/app/ui/shared/custom/components/table/TableLicenceComponent';
import { set } from 'zod';

type CadidateUserFormProps = {
  control: Control<Partial<SignUpCandidateFormData>>;
  register: UseFormRegister<Partial<SignUpCandidateFormData>>;
  watch: UseFormWatch<Partial<SignUpCandidateFormData>>;  
  setValue: UseFormSetValue<Partial<SignUpCandidateFormData>>;
  formData: SignUpCandidateFormData;
  setFormData: (data: any) => void;
  errors: State;
  countries: Country[];
  encoders: EncoderType[];
}

const getEncoderTypeByCode = (encoders: EncoderType[], encoderCode: string) => {
	return encoders.filter((e) => e.type === encoderCode);
}


export default function CandidateProfesionalDataForm({
  control,register, watch, setValue, formData, errors, countries,encoders, setFormData
}: CadidateUserFormProps) {

  const { handleZodError, handleZodHelperText } = useUtilsHook();
  const [adrLicences, setAdrLicences] = useState<Licence[]>([]);
  const [educationToEdit, setEducationToEdit] = useState<EducationDTO>();
	const [open, setOpen] = useState<boolean>(false);
	const [openEducationComponent, setOpenEducationComponent] = useState<boolean>(false);
	const licenceCodes = getEncoderTypeByCode(encoders,'CARNET');
	const workRanges = getEncoderTypeByCode(encoders,'WORK_SCOPE')
	const adrLicencesCodes = getEncoderTypeByCode(encoders, 'CARNET_ADR');
	const employeeType = getEncoderTypeByCode(encoders, 'EMPLOYEE_TYPE');
	const experiences = getEncoderTypeByCode(encoders, 'EXPERIENCE_TYPE');
	const [fileError, setFileError] = useState<string | null>(null);

  const { data: languages, isLoading: loadingLanguages, isError: isError } = useQuery({queryKey: ['languages'], queryFn: () =>  getLanguages()});

  const {data: encodersData, isLoading: isEncodersLoading} = useQuery({
    queryKey: ['encoders'],
    queryFn: () => getEncoderTypeData(),
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			if(e.target.files[0].size > 25000000){
				setFileError('El tamaño del archivo no puede ser mayor a 25MB');
				return;
			}
      const file : File = e.target.files[0];
		  setValue('summaryFile', file);
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
				// setFormData({licence: {...formData.licence, [name]: value}});
			}
	}

  const handleAddLanguage = (selectedLanguage: PersonLanguageDTO) => { 
    let languages = watch('languages');
    if (!languages) languages = [];
    if (languages.includes(selectedLanguage)) return;
    setValue('languages', [...languages, selectedLanguage]);
  }
  const handleDeleteLanguage = (language: PersonLanguageDTO) => {
    const languages = watch('languages');
    if (!languages) return;
    const newLanguages = languages.filter((lang) => lang !== language);
    setValue('languages', newLanguages);
  }

  const handleAddExperienceData = (experience: ExperienceDTO) => {
    let actualExperiences = watch('experiences');
    if (!actualExperiences) actualExperiences = [];
    if (actualExperiences.includes(experience)) return;
    const newExperiences = [...actualExperiences, experience];
    setValue('experiences', newExperiences);
  }

	const deleteExperience = (row: ExperienceDTO) => {
    const experiences = watch('experiences');
    if (!experiences) return;
		const newExperiences = experiences.filter((exp) => exp !== row);
    setValue('experiences', newExperiences);
	}

  const handleAddEducationData = (educations: EducationDTO[]) => {
    let actualEducations = watch('educations');
    if (!actualEducations) actualEducations = [];

    const newEducations = [...actualEducations, ...educations];
    setValue('educations', newEducations);
  }

  const handleDeleteEducation = (education: EducationDTO) => {
    let educations = watch('educations');
    if (!educations) return;
    const newEducations = educations.filter((edu) => edu !== education);
    setValue('educations', newEducations);
  }

  const handleEditEducation = (education: EducationDTO) => {
    setEducationToEdit(education);
    setOpenEducationComponent(true);
  }

  return (
		<>
			<Grid container spacing={2} sx={{ display: 'flex', flexDirection: {xs: 'row', sm: 'row'} }}>
        <Grid size={{ xs:12, sm: 6 }}>
          <ControllerSelectMultiFieldComponent
            label='Tipo de Carnet'
            control={control}
            name='licences'
            formState={errors}
            isLoading={isEncodersLoading}
            options={!isEncodersLoading ? licenceCodes && licenceCodes.map((encoder) => ({
              value: encoder.name,
              label: encoder.name,
              id: encoder.id.toString()
            })) : []}
            />
        </Grid>
        <Grid size={{ xs: 12, sm: 6}}>
          <ControllerSelectFieldComponent 
            label='País de emisión'
            control={control}
            name='countryLicences'
            formState={errors}
            isLoading={false}
            options={countries ? countries.map((country) => ({
              value: country.name_es ?? '',
              label: country.id.toString() ?? '',
              id: country.id.toString()
            })) : []}
          />
        </Grid>
				<Grid size={{ xs:12, sm: 6 }}>
          <ControllerSelectMultiFieldComponent
            label='Carnet de mercancías peligrosas'
            control={control}
            name='adrLicences'
            formState={errors}
            isLoading={isEncodersLoading}
            options={!isEncodersLoading ? adrLicencesCodes && adrLicencesCodes.map((encoder) => ({
              value: encoder.name,
              label: encoder.name,
              id: encoder.id.toString()
            })) : []}
          />
				</Grid>
				<Grid size={{ xs: 12, sm: 6}}>
					<ControllerSelectMultiFieldComponent 
            label='Tipo de empleado'
            control={control}
            name='employeeType'
            formState={errors}
            isLoading={isEncodersLoading}
            options={!isEncodersLoading ? employeeType && employeeType.map((encoder) => ({
              value: encoder.code,
              label: encoder.name,
              id: encoder.id.toString()
            })) : []}
          /> 
        </Grid>
				<Grid size={{ xs: 6, sm: 6 }}>
					<ControllerSelectFieldComponent
            label='Certificado CAP'
            name='capCertification'
            control={control}
            formState={errors}
            options={[
              {value: 'Si', label: 'YES', id: 'YES'},
              {value: 'No', label: 'NO', id: 'NO'}
            ]}
          />
				</Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ControllerSelectFieldComponent
            label='Tacógrafo Digital'
            name='digitalTachograph'
            control={control}
            formState={errors}
            options={[
              {value: 'Si', label: 'YES', id: 'YES'},
              {value: 'No', label: 'NO', id: 'NO'}
            ]}
          />
        </Grid>
				<Grid size={{ xs: 12 }}>
          <ControllerSelectMultiFieldComponent 
            label='Ámbito de trabajo'
            control={control}
            name='workRange'
            formState={errors}
            isLoading={isEncodersLoading}
            options={!isEncodersLoading ? workRanges && workRanges.map((encoder) => ({
              value: encoder.code,
              label: encoder.name,
              id: encoder.id.toString()
            })) : []}
          />
				</Grid>
				<Grid size={{ xs: 12 }}>
					<Box>
						<Typography color='primary' component={'h3'} variant='h5' fontWeight={'semibold'}>
							Experiencia
						</Typography>
					</Box>
					<Divider sx={{ mb: 2 }}/>
				</Grid>
				<TableExperiencesComponent 
          experiences={watch('experiences') ?? []} 
          deleteExperience={(row) => deleteExperience(row)} 
        />
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
          educations={watch('educations') ?? []} 
          deleteEducationExperience={handleDeleteEducation} 
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
          selectedLenguages={watch('languages') ?? []} 
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
			<Grid size={{ xs: 12 }} display={watch('summaryFile') ? 'block' : 'none'}>
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
					<Typography variant='body1' fontWeight={'semibold'}>{watch('summaryFile')?.name ?? ''}</Typography>
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
              {...register('summaryFile')}
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
				experienceTypes={experiences}
				setValue={handleAddExperienceData}
				setOpen={(value:boolean) => setOpen(value)}
				errors={errors}
			/>
      <AddEducationComponent
        open={openEducationComponent}
        educations={formData.educations}
        editEducation={educationToEdit}
        onClose={() => {
          setOpenEducationComponent(false);
          setEducationToEdit(undefined);
        }}
        setEducations={handleAddEducationData}
      />
		</>
  )
}