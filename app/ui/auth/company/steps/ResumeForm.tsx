'use client';
import { Plan, SignUpCompanyFormData } from '@/lib/definitions';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SubscriptionCard from '@/app/ui/shared/custom/components/subscription/SubscriptionCard';
import { useState } from 'react';
import { getAllPlans } from '@/lib/data/plan';
import SubscriptionCardSkeleton from '@/app/ui/shared/custom/components/skeleton/SubscriptionCardSkeleton';
import { useQuery } from '@tanstack/react-query';
interface ResumeFormProps {
  formData: SignUpCompanyFormData;
  setFormData: (data: any) => void;
};

export default function ResumeForm({ formData, setFormData }: ResumeFormProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const { data: plans = [], isLoading, isError } = useQuery({
    queryKey: ['plans'], 
    queryFn: (): Promise<Plan[] | undefined> => getAllPlans(),
  });

  const onSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormData({ subscriptionPlan: {...formData.subscriptionPlan, planId: plan.id }});
  }

  if(isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom mb={5}>
          Error al cargar los planes
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom mb={5}>
        Elige tu plan
      </Typography>
      {isLoading ? (
         <Grid container spacing={4} justifyContent="center">
          {[...Array(4)].map((_, index) => (
            <Grid size={{xs: 12, sm: 6, md: 3}} key={index}>
              <SubscriptionCardSkeleton />
            </Grid>
         ))}
       </Grid>
      ): (
        <Grid container spacing={4} justifyContent="center">
          {plans && (
            plans.map((plan: Plan, index: number) => (
              <Grid size={{xs: 12, sm: 6, md: 3}} key={index}>
                <SubscriptionCard selected={selectedPlan?.id == plan.id} plan={plan} onSelectPlan={onSelectPlan}/>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
}