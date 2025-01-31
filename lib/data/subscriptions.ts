'use server';
import prisma from "@/app/lib/prisma/prisma";
import { getPlanById, getPlanByTitle } from "./plan";
import { PlanDTO, SubscriptionDTO } from "@prisma/client";
import { SubscriptionStatusEnum } from "../enums";
import { FREE_PACK_TITLE } from "../constants";

export async function getSubscriptionByUserIdAndActive(userId: string): Promise<SubscriptionDTO | undefined> {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: userId,
            },
            include: {
              Plan: {
                include: {
                  PlanPreferences: true
                }
              },
              Transaction: true
            }
        });
        if (!subscription) return generateTemporalSubscriptionFree(userId);
        return {
          ...subscription,
          Plan: {
            ...subscription.Plan,
            title: subscription.Plan.title,
            description: subscription.Plan.description ?? '',
            price: convertDecimalToNumber(subscription.Plan.price),
            priceMonthly: convertDecimalToNumber(subscription.Plan.priceMonthly),
            priceBianual: convertDecimalToNumber(subscription.Plan.priceBianual),
            priceYearly: convertDecimalToNumber(subscription.Plan.priceYearly),
            PlanPreferences: subscription.Plan.PlanPreferences
          },
          Transaction: subscription.Transaction.map(transaction => {
            return {
              ...transaction,
              stripe_payment_method_id: transaction.stripe_payment_method_id,
              stripe_transaction_id: transaction.stripe_transaction_id,
              status: transaction.status,
              amount: convertDecimalToNumber(transaction.amount)
            }
          })
        }
    } catch(e) {
        console.log(e);
    }
}

export async function getSubscriptionByUserId(userId: string): Promise<SubscriptionDTO | undefined> {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: userId,
            },
            include: {
              Plan: {
                include: {
                  PlanPreferences: {
                    include: {
                      preferencePlanEncType: true
                    }
                  }
                }
              },
            }
        });
        if (!subscription) return;
        return {
          ...subscription,
          Plan: {
            ...subscription.Plan,
            title: subscription.Plan.title,
            description: subscription.Plan.description ?? '',
            price: convertDecimalToNumber(subscription.Plan.price),
            priceMonthly: convertDecimalToNumber(subscription.Plan.priceMonthly),
            priceBianual: convertDecimalToNumber(subscription.Plan.priceBianual),
            priceYearly: convertDecimalToNumber(subscription.Plan.priceYearly),
            PlanPreferences: subscription.Plan.PlanPreferences
          }
        };
    } catch(e) {
        console.log(e);
    }
}

const convertDecimalToNumber = (value: any) => {
    return value ? Number(value) : 0;
}

export async function hasAlreadyASubscription(userId: string): Promise<boolean | undefined> {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: userId,
                status: 'active'
            }
        });
        return subscription ? true : false;
    } catch(e) {
        console.log(e);
    }
}
export async function assignPlanFreeToSubscripcition(subscripctionId: number) : Promise<void> {
  try {
    const plan: PlanDTO | undefined = await getPlanByTitle(FREE_PACK_TITLE);
    if (!plan) {
      return;
    }
    await prisma.subscription.update({
      where: {
        id: subscripctionId
      },
      data: {
        planId: plan.id,
        status: SubscriptionStatusEnum.ACTIVE,
        updatedAt: new Date()
      }
    });
  } catch(e) {
    console.log(e);
  }
}

export async function generateTemporalSubscriptionFree(userId: string) : Promise<SubscriptionDTO | undefined> {
  try {
    const hasSubscription = await hasAlreadyASubscription(userId);
    let plan = null;
    if(!hasSubscription) {
      plan = await getPlanByTitle(FREE_PACK_TITLE);
    }
    if(plan == undefined) {
      return undefined;
    }
    const subscription : SubscriptionDTO = {
      id: 0,
      userId: userId,
      planId: plan.id ?? 22,
      status: SubscriptionStatusEnum.TEMPORAL,
      remainingOffers: plan.maxOffers,
      usedOffers: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      Plan: {
        ...plan,
        title: plan.title,
        description: plan.description ?? '',
        price: convertDecimalToNumber(plan.price),
        priceMonthly: convertDecimalToNumber(plan.priceMonthly),
        priceBianual: convertDecimalToNumber(plan.priceBianual),
        priceYearly: convertDecimalToNumber(plan.priceYearly),
        PlanPreferences: plan.PlanPreferences
      }
    };
    return subscription;
  } catch(e) {
    console.log(e);
  }
}

export async function assignPlanToUser(userId: string, planId?: number): Promise<SubscriptionDTO | undefined> {
    try {
        const hasSubscription = await hasAlreadyASubscription(userId);
        let plan = null;
        if (!planId && !hasSubscription) {
            plan = await getPlanByTitle(FREE_PACK_TITLE);
        } else {
            plan = await getPlanById(planId ?? 0);
        }
        if(plan == undefined) {
          return;
        }
        const subscription = await prisma.subscription.create({
            data: {
                userId: userId,
                planId: plan.id ?? 22,
                status: 'active',
                remainingOffers: plan.maxOffers,
                usedOffers: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            include: {
              Plan: {
                include: {
                    PlanPreferences: {
                        include: {
                          preferencePlanEncType: true
                        }
                    }
                }
              },
            }
        });
        return {
          ...subscription,
          Plan: {
            ...subscription.Plan,
            title: subscription.Plan.title,
            description: subscription.Plan.description ?? '',
            price: convertDecimalToNumber(subscription.Plan.price),
            priceMonthly: convertDecimalToNumber(subscription.Plan.priceMonthly),
            priceBianual: convertDecimalToNumber(subscription.Plan.priceBianual),
            priceYearly: convertDecimalToNumber(subscription.Plan.priceYearly),
            PlanPreferences: subscription.Plan.PlanPreferences
          } 
        };
    } catch(e) {
        console.log(e);
    }
}

export async function updateSubscriptionAfterNewOffer(subscripctionId: number) : Promise<void> {
    try {
        await prisma.subscription.update({
            where: {
                id: subscripctionId
            },
            data: {
                usedOffers: {
                    increment: 1
                },
                remainingOffers: {
                    decrement: 1
                },
                updatedAt: new Date()
            }
        });
    } catch(e) {
        console.log(e);
    }
}