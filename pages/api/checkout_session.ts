const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});


import { PlanDTO } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';


async function getActiveStripeProducts() { 
  const products = await stripe.products.list();
  return products.data.filter((product: any) => product.active);
}


const checkOutSessionController = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const { plan, success_url, cancel_url, email } = req.body;
    const planProduct: PlanDTO = plan;
    if (!planProduct) {
      res.status(400).json({ error: 'Missing required parameter "plan"' });
      return;
    }
    const activeStripeProducts = await getActiveStripeProducts();
    const product = activeStripeProducts.find((product: any) => product.name === planProduct.title);
    let price = null;
    if (!product) {
      price = await createProductOnStripe(planProduct);
    }
    const prices = await stripe.prices.list({ product: product.id });
    price = prices.data[0]
    let customer = await stripe.customers.list({ email: email });
    if (!customer || customer.data.length === 0) {
      customer = stripe.customers.create({ email: email });
    }
    
    try {
      const session = await stripe.checkout.sessions.create(
        {
          payment_method_types: ['card'],
          customer: customer.data[0].id,
          line_items: [
            {
              price: price.id,
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: success_url ?? `${process.env.NEXT_PUBLIC_DOMAIN}/`,
          cancel_url: cancel_url ?? `${process.env.NEXT_PUBLIC_DOMAIN}/payment/checkout?success=false`,
        });

      res.status(200).json({ id: session.id });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        console.log('Error:', error.message);
        res.status(500).json({ statusCode: 500, message: error.message });
      } else {
        res.status(500).json({ statusCode: 500, message: 'An unknown error occurred' });
      }
    }
  }
}

async function createProductOnStripe(plan: PlanDTO) {
  const product = await stripe.products.create({
    name: plan.title,
    type: 'service',
  });
  const price = await stripe.prices.create({
    unit_amount: plan.price * 100,
    currency: 'eur',
    product: product.id,
    product_data: {
      name: plan.title,
    }
  });
  return price;
}

export default checkOutSessionController;