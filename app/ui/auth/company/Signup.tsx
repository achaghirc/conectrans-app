'use client';
import React, { useState } from 'react'
import { SignUpForm, SignUpMobileForm } from '../../shared/auth/SignupComponents'
import ContactForm from './steps/ContactForm';
import PersonContactForm from './steps/PersonContactForm';
import ResumenForm from './steps/PlanSelectionForm';
import CompanyForm from './steps/CompanyForm';
import { CloudinaryUploadResponse, SignUpCompanyFormData, State, Subscriptions } from '@/lib/definitions';
import { authenticate } from '@/lib/actions';
import { validateCompanyData, validateContactData, validatePersonContactData } from '@/lib/validations/companyValidate';
import { ZodIssue } from 'zod';
import { uploadFileToCloud } from '@/lib/services/cloudinary';
import { companySignUp, createSubscriptionPlan } from '@/lib/services/signup';
import { useRouter } from 'next/navigation';
import { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { ArrowBack } from '@mui/icons-material';
import useMediaQueryData from '../../shared/hooks/useMediaQueryData';
import { SubmitHandler, useForm } from 'react-hook-form';
import ButtonCustom from '../../shared/custom/components/button/ButtonCustom';
import { Box, Button } from '@mui/material';
import StepperFormComponent from '../../shared/custom/components/steppers/StepperFormComponent';
import PaymentComponentForm from './steps/PaymentComponentForm';
import { loadStripe } from '@stripe/stripe-js';
import { StripeSession } from '@/lib/stripe/session';
import { createTransaction } from '@/lib/data/transactions';

const steps = ['Datos de Empresa', 'Datos de Contacto', 'Persona de Contacto', 'Plan de Suscripción', 'Pago'];

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { mediaQuery } = useMediaQueryData();
  const [snackbarProps, setSnackbarProps] = useState<SnackbarCustomProps>({} as SnackbarCustomProps);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<State>({message: null, errors:[]});
  const [formData, setFormData] = useState<SignUpCompanyFormData>();

  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
  } = useForm<Partial<SignUpCompanyFormData>>();

  const onSubmit: SubmitHandler<Partial<SignUpCompanyFormData>> = async(data) => {
    setLoading(true);
    const dataSubmit = {...data, company: {...data.company, logo: null}} as SignUpCompanyFormData;

    try {
      const cloudinaryResponse: CloudinaryUploadResponse | null = data.company?.logo !== null ? await uploadFileToCloud(data.company!.logo, data.company!.email) : null;
      const user = await companySignUp(dataSubmit, cloudinaryResponse);
      if(!user || user.id == undefined) {
        setSnackbarProps({...snackbarProps, open: true, message: 'Error al crear la empresa', severity: 'error'});
        return;
      }
      //Llama a la función para crear el plan de suscripción de la empresa, es asincrona y no bloquea la ejecución
      // await createSubscriptionPlan(dataSubmit.subscriptionPlan.planId, user.id);
      console.log('Empresa creada correctamente');
      const formDataLogin = new FormData();
      formDataLogin.append('email', data.company!.email);
      formDataLogin.append('password', data.company!.password);
      const errorMsg = await authenticate(undefined, formDataLogin);
      if(errorMsg?.success) {
        console.log('Usuario autenticado correctamente');
        await handleCreateCustomer();
        await handleCheckout();
				return;
			}
			if(errorMsg) {
        setSnackbarProps({...snackbarProps, open: true, message: errorMsg.message, severity: 'error'});
				return;
			}
      setLoading(false);
    } catch(err) {
      console.error(err);
      setSnackbarProps({...snackbarProps, open: true, message: 'Error al crear la empresa', severity: 'error'});
      setLoading(false);
    }
  }
  
  const handleCreateCustomer = async () => {
    const userEmail = watch('company.email');
    const response = await fetch('/api/create_customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: userEmail,
        name : watch('company.socialName'),
        address: {
          street: watch('contactInfo.streetAddress'),
          city: watch('contactInfo.locality'),
          postal_code: watch('contactInfo.zip'),
          state: watch('contactInfo.province'),
          country: watch('contactInfo.country'),
        }
      }),
    });
    const customerId = await response.json();
    if (!customerId) {
      console.log('Error al crear el cliente');
      return;
    }
    return customerId;
  }

    const handleCheckout = async () => {  
      const stripe = await stripePromise;
      if (!stripe) { 
        return;
      }
      const userEmail = watch('company.email');
      const plan = watch('subscriptionPlan.Plan');
      if(!plan) {
        return;
      }
      const response = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: plan, email: userEmail }),
      });
      const session: StripeSession = await response.json();
      // When the customer clicks on the button, create a current transaction and redirect them to Checkout.
      const [transaction, result] = await Promise.all([
        await createTransaction(session, plan, userEmail),
        stripe.redirectToCheckout({
          sessionId: session.id,
        }),
      ]);
      
      if (result.error) {
        console.log(result.error.message);
      }
    }

  const handleSamePassword = ():ZodIssue | undefined => {
    if (formData!= undefined && formData.company.password !== formData.company.confirmPassword) {  
      return {code: 'invalid_literal',expected: '', received: '', path: ['confirmPassword'], message: 'Las contraseñas no coinciden, por favor revisa que sean iguales'}
    } else {
      return undefined; 
    }
  }

  const handleNext = async () => {
    const data = watch();
    let initialState: State = {message: null, errors: []};
    if (activeStep === 0) {
      initialState = await validateCompanyData(initialState, data);
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
      initialState = await validateContactData(initialState, data);
      if(initialState.errors) {
        setErrors(initialState);
      }
      if (!initialState.errors) {
        setErrors({message: null, errors: []});
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
    if (activeStep === 2) {
      initialState = await validatePersonContactData(initialState, data);
      if(initialState.errors) {
        setErrors(initialState);
      }
      if (!initialState.errors) {
        setErrors({message: null, errors: []});
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
    if( activeStep === 3) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  }
  
  const handleBack = () => {
    if(activeStep === 0){
      router.push('/auth/login');
    }
    setActiveStep((prevStep) => prevStep - 1)
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CompanyForm 
          control={control}
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />;
      case 1:
        return <ContactForm 
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />;
      case 2:
        return <PersonContactForm 
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />;
      case 3:
        return <ResumenForm
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
        />;
      case 4: 
        return <PaymentComponentForm
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
        />; 
      default:
        return null;
    }
  };
  const nextButton = () => {
    if (activeStep === steps.length - 1) {
      return (
        <ButtonCustom
          onClick={handleSubmit(onSubmit)}
          title='Pagar y Finalizar'
          loading={loading}
          disable={false}
          type='submit'
          variant='contained'
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
          <StepperFormComponent
            activeStep={activeStep}
            steps={steps}
          >
            {getStepContent(activeStep)}
          </StepperFormComponent>
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
          <ArrowBack onClick={() => router.back()}/>
          <StepperFormComponent 
            activeStep={activeStep} 
            steps={steps}
          >
            {getStepContent(activeStep)}
          </StepperFormComponent>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 3 }}>
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