'use server';
import prisma from "@/app/lib/prisma/prisma";
import { buildPlanDTO, getPlanById, getPlanByTitle } from "./plan";
import { Plan, PlanDTO, Subscription } from "@prisma/client";
import { SubscriptionDTO } from "@prisma/client";
import { convertDecimalToNumber } from "../utils";

export async function getSubscriptionByUserIdAndActive(userId: string): Promise<SubscriptionDTO | undefined> {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: userId,
                status: 'active'
            },
            include: {
                Plan: true
            }
        });
        if (!subscription) return assignPlanToUser(userId);
        const plan: PlanDTO = await buildPlanDTO(subscription.Plan, []);
        return {
          ...subscription,
          Plan: plan
        };
    } catch(e) {
        console.log(e);
    }
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

export async function assignPlanToUser(userId: string, planId?: number): Promise<SubscriptionDTO | undefined> {
    try {
        const hasSubscription = await hasAlreadyASubscription(userId);
        let plan = null;
        if (!planId && !hasSubscription) {
            plan = await getPlanByTitle('Gratuito');
        } else {
            plan = await getPlanById(planId ?? 0);
        }
        const startDate: Date = new Date();
        const endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        if(plan == undefined) {
          return;
        }
        const subscription = await prisma.subscription.create({
            data: {
                userId: userId,
                planId: plan.id ?? 22,
                status: 'active',
                startDate: startDate,
                endDate: endDate, 
                updatedAt: new Date(),
            },
            include: {
                Plan: true
            }
        });
        const planDTO: PlanDTO = await buildPlanDTO(subscription.Plan, []);
        return {
          ...subscription,
          Plan: planDTO
        };
    } catch(e) {
        console.log(e);
    }
}
