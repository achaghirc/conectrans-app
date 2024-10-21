'use client';
import { SignUpCandidateFormData, SignUpCandidateProps, State } from '@/lib/definitions'
import React, { useLayoutEffect, useState } from 'react'
import { SignUpForm, SignUpMobileForm } from '../../shared/auth/authComponents';
import StepperComponent from '../../shared/custom/components/stepper';
import CandidatePersonalDataForm from './steps/CandidatePersonalDataForm';
import CandidateProfesionalDataForm from './steps/CandidateProfesionalDataForm';
import CadidateUserForm from './steps/CandidateUserForm';
import dayjs from 'dayjs';

const steps = ['Datos de usuario', 'Datos de candidato', 'Datos Profesionales', 'Resumen'];


export default function SignupCandidate({ countries }: SignUpCandidateProps) {
	const [mediaQuery, setMediaQuery] = useState<boolean | null>(null);
	const [formData, setFormData] = useState<SignUpCandidateFormData>({
		email: '',
		password: '',
		confirmPassword: '',
		cifnif: '',
		name: '',
		lastname: '',
		birthdate: dayjs(new Date()),
		phone: '',
		workRange: [] as string[],
		contactInfo: {},
		licence: {}
	} as SignUpCandidateFormData)
	const [errors, setErrors] = useState<State>({message: null, errors:[]});
	const [activeStep, setActiveStep] = useState(0);
	
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

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
				return <CandidateProfesionalDataForm formData={formData} setFormData={handleFormDataChange} errors={errors } countries={countries}/>
			case 3: 
				return <div>HOLA</div>
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
						handleNext={handleNext}
						handleBack={handleBack}
						isLastStep={isLastStep}
					/>
			</SignUpForm>
  	) : (
			<SignUpMobileForm>
				<StepperComponent 
						children={getStepContent(activeStep)}
						activeStep={activeStep} 
						steps={steps}
						handleNext={handleNext}
						handleBack={handleBack}
						isLastStep={isLastStep}
					/>
			</SignUpMobileForm>
		)
	);
}
