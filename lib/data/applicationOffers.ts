'use server';
import prisma from "@/app/lib/prisma/prisma";
import { ApplicationOffer, ApplicationOfferDTO } from "@prisma/client";

export async function getApplicationCountByPersonId(personId: number) : Promise<number> {
  try {
    const applications = await prisma.applicationOffer.count({
      where: {
        personId: personId
      }
    });
    return applications;
  } catch (error: any) {
    throw new Error('Error getting applications ' + error.message);
  }
}

export async function getApplicationOffersPageableByPersonId(personId: number, page?: number, limit?: number) : Promise<ApplicationOfferDTO[]> {
  try {
    if (!page ) page = 1;
    if (!limit) limit = 10;
    const applications = await prisma.applicationOffer.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        personId: personId
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
        Offer: {
          select: {
            id: true,
            title: true,
            endDate: true,
            Location: {
              select: {
                state: true,
                city: true
              }
            },
            OfferPreferences: {
              select: {
                EncoderType: {
                  select: {
                    name: true,
                    code: true
                  }
                },
                type: true
              }
            },
            User: {
              select: {
                Company: {
                  select: {
                    name: true,
                    Asset: {
                      select: {
                        url: true
                      }
                    }
                  }
                }
              }
            }
          },
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
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