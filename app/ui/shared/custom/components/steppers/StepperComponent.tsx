import { Box, Button, CircularProgress, Step, StepLabel, Stepper } from '@mui/material';
import React from 'react'

export type StepperProps = {
  children: React.JSX.Element | null;
  activeStep: number;
  steps: string[];
}

export default function StepperComponent({children, activeStep, steps }: StepperProps) 
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
      </>
    );
  }
