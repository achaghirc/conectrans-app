'use client';
import React, { useState } from 'react'
import { CardSignUp, SignInContainer } from '../shared/auth/authComponents'
import { Box, Button, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import ContactForm from './signupSteps/contactForm';
import PersonContactForm from './signupSteps/personContactForm';
import ResumenForm from './signupSteps/resumeForm';
import CompanyForm from './signupSteps/companyForm';
import { Activity, CloudinaryUploadResponse, SignUpCompanyFormData, State } from '@/lib/definitions';
import { authenticate, validateCompanyData, validateContactData, validatePersonContactData } from '@/lib/actions';
import { ZodIssue } from 'zod';
import { uploadImage } from '@/lib/services/cloudinary';
import companySignUp from '@/lib/services/signup';
import { getUserByEmail } from '@/lib/data/user';
import { signIn } from '@/auth';
import { useRouter } from 'next/navigation';

const steps = ['Datos de Empresa', 'Datos de Contacto', 'Persona de Contacto', 'Resumen'];

type SignUpProps = {
  activities: Activity[] | undefined;
}

export default function Signup({ activities }: SignUpProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<State>({message: null, errors:[]});
  const [formData, setFormData] = useState<SignUpCompanyFormData>({
    company: {
      email: 'amine1@gmail.com',
      password: 'contraseña',
      confirmPassword: 'contraseña',
      socialName: 'Social Name',
      comercialName: 'Comercial Name',
      activityType: 'TRANSPORT',
      cifnif: '09092286H',
      logo: null,
    },
    contactInfo: {
      streetAddress: 'Calle Olivo 12',
      zip: '06400',
      country: 'España',
      province: 'Badajoz',
      locality: 'Zalamea de la Serena',
      mobilePhone: '640493049',
      landlinePhone: '924334003',
      website: 'www.empresa.com',
      contactEmail: 'email@gmail.com',
      description: 'Esta es una descripción de la empresa',
    },
    contactPerson: {
      name: 'Prueba',
      lastnames: 'Prueba',
      companyPosition: 'Directivo',
      phoneNumber: '987654321',
      email: 'prueba@gmail.com',
    },
  });
  const handleSamePassword = ():ZodIssue | undefined => {
    if (formData.company.password !== formData.company.confirmPassword) {  
      return {code: 'invalid_literal',expected: '', received: '', path: ['confirmPassword'], message: 'Las contraseñas no coinciden, por favor revisa que sean iguales'}
    } else {
      return undefined; 
    }
  }

  const handleNext = async () => {
    let initialState: State = {message: null, errors: []};
    const formDataCopy = {...formData, company: {...formData.company, logo: null}};
    if (activeStep === 0) {
      initialState = await validateCompanyData(initialState, formDataCopy);
      if(initialState.errors) {
        setErrors(initialState);
      }
      const err = handleSamePassword();
      if(err) {
        setErrors({message: err.message, errors: [err]});
        return
      }
      if (!initialState.errors) {
        setErrors({message: null, errors: []});
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
    if (activeStep === 1) {
      initialState = await validateContactData(initialState, formDataCopy);
      if(initialState.errors) {
        setErrors(initialState);
      }
      if (!initialState.errors) {
        setErrors({message: null, errors: []});
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
    if (activeStep === 2) {
      initialState = await validatePersonContactData(initialState, formDataCopy);
      if(initialState.errors) {
        setErrors(initialState);
      }
      if (!initialState.errors) {
        setErrors({message: null, errors: []});
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
    if (activeStep === 3) {
      handleSubmit();
    }
  }
  
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  
  const handleFormDataChange = (newData: Partial<SignUpCompanyFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };


  const isLastStep = activeStep === steps.length - 1;

  const handleSubmit = async () => {
    // Aquí puedes realizar alguna acción con los datos finales, como enviar una solicitud al backend.
    const cloudinaryResponse:CloudinaryUploadResponse = formData.company.logo !== null ? await uploadImage(formData.company.logo) : null;
    const formDataCopy = {...formData, company: {...formData.company, logo: null}};
    await companySignUp(formDataCopy,cloudinaryResponse)
    
    console.log('Empresa creada correctamente');
    
    let formDataLogin = new FormData();
    formDataLogin.append('email', formData.company.email);
    formDataLogin.append('password', formDataCopy.company.password);
    const errorMsg = await authenticate(undefined, formDataLogin);
    if (errorMsg) {
      setErrors({message: errorMsg, errors: []});
      return;
    }
    console.log("Logged in successfully");
    router.push('/');
    
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CompanyForm 
          formData={formData} 
          setFormData={handleFormDataChange} 
          activities={activities}
          errors={errors}
        />;
      case 1:
        return <ContactForm formData={formData} setFormData={handleFormDataChange} errors={errors} />;
      case 2:
        return <PersonContactForm formData={formData} setFormData={handleFormDataChange} errors={errors}/>;
      case 3:
        return <ResumenForm formData={formData} />;
      default:
        return null;
    }
  };

  return (
		<SignInContainer direction="column" justifyContent="space-between">
			<CardSignUp variant="outlined">
				<Box>
					<Stepper 
            activeStep={activeStep} 
            alternativeLabel
          >
						{steps.map((label) => (
							<Step key={label} sx={{ fontSize: { xs: '0.5rem', sm: '1.125' } }}>
								<StepLabel>
                  <Typography variant="body2" fontSize={{ xs:'0.8rem', sm: '1.125' }}>
                    {label}
                  </Typography>
                </StepLabel>
							</Step>
						))}
					</Stepper>
				</Box>
				{getStepContent(activeStep)}
				<Box component={'form'} noValidate autoComplete='off' sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 3 }}>
					{activeStep >= 1 && (
						<Button onClick={() => handleBack()}>
							Volver
						</Button>
					)}
					<Button onClick={() => handleNext()}>
						{activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
					</Button>
				</Box>
			</CardSignUp>
		</SignInContainer>
  )
}