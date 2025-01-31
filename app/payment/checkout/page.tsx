import CheckoutPage from "@/app/ui/payment/CheckoutPage";
import { Box } from "@mui/material";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

interface PageProps {
  searchParams: Promise<{
    success: string;
    userEmail: string;
  }>
}

async function page({ searchParams } : PageProps) {
  const params = await searchParams;
  const success = params.success ?? 'false';
  // const planId = params.planId ?? '0';
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
      }}
    >
      <CheckoutPage success={success === 'true'} />
    </Box>
  );
}
export default page;