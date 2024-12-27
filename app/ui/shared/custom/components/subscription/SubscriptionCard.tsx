'use client';
import { Box, Card, CardContent, Typography, Button, CardActions, Tooltip } from "@mui/material";
import { CheckCircleOutline, InfoOutlined } from "@mui/icons-material";
import { PlanDTO } from "@prisma/client";

export type SubscriptionCardProps = {
    plan: PlanDTO;
    selected: boolean;
    onSelectPlan: (plan: PlanDTO) => void;
}

const SubscriptionCard = ({ plan,selected, onSelectPlan } : SubscriptionCardProps) => {
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
          <CardContent sx={{ display: 'flex', flexDirection: 'column'}}>
            <Box>
              <Typography variant="h4" color="textPrimary" fontWeight="semibold">
                {plan.price} {plan.currency}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', gap: 2 }}>
                {/* Monthly and Bianual Prices */}
                {plan.priceMonthly != null && plan.priceMonthly == 0 && plan.title === 'Gratuito' && (
                <Typography variant="body1" color="textDisabled" sx={{ mb: 3 }}>
                    Gratis
                </Typography>
                )}
                {plan.priceMonthly != null && plan.priceMonthly > 0 && (    
                <Typography variant="body1" color="textDisabled" sx={{ mb: 3 }}>
                    {plan.priceMonthly} {plan.currency}/mes
                </Typography>
                )}
                {plan.priceBianual != null && plan.priceBianual > 0 && (
                <Typography variant="body1" color="textDisabled" sx={{ mb: 3 }}>
                    {plan.priceBianual} {plan.currency}/bianual
                </Typography>
                )}
              </Box>
            </Box>
            <Button
              variant={selected ? "outlined" : "contained"}
              color={selected ? "inherit" : "info"}
              size="large"
              sx={{ textTransform: 'none', borderRadius: 3, fontWeight: "bold", fontSize: "14px", m: '0 auto'}}
              onClick={() => onSelectPlan(plan)}
              startIcon={selected ? <CheckCircleOutline /> : null}
            >
              {selected ? 'Plan actual' : 'Seleccionar '+plan.title}
            </Button>
          </CardContent>
        <CardActions>
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
            {plan.planPreferences.map((preference, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'flex-start',alignItems: 'center'}}>
                <CheckCircleOutline sx={{ mr:1, width: 18, color:"black"}}  />
                <Typography sx={{ mb: 0 }} variant="body2" color="textPrimary" gutterBottom>
                    {preference.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardActions>
      </Card>
    );
};

export default SubscriptionCard;