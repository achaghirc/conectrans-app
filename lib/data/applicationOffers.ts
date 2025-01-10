'use server';
import prisma from "@/app/lib/prisma/prisma";
import { ApplicationOffer, ApplicationOfferDTO } from "@prisma/client";


export async function getApplicationOffersByPersonId(personId: number) : Promise<ApplicationOfferDTO[]> {
  try {
    const applications = await prisma.applicationOffer.findMany({
      where: {
        personId: personId
      },
      include:{
        Offer: true,
      }
    });
    return applications;
  } catch (error: any) {
    throw new Error('Error getting applications ' + error.message);
  }
}

export async function createApplicationOffer(data: ApplicationOffer) : Promise<ApplicationOffer> {
  try {
    const application = {
      offerId: data.offerId,
      personId: data.personId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.status
    }
    const newApplication = await prisma.applicationOffer.create({
      data: application
    });
    return newApplication;
  } catch (error: any) {
    throw new Error('Error creating application ' + error.message);
  }
}

export async function existsApplicationOfferByPerson(personId: number, offerId: number) : Promise<boolean> {
  try {
    const application = await prisma.applicationOffer.findFirst({
      where: {
        personId: personId,
        offerId: offerId
      },
      select: {
        id: true
      }
    });
    return application !== null;
  } catch (error: any) {
    throw new Error('Error getting application ' + error.message);
  }
}