'use server';

import prisma from "@/app/lib/prisma/prisma";
import { Plan, PlanPreference } from "../definitions";
import { EncoderType } from "@prisma/client";
import { getEncoderTypeByIdsIn } from "./encoderType";


export async function getAllPlans(): Promise<Plan[] | undefined> {
    try {
        const plans =  await prisma.plan.findMany({
            orderBy: {
                price: 'asc'
            },
            include: {
                PlanPreferences: true
            }
        });
        const plansWithPreferences = await Promise.all(plans.map(async (plan) => {
            const planPreferenceIds = plan.PlanPreferences.map((preference:PlanPreference) => preference.preferencePlanId);
            const planPreferences: EncoderType[] | undefined = await getEncoderTypeByIdsIn(planPreferenceIds); 
            return {...plan,
                    description: plan.description ?? '',
                    price: plan.price.toNumber() ?? null,
                    priceMonthly: plan.priceMonthly.toNumber() ?? null,
                    priceBianual: plan.priceBianual?.toNumber() ?? null,
                    priceYearly: plan.priceYearly?.toNumber() ?? null,
                    planPreferences: planPreferences ?? []
                };             
        }));
        return plansWithPreferences;
    }catch(e) {
        console.log(e);
    }
}

export async function getPlanById(id: number): Promise<Plan | undefined> {
    try {
        const plan = await prisma.plan.findFirst({
            where: {
                id: id,
            },
            include: {
                PlanPreferences: true
            }
        });
        if (!plan) return undefined;
        const planPreferenceIds = plan.PlanPreferences.map((preference:PlanPreference) => preference.preferencePlanId);
        const planPreferences: EncoderType[] | undefined = await getEncoderTypeByIdsIn(planPreferenceIds); 
        return {...plan,
                description: plan.description ?? '',
                price: plan.price.toNumber() ?? null,
                priceMonthly: plan.priceMonthly.toNumber() ?? null,
                priceBianual: plan.priceBianual?.toNumber() ?? null,
                priceYearly: plan.priceYearly?.toNumber() ?? null,
                planPreferences: planPreferences ?? []
            };
    } catch(e) {
        console.log(e);
    }
}
