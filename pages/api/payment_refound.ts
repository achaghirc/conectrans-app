const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { countOffersAfterTransactionCreated } from "@/lib/data/offer";
import { updateTransactionAfterRefund } from "@/lib/data/transactions";
import { NextApiRequest, NextApiResponse } from "next";


/**
 * Devuelve el número de ofertas que se han creado a partir del pago de una transacción
 * @param transactionId identificador de la transacción a devolver
 * @returns The number of offers created after the transaction was created
 */
const countOffersCreatedAfterTransaction = async (transactionId: number) => {
  return await countOffersAfterTransactionCreated(transactionId);
}

export const createPaymentRefound = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const { transactionId, payment_intent } = req.body;
    const countOffers = await countOffersCreatedAfterTransaction(transactionId);

    if (countOffers > 0) {
      res.status(400).json({ error: 'Esta transacción ya ha sido empleada para crear ofertas. Recuerda que no es posible realizar una devolución tras emplear el producto' });
      return;
    }
    
    if (!payment_intent ) {
      res.status(400).json({ error: 'No se puede realizar la devolución. Contacte con el administrador.' });
      return;
    }
    //Already exists 
    //CREATE A REFUND
    const alreadyRefunded = await stripe.refunds.list({
      payment_intent: payment_intent,
    });
    if (alreadyRefunded.data.length > 0) {
      await updateTransactionAfterRefund(transactionId, alreadyRefunded.data[0].id);
      res.status(400).json({ error: 'La devolución ya ha sido gestionada, recibirá su reembolso en los proximos 14 días hábiles.' });
      return;
    }
    const refund = await stripe.refunds.create({
      payment_intent: payment_intent,
    });
    await updateTransactionAfterRefund(transactionId, refund.id);
    res.status(200).json({ id: refund.id });
  }
}