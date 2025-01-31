const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

import { NextApiRequest, NextApiResponse } from "next";

const createCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const { email, name, address } = req.body;
    if (!email || !name || !address) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }
    //Already exists 
    const existingCustomer = await stripe.customers.list({ email: email });
    if (existingCustomer.data.length > 0) {
      res.status(200).json({ id: existingCustomer.data[0].id });
      return;
    }
    //Create a stripe customer
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      address: {
        line1: address.streetAddress,
        city: address.city,
        postal_code: address.postal_code,
        state: address.state,
        country: address.country
      }
    });
    res.status(200).json({ id: customer.id });
  }
}

export default createCustomer;