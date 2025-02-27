const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

import { updatePaymentTransactionInfo, updateTransactionData } from '@/lib/data/transactions';
import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  throw new Error("🚨 STRIPE_WEBHOOK_SECRET is missing! Check your environment variables.");
}

console.log('webhookSecret', webhookSecret);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
    let event; 
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      return res.status(400).send('Missing Stripe signature');
    }
    try {
      const rawBody = await buffer(req);
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      res.status(400).send('Webhook Error');
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout Session Completed:', session);
        // Aquí puedes manejar el evento como guardar en la base de datos, enviar correos, etc.
        try {
          await updatePaymentTransactionInfo(session);
        } catch (error) {
          console.error('❌ Error updating transaction:', error);
        }
        break;
      case 'checkout.session.async_payment_succeeded':
        const sessionAsync = event.data.object;
        console.log('Checkout Session Async Payment Succeeded:', sessionAsync);
        // Aquí puedes manejar el evento como guardar en la base de datos, enviar correos, etc.
        // await updateTransactionData(sessionAsync);
        break;
      case 'checkout.session.async_payment_failed':
        const sessionAsyncFailed = event.data.object;
        console.log('Checkout Session Async Payment Failed:', sessionAsyncFailed);
        // Aquí puedes manejar el evento como guardar en la base de datos, enviar correos, etc.
        try {
          await updatePaymentTransactionInfo(session);
        } catch (error) {
          console.error('❌ Error updating transaction:', error);
        }
        break;
      case 'checkout.session.expired':
        console.log('Checkout Session Expired:', event.data.object);
        break;

      // Maneja otros eventos que necesites
      default:
      console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
}