import { useState } from "react";
import { Box, Card, CardContent, Typography, Button, Grid, Divider, ToggleButtonGroup, ToggleButton, CardActions } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { Plan } from "@/lib/definitions";

export type SubscriptionCardProps = {
    plan: Plan;
    selected: boolean;
    onSelectPlan: (plan: Plan) => void;
}

const SubscriptionCard = ({ plan,selected, onSelectPlan } : SubscriptionCardProps) => {
    return (
      <Card sx={{ 
            maxWidth: 300, 
            minHeight: 350,
            height: '100%', 
            mx: "auto", 
            borderRadius: 3,
            boxShadow: 3, 
            textAlign: "center",
            display: 'flex',
            flexDirection: 'column', 
            justifyContent: 'space-between' 
        }}>
        <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
        {plan.title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            {/* Feature List */}
            <Box>
                <Divider sx={{ my: 2 }} />
                {plan.planPreferences.map((preference, index) => (
                    <Box key={index} sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'flex-start', mt: 1}}>
                        <CheckCircleOutline sx={{ mr:1}} color="primary" />
                        <Typography sx={{ mb: 0 }} variant="body1" color="text" gutterBottom>
                            {preference.name}
                        </Typography>
                    </Box>
                ))}
                <Divider sx={{ my: 2 }} />
            </Box>
        </Box>
        </CardContent>
        <CardActions sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mb: 2}}>
            <Box>
                <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
                    {plan.price}  {plan.currency}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
                    {/* Monthly and Bianual Prices */}
                    {plan.priceMonthly != null && plan.priceMonthly == 0 && plan.title === 'Gratuito' && (
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Gratis
                        </Typography>
                    )}
                    {plan.priceMonthly != null && plan.priceMonthly > 0 && (    
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {plan.priceMonthly} {plan.currency}/mes
                        </Typography>
                    )}
                    {plan.priceBianual != null && plan.priceBianual > 0 && (
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {plan.priceBianual} {plan.currency}/bianual
                        </Typography>
                    )}
                </Box>
            </Box>
            <Button
                variant="contained"
                color={selected ? "success" : "primary"}
                size="large"
                sx={{ borderRadius: 3, fontWeight: "bold", fontSize: "14px" }}
                onClick={() => onSelectPlan(plan)}
                startIcon={selected ? <CheckCircleOutline /> : null}
                >
                Seleccionar
            </Button>
        </CardActions>
      </Card>
    );
};

export default SubscriptionCard;