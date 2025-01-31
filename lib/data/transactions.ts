'use server';
import { PlanDTO, Transaction, TransactionDTO, UserDTO } from "@prisma/client";
import { StripeSession } from "../stripe/session";
import prisma from "@/app/lib/prisma/prisma";
import { SubscriptionStatusEnum, TransactionStatusEnum } from "../enums";
import { getUserByEmail } from "./user";
import { getSubscriptionByUserId } from "./subscriptions";
import { convertDecimalToNumber } from "../utils";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});
export async function createTransaction(session:StripeSession, plan: PlanDTO, userEmail: string): Promise<TransactionDTO | undefined> {
    try {
      const user: UserDTO | undefined = await getUserByEmail(userEmail);
      if (!user) {
        throw new Error('User not found');
      }
      const customer = await stripe.customers.list({ email: user.email });
      if (!customer) {
        throw new Error('Customer not found');
      }

      const invoice = await stripe.invoices.create({
        customer: customer.data[0].id,
        auto_advance: true,
      });

      const subscription = await getSubscriptionByUserId(user.id);
      let subscriptionId = undefined;
      if (subscription) {
        subscriptionId = subscription.id;
      } else {
        const newSubscription = await prisma.subscription.create({
          data: {
            status: SubscriptionStatusEnum.PENDING,
            userId: user.id,
            planId: plan.id,
            remainingOffers: plan.maxOffers,
            usedOffers: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }); 
        subscriptionId = newSubscription.id;
      }
      const transaction = await prisma.transaction.create({
        data: {
          stripe_transaction_id: session.id,
          subscriptionId: subscriptionId,
          planId: plan.id,
          status: TransactionStatusEnum.PENDING,
          amount: plan.price,
          currency: plan.currency,
          createdAt: new Date(),
          updatedAt: new Date(),
          paidOffers: plan.maxOffers,  
          invoiceId: invoice.id,        
        },
        include: {
          Plan: {
            select: {
              id: true,
              title: true,
            }
          },
          Subscription: {
            select: {
              remainingOffers: true,
              usedOffers: true,
            }
          }
        }
      });
      const transactionDTO: TransactionDTO = {
        ...transaction,
        amount: await convertDecimalToNumber(transaction.amount) ?? 0,
      };
      return transactionDTO;
    } catch(e) {
        console.log(e);
    }
}

export async function updateTransactionData(data: Transaction) : Promise<TransactionDTO | undefined> {
  try {
    
    const transaction: Partial<Transaction> = {
      status: data.status,
      updatedAt: new Date(),
    }
    if (data.stripe_payment_method_id) transaction['stripe_payment_method_id'] = data.stripe_payment_method_id;
    if (data.stripe_payment_intent_id) transaction['stripe_payment_intent_id'] = data.stripe_payment_intent_id;
    if (data.stripe_customer_id) transaction['stripe_customer_id'] = data.stripe_customer_id;
    if (data.stripe_transaction_id) transaction['stripe_transaction_id'] = data.stripe_transaction_id;
    if (data.stripe_refound_id) transaction['stripe_refound_id'] = data.stripe_refound_id;
    
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: data.id
      },
      data: transaction,
      include: {
        Plan: {
          select: {
            id: true,
            title: true,
          }
        },
        Subscription: {
          select: {
            remainingOffers: true,
            usedOffers: true,
          }
        }
      }
    });

    const transactionDTO: TransactionDTO = {
      ...updatedTransaction,
      amount: await convertDecimalToNumber(transaction.amount) ?? 0,
    }
    return transactionDTO;
  } catch(e) {
    console.log(e);
  }
}

export async function updatePaymentTransactionInfo(session: StripeSession): Promise<string | undefined> {
    // Update payment transaction info
    let newStatus: TransactionStatusEnum = session.payment_status === 'paid' ? TransactionStatusEnum.PAID : TransactionStatusEnum.PENDING;
    if (session.payment_status === 'incomplete') {
      newStatus = TransactionStatusEnum.FAILED;
    }
    const transaction = await prisma.transaction.findFirst({
      where: {
        stripe_transaction_id: session.id
      },
      include: {
        Subscription: true,
        Plan: true,
      }
    });
    if (!transaction) {
      return undefined;
    }

    await prisma.transaction.update({
      where: {
        id: transaction.id
      },
      data: {
        status: newStatus,
        stripe_transaction_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        stripe_customer_id: session.customer,
        stripe_payment_method_id: session.payment_method_types[0],
        updatedAt: new Date(),
      }
    });
    const remainingOffers = transaction.Subscription.remainingOffers + transaction.Plan.maxOffers;
    const subscription = await prisma.subscription.update({
      where: {
        id: transaction.subscriptionId
      },
      data: {
        status: SubscriptionStatusEnum.ACTIVE,
        remainingOffers: remainingOffers,
        updatedAt: new Date(),
        planId: transaction.Plan.id,
      }
    });
    if (subscription == undefined) {
      return undefined;
    }

    return 'OK';
}

export async function updateTransactionAfterRefund(transactionId: number, refundId: string): Promise<string | undefined> {
  try {
    
    const sqlTransaction = await prisma.$transaction(async (prismaTransaction) => {
      const [refundResult, transactionResult] = await Promise.allSettled([
        stripe.refunds.retrieve(refundId),
        prismaTransaction.transaction.findFirst({
          where: {
            id: transactionId
          }
        })
      ]);  
      if (refundResult.status === 'rejected' || transactionResult.status === 'rejected') {
        return 'KO';
      }
      const refund = refundResult.value;
      const transaction = transactionResult.value;
      
      if (!transaction || !refund) {
        return 'KO';
      }
      
      await prismaTransaction.transaction.update({
        where: {
          id: transaction.id
        },
        data: {
          status: TransactionStatusEnum.REFUNDED,
          updatedAt: new Date(),
          stripe_refound_id: refund.id,
        }
      });
      
      const subscription = await prismaTransaction.subscription.findFirst({
        where: {
          id: transaction.subscriptionId
        },
        include: {
          Transaction: {
            select: {
              id: true,
              status: true,
              paidOffers: true,
              Plan: {
                select: {
                  title: true,
                  id: true,
                }
              }
            }
          },
        }
      });
      if (!subscription) {
        return 'KO';
      }

      const transactions = subscription.Transaction; 
      if (transactions.length === 0 || transactions.every(transaction => transaction.status !== TransactionStatusEnum.PAID)) {
        await prismaTransaction.subscription.update({
          where: {
            id: transaction.subscriptionId
          },
          data: {
            status: SubscriptionStatusEnum.CANCELLED,
            remainingOffers: 0,
            updatedAt: new Date(),
          }
        });
      }
      let paidOffers = 0;
      const transactionsPaid = transactions.filter(transaction => transaction.status === TransactionStatusEnum.PAID);
      if (transactionsPaid.length > 0) {
        paidOffers = transactionsPaid.reduce((acc, transaction) => acc + transaction.paidOffers, 0);
      }
      const remainingOffers = paidOffers - subscription.usedOffers;
      const maxRemainigOffers = Math.max(remainingOffers, 0);;

      let mostValuablePlanTitle = transactions[0].Plan.title;
      let planId = transactions[0].Plan.id;
      transactions.forEach(transaction => {
        if (
          (mostValuablePlanTitle === 'Gratuito' && transaction.Plan.title !== 'Gratuito') ||
          (mostValuablePlanTitle === 'Básico' && (transaction.Plan.title === 'Estándar' || transaction.Plan.title === 'Premium')) ||
          (mostValuablePlanTitle === 'Estándar' && transaction.Plan.title === 'Premium')
        ) {
          mostValuablePlanTitle = transaction.Plan.title;
          planId = transaction.Plan.id;
        }
        return planId;
      });

      await Promise.all([
        prismaTransaction.subscription.update({
          where: {
            id: transaction.subscriptionId
          },
          data: {
            status: SubscriptionStatusEnum.ACTIVE,
            remainingOffers: maxRemainigOffers,
            planId: planId,
            updatedAt: new Date(),
          }
        })
      ]);
      
      return 'OK';
    }, {
      maxWait: 10000,
      timeout: 10000,
    });
    return 'OK';
  } catch(e) {
    console.log(e);
  }
}

export async function getTransactionsBySubscriptionId(subscriptionId: number): Promise<TransactionDTO[] | undefined> {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          subscriptionId: subscriptionId
        },
        include: {
          Plan: {
            select: {
              id: true,
              title: true,
            }
          },
          Subscription: {
            select: {
              remainingOffers: true,
              usedOffers: true,
            }
          }
        }
      });

      const response = await Promise.all(transactions.map(async (transaction) => {
        const transactionDTO: TransactionDTO = {
          ...transaction,
          amount: await convertDecimalToNumber(transaction.amount) ?? 0,
        }
        return transactionDTO;
      }));
      return response;
    } catch(e) {
      console.log(e);
    }
}