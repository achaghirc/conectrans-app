import {  Step, StepLabel, Stepper } from '@mui/material';
import React from 'react'

type StepperFormComponentProps = {
  children: React.JSX.Element | null;
  activeStep: number;
  steps: string[];
}

const StepperFormComponent: React.FC<StepperFormComponentProps> = (
  { children, activeStep, steps}
) => {

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
  )
}



export default StepperFormComponent;
