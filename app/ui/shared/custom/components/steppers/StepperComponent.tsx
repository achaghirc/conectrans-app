import { Box, Button, CircularProgress, Step, StepLabel, Stepper } from '@mui/material';
import React from 'react'

export type StepperProps = {
  children: React.JSX.Element | null;
  activeStep: number;
  steps: string[];
  isLoading?: boolean;
  isLastStep: boolean;
  handleNext: () => void;
  handleBack: () => void;
}

export default function StepperComponent({children, activeStep, steps, isLastStep, isLoading, handleNext, handleBack }: StepperProps) 
	{
    return (
      <>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label: string) => (
              <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {children}
        <Box component={'form'} noValidate autoComplete='off' sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 3 }}>
          {activeStep >= 1 && (
              <Button onClick={handleBack}>
              Volver
            </Button>
          )}
          {isLastStep ? (
            <Button 
              variant='outlined'
              color='inherit'
              onClick={handleNext}
              endIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Finalizando' : 'Finalizar'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Siguiente
            </Button>
          )}
        </Box>
      </>
    );
  }
