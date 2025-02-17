'use client';
import { CloudinaryUploadResponse, EducationDTO, Licence, PersonLanguageDTO, SignUpCandidateContactFormData, SignUpCandidateFormData, ExperienceDTO, State } from '@/lib/definitions'
import React, { useState } from 'react'
import { SignUpForm, SignUpMobileForm } from '../../shared/auth/SignupComponents';
import StepperComponent from '../../shared/custom/components/steppers/StepperComponent';
import CandidatePersonalDataForm from './steps/CandidatePersonalDataForm';
import CandidateProfesionalDataForm from './steps/CandidateProfesionalDataForm';
import CadidateUserForm from './steps/CandidateUserForm';
import { validateProfesionalData, validateUserAuthData, validateUserData } from '@/lib/validations/userSignupValidate';
import { removeFileFromCloud, uploadFileToCloud } from '@/lib/services/cloudinary';
import { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { candidateSingup } from '@/lib/services/signup';
import { authenticate } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import useMediaQueryData from '../../shared/hooks/useMediaQueryData';
import { useQuery } from '@tanstack/react-query';
import { getCountries } from '@/lib/data/geolocate';
import { getEncoderTypeData } from '@/lib/data/encoderType';
import { SubmitHandler, useForm } from 'react-hook-form';
import ButtonCustom from '../../shared/custom/components/button/ButtonCustom';
import { Box, Button } from '@mui/material';

const steps = ['Datos de usuario', 'Datos de candidato', 'Datos Profesionales'];

const initialDataContactInfo: SignUpCandidateContactFormData = {
  streetAddress: 'Calle Olivo 12',
  zip: '06400',
  country: 64,
  locality: 'Zalamea de la Serena',
  mobilePhone: '640493049',
  landlinePhone: '924334003'
} as SignUpCandidateContactFormData

const initialStateData: SignUpCandidateFormData = {
  email: 'amine102@gmail.com',
  password: '09092286',
  confirmPassword: '09092286',
  cifnif: '09092286H',
  name: 'Amine',
  lastname: 'Chaghir',
  birthdate: new Date('1999-10-10'),
  workRange: ['Internacional'],
  employeeType: ['Autónomo'],
  contactInfo: initialDataContactInfo,
  experiences: [] as ExperienceDTO[],
  licences: [] as string[],
  adrLicences: [] as string[],
  countryLicences: 64,
  digitalTachograph: 'NO',
  capCertificate: 'NO',
  educations: [] as EducationDTO[],
  languages: [] as PersonLanguageDTO[],
  summaryFile: null
}

export default function SignupCandidate(
  { redirect }: {redirect?: string }
) {
  const router = useRouter();
  const { mediaQuery } = useMediaQueryData();
	const [snackbarProps, setSnackbarProps] = useState<SnackbarCustomProps>({} as SnackbarCustomProps);
	const [formData, setFormData] = useState<SignUpCandidateFormData>(initialStateData);
  const [errors, setErrors] = useState<State>({message: null, errors:[]});
	const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const { 
    control,
    watch,
    register,
    setValue,
    handleSubmit,
  } = useForm<Partial<SignUpCandidateFormData>>(
    { defaultValues: initialStateData }
  );

  const onSubmit: SubmitHandler<Partial<SignUpCandidateFormData>> = async (data) => {
    console.log('Enviando formulario...');
    setLoading(true);
    const dataSubmit = data as SignUpCandidateFormData;
    const initialState: State = await validateProfesionalData(errors, data);
    if(initialState.errors && initialState.errors.length > 0) {
      setErrors(initialState);
      setLoading(false);
      return;
    }

		// const formDataCopy = {...formData, summaryFile: null, birthdate: formData.birthdate ? formData.birthdate.toString() : ''};
		const cloudinaryResponse: CloudinaryUploadResponse | null = 
      dataSubmit.summaryFile ? 
			await uploadFileToCloud(dataSubmit.summaryFile, dataSubmit.email) 
			: 
			null;
		try{
			const response = await candidateSingup(dataSubmit, cloudinaryResponse);
			if (!response) {
				setSnackbarProps({...snackbarProps, open: true, message: 'Error al crear la empresa', severity: 'error'});
				return;
			}
			console.log('Usuario creado correctamente');
			setSnackbarProps({...snackbarProps, open: true, message: 'Usuario creado correctamente', severity: 'success'});
			const formDataLogin = new FormData();
			formDataLogin.append('email', dataSubmit.email);
			formDataLogin.append('password', dataSubmit.password);
			const errorMsg = await authenticate(undefined, formDataLogin);
			if(errorMsg?.success) {
				console.log('Usuario autenticado correctamente');
				if (redirect) {
          router.push(redirect);
          return;
        }
        router.push('/');
				return;
			}
			if(errorMsg) {
				setSnackbarProps({...snackbarProps, open: true, message: errorMsg.message, severity: 'error'});
				return;
			}
		} catch(e:any) {
			console.error('Error en el proceso de registro:', e.message);
			if (cloudinaryResponse && cloudinaryResponse.public_id) {
			  removeFileFromCloud(cloudinaryResponse.public_id, cloudinaryResponse.format);
			}
		} finally {
      setLoading(false);
    }
  };

  const {data: countries} = useQuery({
    queryKey: ['countries'],
    queryFn: () => getCountries(),
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });

  const {data: encodersData} = useQuery({
    queryKey: ['encoders'],
    queryFn: () => getEncoderTypeData(),
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });


	const handleFormDataChange = (newData: Partial<SignUpCandidateFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

	const handleNext = async () => {
		let initialState: State = errors;
		const data = watch();
    const formDataCopy = {...formData, summaryFile: null};
		
		switch (activeStep) {
			case 0:
				if (data.password !== data.confirmPassword) {
					setErrors({...errors, message: 'Las contraseñas no coinciden', errors: [{
            code: 'invalid_literal',
            expected: '',
            received: '',
            path: ['confirmPassword'],
            message: 'Las contraseñas no coinciden, por favor revisa que sean iguales'
          }]});
					return;
				}
				initialState = await validateUserAuthData(initialState, data);
				break;
			case 1: 
				initialState = await validateUserData(initialState, data);
				break;
			case 2:
				initialState = await validateProfesionalData(initialState, data);
				console.log(initialState);
				break;
			default:
				break;
		}
		if(initialState.errors) {
			setErrors(initialState);
			return;
		} else {
			setErrors({message: null, errors: []});
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	}
	
	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	}
	const isLastStep = activeStep === steps.length - 1;

	const getStepContent = (step: number) => {
		switch (step) {
			case 0: 
				return <CadidateUserForm 
          control={control}
          errors={ errors } 
        />
			case 1:
				return <CandidatePersonalDataForm 
          control={control}
          watch={watch}
          register={register}
          setValue={setValue}
          formData={formData} 
          setFormData={handleFormDataChange} 
          errors={errors } 
        />
			case 2:
				return <CandidateProfesionalDataForm 
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
					formData={formData} 
					errors={errors } 
					countries={countries ?? []} 
					encoders={encodersData ?? []}
					setFormData={handleFormDataChange} 
				/>
			default:
				return null;
		}
	}

  const nextButton = () => {
    if (activeStep === steps.length - 1) {
      return (
        <ButtonCustom
          onClick={handleSubmit(onSubmit)}
          title='Finalizar'
          loading={loading}
          disable={false}
          type='submit'
          color='primary'
        />
      )
    } else {
      return (
        <Button 
          onClick={handleNext}
          variant='outlined'
          color='primary'
        >
          Siguiente
        </Button>
      )
    }
  }

  return (
		mediaQuery == null ? null :
			mediaQuery ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <SignUpForm>
            <StepperComponent 
              activeStep={activeStep} 
              steps={steps}
            >
              {getStepContent(activeStep)}
            </StepperComponent>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3}}>
              <ButtonCustom 
                onClick={() => {
                  handleBack();
                }}
                title='Volver'
                loading={false}
                disable={false}
                type='button'
                color='secondary'
              />
              {nextButton()}
            </Box>
          </SignUpForm>
        </form>
			) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <SignUpMobileForm>
            <StepperComponent 
                activeStep={activeStep} 
                steps={steps}
            >
              {getStepContent(activeStep)}
            </StepperComponent>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3}}>
                <ButtonCustom 
                  onClick={() => {
                    handleBack();
                  }}
                  title='Volver'
                  loading={false}
                  disable={false}
                  type='button'
                  color='secondary'
                />
                {nextButton()}
              </Box>
          </SignUpMobileForm>
        </form>
			)
	);
}
