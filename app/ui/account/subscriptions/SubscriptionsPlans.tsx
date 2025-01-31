'use client';
import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import SubscriptionCard from '../../shared/custom/components/subscription/SubscriptionCard';
import SubscriptionCardSkeleton from '../../shared/custom/components/skeleton/SubscriptionCardSkeleton';
import { getAllPlans } from '@/lib/data/plan';
import { useQuery } from '@tanstack/react-query';
import { PlanDTO } from '@prisma/client';

export type SubscriptionsPlansProps = {
  activePlanId: number;
  handleChange: (plan: PlanDTO) => void;
  handlePayNewPlan: (plan: PlanDTO) => void;
}

const SubscriptionsPlans: React.FC<SubscriptionsPlansProps> = ({activePlanId, handlePayNewPlan, handleChange}) => {
  const { data, isLoading, isError, isFetched } = useQuery({queryKey: ['plans'], queryFn: (): Promise<PlanDTO[] | undefined> => getAllPlans()});
  const [selectedPlan, setSelectedPlan] = React.useState<PlanDTO | undefined>();

  const onSelectPlan = (plan: PlanDTO) => {
    setSelectedPlan(plan);
    handleChange(plan);
  }
  if (isError) {
    throw new Error('Error al cargar los planes');
  }
  useEffect(() => {
    if (activePlanId && isFetched) {
      const plan = data?.find(plan => plan.id === activePlanId);
      setSelectedPlan(plan);
    }
  }, [data, activePlanId, isFetched]);
  if (isLoading) {
    return (
      <Grid container spacing={3} justifyContent="center" mt={3}>
        {[...Array(4)].map((_, index) => (
          <Grid size={{xs: 12, sm: 6, lg: 3}} key={index}>
            <SubscriptionCardSkeleton />
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <div>
      <Grid container spacing={3} justifyContent="center" mt={3}>
        {!isLoading && data ? (
          data?.map((plan: PlanDTO, index: number) => (
              <Grid size={{xs: 12, sm: 6, lg: 3}} key={index}>
                <SubscriptionCard
                  plan={plan}
                  selected={plan.id === selectedPlan?.id}
                  changedPlan={activePlanId !== selectedPlan?.id}
                  onSelectPlan={onSelectPlan}
                  handlePayNewPlan={handlePayNewPlan}
                />
              </Grid>
            ))
        ) : (
          [...Array(4)].map((_, index) => (
            <Grid size={{xs: 12, sm: 6, lg: 3}} key={index}>
              <SubscriptionCardSkeleton />
            </Grid>
          ))
        )}
      </Grid>
    </div>
  )
}

export default SubscriptionsPlans;
