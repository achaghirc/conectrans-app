'use server';
import prisma from "@/app/lib/prisma/prisma"
import { Activity } from "../definitions";

export const getActitivies = async () : Promise<Activity[] | undefined> => {
    try{
        const activities = await prisma.activity.findMany();
        return activities;
    }catch(error) {
        throw new Error('Error getting activities');
    } 
}

export const getActitivieByCode = async (code: string) : Promise<Activity | null> => {
    try{
        const activity = await prisma.activity.findFirst({
            where: {
                code: code,
            }
        });
        return activity;
    }catch(error) {
        throw new Error('Error getting activity');
    } 
}