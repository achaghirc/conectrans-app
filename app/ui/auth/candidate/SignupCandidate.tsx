'use client';
import { CloudinaryUploadResponse, EducationDTO, Licence, PersonLanguageDTO, SignUpCandidateContactFormData, SignUpCandidateFormData, SignUpCandidateProps, ExperienceDTO, State } from '@/lib/definitions'
import React, { useLayoutEffect, useState } from 'react'
import { SignUpForm, SignUpMobileForm } from '../../shared/auth/SignupComponents';
import StepperComponent from '../../shared/custom/components/stepper';
import CandidatePersonalDataForm from './steps/CandidatePersonalDataForm';
import CandidateProfesionalDataForm from './steps/CandidateProfesionalDataForm';
import CadidateUserForm from './steps/CandidateUserForm';
import dayjs from 'dayjs';
import { validateProfesionalData, validateUserAuthData, validateUserData } from '@/lib/validations/userSignupValidate';
import { removeFileFromCloud, uploadFileToCloud } from '@/lib/services/cloudinary';
import { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { candidateSingup } from '@/lib/services/signup';
import { authenticate } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const steps = ['Datos de usuario', 'Datos de candidato', 'Datos Profesionales'];


export default function SignupCandidate({ countries, encoders}: SignUpCandidateProps) {
	const router = useRouter();
	const [mediaQuery, setMediaQuery] = useState<boolean | null>(null);
	const [snackbarProps, setSnackbarProps] = useState<SnackbarCustomProps>({} as SnackbarCustomProps);
	const [formData, setFormData] = useState<SignUpCandidateFormData>({
		email: 'amine101@gmail.com',
		password: '09092286',
		confirmPassword: '09092286',
		cifnif: '09092286H',
		name: 'Amine',
		lastname: 'Chaghir',
		birthdate: new Date('1999x-10-10'),
		workRange: ['Internacional'],
		employeeType: ['Autónomo'],
		contactInfo: {
			streetAddress: 'Calle Olivo 12',
			zip: '06400',
			country: 64,
			locality: 'Zalamea de la Serena',
			mobilePhone: '640493049',
			landlinePhone: '924334003'
		} as SignUpCandidateContactFormData,
		experiences: [] as ExperienceDTO[],
		licence: {
			country: 64,
			code: 'B',
			adrCode: ['ADR Básico'],
		} as Licence,
    educations: [] as EducationDTO[],
    languages: [] as PersonLanguageDTO[],
	} as SignUpCandidateFormData)
	
  const [errors, setErrors] = useState<State>({message: null, errors:[]});
	const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
	
  useLayoutEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 600px)');
		setMediaQuery(mediaQuery.matches);
		mediaQuery.addEventListener('change', (e) => {
			setMediaQuery(e.matches);
		});
	},[]);
	
	const handleFormDataChange = (newData: Partial<SignUpCandidateFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

	const handleSubmit = async () => {
		console.log('Enviando formulario...');
    setLoading(true);
		const formDataCopy = {...formData, summaryFile: null, birthdate: formData.birthdate ? formData.birthdate.toString() : ''};
		const cloudinaryResponse: CloudinaryUploadResponse | null = 
			formData.summaryFile ? 
			await uploadFileToCloud(formData.summaryFile, formData.email) 
			: 
			null;
		try{
			const response = await candidateSingup(formDataCopy, cloudinaryResponse);
			if (!response) {
				setSnackbarProps({...snackbarProps, open: true, message: 'Error al crear la empresa', severity: 'error'});
				return;
			}
			console.log('Usuario creado correctamente');
			setSnackbarProps({...snackbarProps, open: true, message: 'Usuario creado correctamente', severity: 'success'});
			let formDataLogin = new FormData();
			formDataLogin.append('email', formData.email);
			formDataLogin.append('password', formDataCopy.password);
			const errorMsg = await authenticate(undefined, formDataLogin);
			if(errorMsg?.success) {
				console.log('Usuario autenticado correctamente');
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

	}

	const handleNext = async () => {
		let initialState: State = {message: null, errors: []};
		const formDataCopy = {...formData, summaryFile: null};
		
		switch (activeStep) {
			case 0:
				if (formData.password !== formData.confirmPassword) {
					setErrors({message: 'Las contraseñas no coinciden', errors: []});
					return;
				}
				initialState = await validateUserAuthData(initialState, formDataCopy);
				break;
			case 1: 
				initialState = await validateUserData(initialState, formDataCopy);
				break;
			case 2:
				initialState = await validateProfesionalData(initialState, formDataCopy);
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
			if(activeStep === steps.length - 1) {
				handleSubmit();
				return;
			}
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
				return <CadidateUserForm formData={formData} setFormData={handleFormDataChange} errors={errors } />
			case 1:
				return <CandidatePersonalDataForm formData={formData} setFormData={handleFormDataChange} errors={errors } countries={countries}/>
			case 2:
				return <CandidateProfesionalDataForm 
					formData={formData} 
					errors={errors } 
					countries={countries} 
					encoders={encoders}
					setFormData={handleFormDataChange} 
				/>
			default:
				return null;
		}
	}


  return (
		mediaQuery == null ? null :
			mediaQuery ? (
				<SignUpForm>
					<StepperComponent 
						children={getStepContent(activeStep)}
						activeStep={activeStep} 
						steps={steps}
            isLoading={loading}
						isLastStep={isLastStep}
						handleNext={handleNext}
						handleBack={handleBack}
					/>
				</SignUpForm>
			) : (
				<SignUpMobileForm>
					<StepperComponent 
							children={getStepContent(activeStep)}
							activeStep={activeStep} 
							steps={steps}
              isLoading={loading}
							isLastStep={isLastStep}
							handleNext={handleNext}
							handleBack={handleBack}
						/>
				</SignUpMobileForm>
			)
	);
}
