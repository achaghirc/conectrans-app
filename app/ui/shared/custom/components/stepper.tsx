import { StepperProps } from '@/lib/definitions';
import { Box, Button, Step, StepLabel, Stepper } from '@mui/material';
import React from 'react'



export default function StepperComponent({children, activeStep, steps, isLastStep, handleNext, handleBack }: StepperProps) 
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
					<Button onClick={handleNext}>
						{isLastStep ? 'Finalizar' : 'Siguiente'}
					</Button>
				</Box>
      </>
    );
  }
