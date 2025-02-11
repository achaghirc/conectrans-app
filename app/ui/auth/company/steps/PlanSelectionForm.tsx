'use client';
import { SignUpCompanyFormData } from '@/lib/definitions';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SubscriptionCard from '@/app/ui/shared/custom/components/subscription/SubscriptionCard';
import { useState } from 'react';
import { getAllPlans } from '@/lib/data/plan';
import SubscriptionCardSkeleton from '@/app/ui/shared/custom/components/skeleton/SubscriptionCardSkeleton';
import { useQuery } from '@tanstack/react-query';
import { PlanDTO } from '@prisma/client';
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
interface PlanSelectionFormProps {
  control: Control<Partial<SignUpCompanyFormData>>;
  register: UseFormRegister<Partial<SignUpCompanyFormData>>;
  watch: UseFormWatch<Partial<SignUpCompanyFormData>>;
  setValue: UseFormSetValue<Partial<SignUpCompanyFormData>>;
};

export default function PlanSelectionForm({ 
  setValue
}: PlanSelectionFormProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanDTO | null>(null);

  const { data: plans = [], isLoading, isError } = useQuery({
    queryKey: ['plans'], 
    queryFn: (): Promise<PlanDTO[] | undefined> => getAllPlans(),
  });

  const onSelectPlan = (plan: PlanDTO) => {
    setSelectedPlan(plan);
    setValue('subscriptionPlan.planId', plan.id);
    setValue('subscriptionPlan.Plan', plan);
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
            plans.map((plan: PlanDTO, index: number) => (
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