import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { OfferDTO } from '@prisma/client'
import { State } from '@/lib/definitions'
import { Session } from 'next-auth'
import { SnackbarCustomProps } from '../../../shared/custom/components/snackbarCustom'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material'

import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { getEncoderTypeData } from '@/lib/data/encoderType'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ButtonCustom from '../../../shared/custom/components/button/ButtonCustom'
import StepperFormComponent from '../../../shared/custom/components/steppers/StepperFormComponent'
import OfferInformationStep from '../steps/OfferInformationStep'
import OfferRequirementsStep from '../steps/OfferRequirementsStep'
import OfferLocationStep from '../steps/OfferLocationStep'
import { validateOfferInformation, validateOfferLocation, validateOfferRequirements } from '@/lib/validations/offerValidate'
import { createOffer } from '@/lib/data/offer'
import useMediaQueryData from '@/app/ui/shared/hooks/useMediaQueryData'
import { CustomSwitch } from '@/app/ui/shared/custom/components/switch/CustomSwitch'
import { Star, StarOutlineOutlined } from '@mui/icons-material'
dayjs.locale('es')


type CreateOfferComponentProps = {
  session: Session | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSnackbarProps: (snackbarProps: Partial<SnackbarCustomProps>) => void;
}

const steps = ['Información', 'Requisitos', 'Ubicación'];

const CreateOfferComponent:React.FC<CreateOfferComponentProps> = ({
  session,
  open,
  setOpen,
  setSnackbarProps
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const queryClient = useQueryClient();
  const { mediaQuery } = useMediaQueryData();
  
  const { data: encoders, isLoading: isLoadingEncoders, isError: isErrorEncoders} = useQuery({ 
    queryKey: ['encoders'], 
    queryFn: () => getEncoderTypeData() 
  });

  const [formState, setFormState] = React.useState<State>({
    message: '',
    errors: []
  });
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
  } = useForm<Partial<OfferDTO>>()

  const onSubmit: SubmitHandler<Partial<OfferDTO>> = async(data) => {
    console.log(data)
    setLoading(true);
    if (activeStep === 2) {
      const state = await validateStep(data, validateOfferLocation);
      setFormState(state);
      if (state.errors && state.errors.length > 0) {
        setLoading(false);
        return;
      }
    }
    try {
      const res = await createOffer(data as OfferDTO, session?.user.id ?? '');   
        setSnackbarProps({
          open: true,
          message: res.message,
          severity: res.status == 'KO' ? 'error' : res.status == 'WARN' ? 'warning' : 'success'
        })
        setOpen(false);
        setLoading(false);
        await Promise.all([
          await queryClient.invalidateQueries({
            queryKey: ['offers_active']
          }),
          await queryClient.invalidateQueries({
            queryKey: ['offers_historical']
          }),
        ]);
    }catch (error) {
      setSnackbarProps({
        open: true,
        message: 'Error al crear la oferta',
        severity: 'error'
      })
    } finally {
      setLoading(false);
    }
  }

  const getStepContent = (step: number) => {  
    switch(step) {
      case 0:
        return <OfferInformationStep 
          control={control} 
          formState={formState} 
          encoders={encoders}
          watch={watch} 
          setValue={setValue}
        />
      case 1:
        return <OfferRequirementsStep 
          control={control} 
          formState={formState} 
          encoders={encoders}
          setValue={setValue}
        />
      case 2:
        return <OfferLocationStep 
          control={control} 
          setValue={setValue} 
          formState={formState} 
        />
      default:
        return <></>
    }
  }
  const nextButton = () => {
    if (activeStep === steps.length - 1) {
      return (
        <ButtonCustom
          onClick={handleSubmit(onSubmit)}
          title='Finalizar'
          loading={loading}
          disable={false}
          type='submit'
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

  const validateStep = async (data: Partial<OfferDTO>, action: (data: Partial<OfferDTO>) => Promise<State>) => {
    return await action(data);
  }

  const handleNext = async () => {
    const data = watch();
    let state = formState;
    if (activeStep === 0){
      state = await validateStep(data, validateOfferInformation);
    }
    if (activeStep === 1) {
      state = await validateStep(data, validateOfferRequirements);
    }
    //LAST STEP IS IN OnSubmit method.
    setFormState(state);
    if (state.errors && state.errors.length === 0) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  }

  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog
          open={open} 
          onClose={() => setOpen(false)}
          aria-labelledby="create-offers-modal"
          aria-describedby="Allows companies to creates offers"
          PaperProps={{
            style: {
              width: mediaQuery ? '90vw': '100vw',
              height: mediaQuery ? '95vh' : '100vh',
              maxWidth: '100%',
              maxHeight: '100%',
              margin: 0,
              overflow: 'scroll'
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2}}>
          <Typography fontSize={25} fontWeight={700}>
            Crear oferta
          </Typography>
          <FormGroup sx={{ display: {xs: 'none', sm: 'flex'}, flexDirection: 'row', justifyContent: 'space-around', gap: 1}}>
            <FormControlLabel 
              control={<CustomSwitch 
                name='isFeatured'
                value={watch('isFeatured') ?? false}
                checked={watch('isFeatured') ?? false}
                onChange={(e) => setValue('isFeatured', e.target.checked as unknown as never)}
              />} 
              label={'Destacada'} 
              labelPlacement='end' 
            />
            <FormControlLabel 
              control={<CustomSwitch 
                name='isAnonymous'
                value={watch('isAnonymous') ?? false}
                checked={watch('isAnonymous') ?? false}
                onChange={(e) => setValue('isAnonymous', e.target.checked as unknown as never)}
              />}
              label="Anónima" 
              labelPlacement='end' 
            />
          </FormGroup>
        </DialogTitle>
        <Box sx={{ display: {xs: 'flex', sm: 'none'}, flexDirection: 'column', gap: 2, pb: 2}}>
          <Divider variant='fullWidth'/>
          <FormGroup sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', gap: 1}}>
            <FormControlLabel 
              control={<CustomSwitch 
                {...register('isFeatured')}
              />}
              label={'Destacada'} 
              labelPlacement='end' 
            />
            <FormControlLabel 
              control={<CustomSwitch 
                {...register('isAnonymous')} 
              />} 
              label="Anónima" 
              labelPlacement='end' 
            />
          </FormGroup>
        </Box>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: '80%'}}>
          <DialogContentText fontSize={12}>
            Emplea este modal para crear una nueva oferta. Tenga en cuenta que, dependiendo de su plan de suscripción, es posible que no pueda editar la oferta una vez creada.
          </DialogContentText>
          <StepperFormComponent
            activeStep={activeStep}
            steps={steps}
          >
            {getStepContent(activeStep)}
          </StepperFormComponent>
        </DialogContent>
        <DialogActions>
          <ButtonCustom 
            onClick={() => {
              if(activeStep === 0) {
                setOpen(false);
                return;
              }
              handleBack();
            }}
            title='Volver'
            loading={false}
            disable={false}
            type='button'
            color='secondary'
          />
          {nextButton()}
        </DialogActions>
      </Dialog>
    </form>
  )
}

export default CreateOfferComponent;
