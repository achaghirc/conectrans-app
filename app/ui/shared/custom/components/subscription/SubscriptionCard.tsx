'use client';
import { Box, Card, CardContent, Typography, Button, CardActions, Tooltip } from "@mui/material";
import { AccountBalanceOutlined, CheckCircleOutline, InfoOutlined } from "@mui/icons-material";
import { PlanDTO } from "@prisma/client";
import ButtonCustom from "../button/ButtonCustom";

export type SubscriptionCardProps = {
    plan: PlanDTO;
    selected: boolean;
    changedPlan?: boolean;
    onSelectPlan: (plan: PlanDTO) => void;
    handlePayNewPlan?: (plan: PlanDTO) => void;
}

const SubscriptionCard = ({ plan,selected, changedPlan, onSelectPlan, handlePayNewPlan } : SubscriptionCardProps) => {
  const buttonMarginTop = plan.title.includes('Premium') ? 0 : 3;
  return (
    <Card sx={{ 
      maxWidth: '100%', 
      minHeight: 350,
      height: '100%', 
      mx: "auto", 
      borderRadius: 3,
      boxShadow: 3, 
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      }}>
        <Box
          sx={{ 
            p: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 40,
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
        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 4, alignContent: 'center'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
            <Typography variant="h4" color="textPrimary" fontWeight="semibold">
              {plan.price} {plan.currency}
            </Typography>
            {/* Monthly and Bianual Prices */}
            {plan.priceMonthly != null && plan.priceMonthly == 0 && plan.title === 'Pack Gratuito' && (
              <Typography variant="body1" color="textDisabled">
                Gratis
              </Typography>
            )}
            {plan.priceMonthly != null && plan.priceMonthly > 0 && (    
              <Typography variant="body1" color="textDisabled">
                {plan.title.includes('Premium') ? `12 pagos mensuales de` : `Pago único: `} {plan.priceMonthly} {plan.currency}
              </Typography>
            )}
            {plan.priceBianual != null && plan.priceBianual > 0 && (
              <Typography variant="body1" color="textDisabled">
                {plan.title.includes('Premium') ? `2 pagos bianuales de` : `Pago bianual: `} {plan.priceBianual} {plan.currency}
              </Typography>
            )}
          </Box>
          
          <Tooltip title={selected ? 'Último pack seleccionado' : 'Seleccionar '+plan.title}>

            <Button
              variant={selected ? "outlined" : "contained"}
              color={selected ? "inherit" : "info"}
              size="large"
              sx={{ 
                textTransform: 'none', 
                borderRadius: 3, 
                fontWeight: "bold", 
                fontSize: "14px", 
                mx: 'auto',
                mt: buttonMarginTop,
              }}
              onClick={() => onSelectPlan(plan)}
              startIcon={selected ? <CheckCircleOutline /> : null}
              >
              {selected ? 'Pack seleccionado' : 'Seleccionar '+plan.title}
            </Button>
          </Tooltip>
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              alignContent: 'start',
              gap: 1,
            }}
          >
          <Typography variant="body2" color="textSecondary"> 
            {plan.description}
          </Typography>
            {plan.PlanPreferences.map((preference, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'flex-start',alignItems: 'center'}}>
                <CheckCircleOutline sx={{ mr:1, width: 18, color:"black"}}  />
                <Typography sx={{ mb: 0 }} variant="body2" color="textPrimary" gutterBottom>
                    {preference.preferencePlanEncType?.name ?? ''}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
        <CardActions sx={{ display: selected ? 'flex': 'none', justifyContent: 'center', alignItems: 'center', height: 60 }}>
          <ButtonCustom
            title={!changedPlan ? "Comprar de nuevo" : "Pagar ahora"}
            variant="contained"
            color="primary"
            onClick={() => handlePayNewPlan && handlePayNewPlan(plan)}
            startIcon={<AccountBalanceOutlined />}
            loading={false}
            type="button"
            sx={{ 
              width: '90%', 
              borderRadius: 2, 
              fontWeight: "bold", 
              fontSize: "14px", 
              mx: 'auto', 
            }}
          />
        </CardActions>
    </Card>
  );
};

export default SubscriptionCard;