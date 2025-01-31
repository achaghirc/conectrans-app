'use client';
import { SignUpCompanyFormData } from '@/lib/definitions';
import { Box, Button, Card, CardActions, CardContent, Tooltip, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import { getPlanById } from '@/lib/data/plan';
import { PlanDTO } from '@prisma/client';
import { CheckCircleOutline, InfoOutlined } from '@mui/icons-material';
import BoxTextItem from '@/app/ui/shared/custom/components/box/BoxTextItem';

type PaymentComponentFormProps = {
  control: Control<Partial<SignUpCompanyFormData>>;
  register: UseFormRegister<Partial<SignUpCompanyFormData>>;
  watch: UseFormWatch<Partial<SignUpCompanyFormData>>;
  setValue: UseFormSetValue<Partial<SignUpCompanyFormData>>;
};


const PaymentComponentForm: React.FC<PaymentComponentFormProps> = (
  { control, register, watch, setValue }
) => {

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);



  const plan: PlanDTO | undefined = watch('subscriptionPlan.Plan');

  if(!plan) {
    return null;
  }


  return (
    <Box component={'div'} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        mx: 'auto', 
        width: '50%', 
        mt: 2, 
        gap: 4
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" component={"h1"} textAlign={'start'} fontWeight={900}>
          Resumen del Pago
        </Typography>
      </Box>
      <Card
        sx={{ 
          width: '50%',
          minHeight: 250,
          height: '100%', 
          mx: "auto", 
          borderRadius: 3,
          boxShadow: 3, 
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'center',
        }}
      >
        <Box
          sx={{ 
            p: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            textAlign: 'start', 
            background: 'linear-gradient(to right,rgb(184, 182, 182),rgb(162, 162, 162),rgb(163, 163, 164))', 
            color: 'white' 
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" color="textPrimary" fontSize={14}>
            {plan.title}
          </Typography>
          <Tooltip title={plan.description}>
            <InfoOutlined color="action"/> 
          </Tooltip>
        </Box>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" component="h2" fontWeight={200} fontSize={18}>
              Detalles del Plan
            </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={200}>
                    Nombre
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {plan.title}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={200}>
                    Descripción
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {plan.description}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body1" fontWeight={200}>
                  Incluye
                </Typography>
                {plan.PlanPreferences.map((preference, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'flex-start',alignItems: 'center'}}>
                    <CheckCircleOutline sx={{ mr:1, width: 18, color:"black"}}  />
                    <Typography sx={{ mb: 0 }} variant="body2" color="textPrimary" gutterBottom>
                        {preference.preferencePlanEncType.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', mb: 2 }}>
            <Typography variant="h4" textAlign={'center'} fontWeight={600}>
              {plan.price} {plan.currency}
            </Typography>
        </CardActions>
      </Card>
      {/* <Button
        type="button"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleCheckout(e)}
        sx={{
          height: 36,
          background: '#556cd6',
          borderRadius: 4,
          color: 'white',
          border: 0,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0px 4px 5.5px 0px rgba(0, 0, 0, 0.07)',
          '&:hover': {
            opacity: 0.8,
          }
        }}
      
      >
        Pagar y Finalizar
      </Button> */}
    </Box>
  )
}

export default PaymentComponentForm
