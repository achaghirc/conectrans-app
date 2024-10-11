'use client';
import React, { useState } from 'react'
import { CardLogin, CardSignUp, SignInContainer } from '../shared/auth/authComponents'
import { Box, Button, CssBaseline, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import ContactForm from './signupSteps/contactForm';
import PersonContactForm from './signupSteps/personContactForm';
import ResumenForm from './signupSteps/resumeForm';
import CompanyForm from './signupSteps/companyForm';
import { Activity } from '@/lib/definitions';
import { get } from 'http';
import { State, validateCompanyData, validateContactData, validatePersonContactData } from '@/lib/actions';
import { init } from 'next/dist/compiled/webpack/webpack';
import { ZodIssue } from 'zod';

const steps = ['Datos de Empresa', 'Datos de Contacto', 'Persona de Contacto', 'Resumen'];

interface FormData {
  empresa: {
    email: string;
    password: string;
    confirmPassword: string;
    socialName: string;
    comercialName: string;
    tipoActividad: string;
    logo: File | null;
  };
  contacto: {
    streetAddress: string;
    codigoPostal: string;
    pais: string;
    provincia: string;
    localidad: string;
    telefonoMovil: string;
    telefonoFijo: string;
    sitioWeb: string;
    emailContacto: string;
    descripcion: string;
  };
  personaContacto: {
    nombre: string;
    apellidos: string;
    cargo: string;
    telefono: string;
    email: string;
  };
}

type SignUpProps = {
  activities: Activity[] | undefined;
}


export default function Signup({ activities }: SignUpProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<State>({message: null, errors:[]});
  const [formData, setFormData] = useState<FormData>({
    empresa: {
      email: 'amine1@gmail.com',
      password: 'contraseña',
      confirmPassword: 'contraseña',
      socialName: 'Social Name',
      comercialName: 'Comercial Name',
      tipoActividad: 'TRANSPORT',
      logo: null,
    },
    contacto: {
      streetAddress: 'Calle Olivo 12',
      codigoPostal: '06400',
      pais: 'España',
      provincia: 'Badajoz',
      localidad: 'Zalamea de la Serena',
      telefonoMovil: '640493049',
      telefonoFijo: '924334003',
      sitioWeb: 'www.empresa.com',
      emailContacto: 'email@gmail.com',
      descripcion: 'Esta es una descripción de la empresa',
    },
    personaContacto: {
      nombre: '',
      apellidos: '',
      cargo: '',
      telefono: '',
      email: '',
    },
  });
  const handleSamePassword = ():ZodIssue | undefined => {
    if (formData.empresa.password !== formData.empresa.confirmPassword) {  
      return {code: 'invalid_literal',expected: '', received: '', path: ['confirmPassword'], message: 'Las contraseñas no coinciden, por favor revisa que sean iguales'}
    } else {
      return undefined; 
    }
  }

  const handleNext = async () => {
    let initialState: State = {message: null, errors: []};
    if (activeStep === 0) {
      console.log(formData.empresa);
      const formDataToValidate = new FormData();
      formDataToValidate.append('empresa.email', formData.empresa.email);
      formDataToValidate.append('empresa.password', formData.empresa.password);
      formDataToValidate.append('empresa.confirmPassword', formData.empresa.confirmPassword);
      formDataToValidate.append('empresa.socialName', formData.empresa.socialName);
      formDataToValidate.append('empresa.comercialName', formData.empresa.comercialName);
      formDataToValidate.append('empresa.tipoActividad', formData.empresa.tipoActividad);
      if (formData.empresa.logo) {
        formDataToValidate.append('empresa.logo', formData.empresa.logo);
      }
      initialState = await validateCompanyData(initialState, formDataToValidate);
      
      if(initialState.errors) {
        setErrors(initialState);
      }
      const err = handleSamePassword();
      if(err) {
        setErrors({message: err.message, errors: [err]});
        return
      }
      if (!initialState.errors) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
    if (activeStep === 1) {
      const formDataToValidate = new FormData();
      formDataToValidate.append('contacto.streetAddress', formData.contacto.streetAddress);
      formDataToValidate.append('contacto.codigoPostal', formData.contacto.codigoPostal);
      formDataToValidate.append('contacto.pais', formData.contacto.pais);
      formDataToValidate.append('contacto.provincia', formData.contacto.provincia);
      formDataToValidate.append('contacto.localidad', formData.contacto.localidad);
      formDataToValidate.append('contacto.telefonoMovil', formData.contacto.telefonoMovil);
      formDataToValidate.append('contacto.telefonoFijo', formData.contacto.telefonoFijo);
      formDataToValidate.append('contacto.sitioWeb', formData.contacto.sitioWeb);
      formDataToValidate.append('contacto.emailContacto', formData.contacto.emailContacto);
      formDataToValidate.append('contacto.descripcion', formData.contacto.descripcion);
      initialState = await validateContactData(initialState, formDataToValidate);
      if(initialState.errors) {
        setErrors(initialState);
      }
      if (!initialState.errors) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
    if (activeStep === 2) {
      const formDataToValidate = new FormData();
      formDataToValidate.append('personaContacto.nombre', formData.personaContacto.nombre);
      formDataToValidate.append('personaContacto.apellidos', formData.personaContacto.apellidos);
      formDataToValidate.append('personaContacto.cargo', formData.personaContacto.cargo);
      formDataToValidate.append('personaContacto.telefono', formData.personaContacto.telefono);
      formDataToValidate.append('personaContacto.email', formData.personaContacto.email);
      initialState = await validatePersonContactData(initialState, formDataToValidate);
      if(initialState.errors) {
        setErrors(initialState);
      }
      if (!initialState.errors) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  }
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  const handleFormDataChange = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };


  const isLastStep = activeStep === steps.length - 1;

  const handleSubmit = () => {
    // Aquí puedes realizar alguna acción con los datos finales, como enviar una solicitud al backend.
    console.log('Datos del formulario:', formData);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CompanyForm 
          formData={formData.empresa} 
          setFormData={handleFormDataChange} 
          activities={activities}
          errors={errors}
        />;
      case 1:
        return <ContactForm formData={formData.contacto} setFormData={handleFormDataChange} errors={errors} />;
      case 2:
        return <PersonContactForm formData={formData.personaContacto} setFormData={handleFormDataChange} errors={errors}/>;
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