'use client';
import { Plan, SignUpCompanyFormData } from '@/lib/definitions';
import { Box, Typography, Divider, Avatar, CardContent, Card, CardHeader } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SubscriptionCard from '@/app/ui/shared/custom/components/subscription/SubscriptionCard';
import { useEffect, useState, useTransition } from 'react';
import { getAllPlans } from '@/lib/data/plan';
import SubscriptionCardSkeleton from '@/app/ui/shared/custom/components/skeleton/SubscriptionCardSkeleton';
import { Subscription } from '@prisma/client';
interface ResumeFormProps {
  formData: SignUpCompanyFormData;
  setFormData: (data: any) => void;
};

const plans = [
  {
    title: "Gratuito",
    price: "0€",
    features: ["Acceso limitado"],
  },
  {
    title: "Básico",
    price: "200€",
    features: ["1 Oferta", "Acceso Ilimitado"],
  },
  {
    title: "Estándar",
    price: "450€",
    features: ["3 Ofertas", "Acceso Ilimitado"],
  },
  {
    title: "Premium",
    price: "1400€",
    priceOptions: ["140€ One-time", "2 Payments of 60€", "Monthly 12€"],
    features: [
      "12 Ofertas (1/mes)",
      "Oferta destacada",
      "Editar Oferta",
      "Oferta Anónima",
      "Acceso Ilimitado",
    ],
  },
];

export default function ResumeForm({ formData, setFormData }: ResumeFormProps) {

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  
  const getPlans = async ():Promise<void> => {
      const plans = await getAllPlans();
      if (plans) {
        setPlans(plans);
      }
  }

  const onSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormData({ subscriptionPlan: {...formData.subscriptionPlan, planId: plan.id }});
  }

  useEffect(() => { 
    getPlans();
  },[]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom mb={5}>
        Elige tu plan
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {plans.length > 0 ? (
          plans.map((plan: Plan, index: number) => (
          <Grid size={{xs: 12, sm: 6, md: 3}} key={index}>
            <SubscriptionCard selected={selectedPlan?.id == plan.id} plan={plan} onSelectPlan={onSelectPlan}/>
          </Grid>
        ))
      ) : (
        [...Array(4)].map((_, index) => (
          <Grid size={{xs: 12, sm: 6, md: 3}} key={index}>
            <SubscriptionCardSkeleton />
          </Grid>
        ))
      )}
      </Grid>
    </Box>
  );
}