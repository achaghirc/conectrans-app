'use server';

import prisma from "@/app/lib/prisma/prisma";
import { PlanPreference } from "../definitions";
import { EncoderType, Plan, PlanDTO, PlanPreferences } from "@prisma/client";
import { getEncoderTypeByIdsIn } from "./encoderType";
import { Decimal } from "@prisma/client/runtime/library";
import { convertDecimalToNumber } from "../utils";



export async function getAllPlans(): Promise<PlanDTO[] | undefined> {
    try {
        const plans =  await prisma.plan.findMany({
            orderBy: {
                price: 'asc'
            },
            include: {
                PlanPreferences: {
                    include: {
                      preferencePlanEncType: true
                    }
                }
            }
        });
        const plansWithPreferences = await Promise.all(plans.map(async (plan) => {
            return buildPlanDTO(plan);
        }));
        return plansWithPreferences;
    }catch(e) {
        console.log(e);
    }
}

export async function getPlanById(id: number): Promise<PlanDTO | undefined> {
    try {
        const plan = await prisma.plan.findFirst({
            where: {
                id: id,
            },
            include: {
                PlanPreferences: {
                    include: {
                      preferencePlanEncType: true
                    }
                }
            }
        });
        if (!plan) return undefined;
      
        return await buildPlanDTO(plan);
    } catch(e) {
        console.log(e);
    }
}

export async function getPlanByTitle(title: string): Promise<PlanDTO | undefined> {
    try {
        const plan = await prisma.plan.findFirst({
            where: {
                title: title
            },
        });
        if (!plan) return undefined;
        return await buildPlanDTO(plan);
    } catch(e) {
        console.log(e);
    }
}

export async function buildPlanDTO(plan: Plan): Promise<PlanDTO> {
  const price = await convertDecimalToNumber(plan.price);
  const priceMonthly = await convertDecimalToNumber(plan.priceMonthly);
  const priceBianual = await convertDecimalToNumber(plan.priceBianual);
  const priceYearly = await convertDecimalToNumber(plan.priceYearly);
  return {...plan,
    description: plan.description ?? '',
    price: price,
    priceMonthly: priceMonthly,
    priceBianual: priceBianual,
    priceYearly: priceYearly,
  } as PlanDTO;    

}