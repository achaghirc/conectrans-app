'use client';
import React, { useState } from 'react'
import { CardLogin, SignInContainer } from '../shared/auth/authComponents'
import { Box, Button, CssBaseline, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import EmpresaForm from './signupSteps/empresaForm';
import ContactForm from './signupSteps/contactForm';
import PersonContactForm from './signupSteps/personContactForm';
import ResumenForm from './signupSteps/resumeForm';

const steps = ['Datos de Empresa', 'Datos de Contacto', 'Persona de Contacto', 'Resumen'];

interface FormData {
  empresa: {
    email: string;
    password: string;
    confirmarPassword: string;
    razonSocial: string;
    nombreComercial: string;
    tipoActividad: string;
    logo: File | null;
  };
  contacto: {
    direccion: string;
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


export default function Signup() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    empresa: {
      email: '',
      password: '',
      confirmarPassword: '',
      razonSocial: '',
      nombreComercial: '',
      tipoActividad: '',
      logo: null,
    },
    contacto: {
      direccion: '',
      codigoPostal: '',
      pais: '',
      provincia: '',
      localidad: '',
      telefonoMovil: '',
      telefonoFijo: '',
      sitioWeb: '',
      emailContacto: '',
      descripcion: '',
    },
    personaContacto: {
      nombre: '',
      apellidos: '',
      cargo: '',
      telefono: '',
      email: '',
    },
  });

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
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
        return <EmpresaForm formData={formData.empresa} setFormData={handleFormDataChange} />;
      case 1:
        return <ContactForm formData={formData.contacto} setFormData={handleFormDataChange} />;
      case 2:
        return <PersonContactForm formData={formData.personaContacto} setFormData={handleFormDataChange} />;
      case 3:
        return <ResumenForm formData={formData} />;
      default:
        return null;
    }
  };

  return (
		<SignInContainer direction="column" justifyContent="space-between">
			<CardLogin variant="outlined">
				<Box>
					<Stepper activeStep={activeStep} alternativeLabel>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
				</Box>
				{getStepContent(activeStep)}
				<Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 3 }}>
					{activeStep >= 1 && (
						<Button onClick={() => handleBack()}>
							Volver
						</Button>
					)}
					<Button onClick={() => handleNext()}>
						{activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
					</Button>
				</Box>
			</CardLogin>
		</SignInContainer>
  )
}