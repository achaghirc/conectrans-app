'use server';
import prisma from "@/app/lib/prisma/prisma";
import { Company, EncoderType, Location, LocationDTO, Offer, OfferDTO, OfferPreferences, OfferPreferencesDTO, OfferSlimDTO, Prisma, PrismaClient, Subscription, SubscriptionDTO, Transaction } from "@prisma/client";
import { createLocation, getLocationByFilter, getLocationById, LocationFilter } from "./location";
import { getSubscriptionByUserIdAndActive, updateSubscriptionAfterNewOffer } from "./subscriptions";
import { getEncoderTypeByNameIn } from "./encoderType";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { getCompanyByUserId, getCompanySlimByUserId } from "./company";
import { stringYESNOToBoolean } from "../utils";
import { EncoderTypeEnum } from "../enums";
import { findManyOfferPreferencesByOfferIdIn } from "./offerPreferences";
import { CompanyDTO, FilterOffersDTO, OfferSearchResponse } from "../definitions";
import { OfferCustomDTO } from "@prisma/client";
import { url } from "inspector";

type Response = {
  status: 'OK' | 'KO' | 'WARN';
  message: string;
}

//POST
export async function createOffer(data: OfferDTO, userId: string): Promise<Response> {
  const response: Response = {
    status: 'OK',
    message: 'Oferta creada correctamente'
  };
  const transaction = prisma.$transaction(async (prisma) => {
    try {

      const [locationSaved, subscriptionResult] = await Promise.all([
        createLocation({
          ...data.Location,
          countryId: parseInt(data.Location.countryId?.toString() ?? '64'),
          latitude: 0,
          longitude: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Location),
        getSubscriptionByUserIdAndActive(userId)
      ]);

      if (!locationSaved) {
        response.status = 'KO';
        response.message = 'No se ha podido crear la ubicación';
        return response;
      }
      if (!subscriptionResult) {
        response.status = 'KO';
        response.message = 'No se ha podido encontrar la suscripción';
        return response;
      }
  
      const capCertification = data.capCertification as unknown as string;
      const digitalTachograph = data.digitalTachograph as unknown as string;
      const isAnonymous = data.isAnonymous as unknown as string;
  
      const offerObject = {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        salary: data.salary,
        isAnonymous: await stringYESNOToBoolean(isAnonymous),
        isFeatured: data.isFeatured,
        contractType: data.contractType,
        locationId: locationSaved.id,
        subscriptionId: subscriptionResult.id,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        capCertification: await stringYESNOToBoolean(capCertification),
        digitalTachograph: await stringYESNOToBoolean(digitalTachograph),
        workDay: data.workDay.toString(),
      };
      const offer = await prisma.offer.create({
        data: offerObject
      });
  
      if (!offer) {
        response.status = 'KO';
        response.message = 'No se ha podido crear la oferta';
        return response;
      }
      Promise.all([
        await createOfferPreferences(data, offer.id, prisma as PrismaClient),
      ])
      //A trigger function updates automatically the subscription after a new offer is created decreasing the remaining offers by 1
      return response;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        if (error.message.includes('P0001')) {
          return {
            status: 'WARN',
            message: 'Máximo de ofertas permitidas por la subscripción alcanzadas, por favor actualiza tu plan para poder crear más ofertas.'
          } as Response;
        }
      }
        return {
        status: 'KO',
        message: 'Error al crear la oferta, por favor inténtalo de nuevo.'
      } as Response;
    }
  } ,
  {
    maxWait: 5000, // default: 2000
    timeout: 10000, // default: 5000);
  });
  return transaction;
}

function flattenArray(data: any[] | undefined): string[] {
  if (!data) return [];
  return data.flat();
}

export async function createOfferPreferences(data: OfferDTO, offerId: number, prisma: PrismaClient) {
  try {
    const { employmentType, workRange, licenseType, licenseAdr, experience } = data;

    // Flatten and extract names for each type
    const employmentTypeNames = flattenArray(employmentType);
    const workRangeNames = flattenArray(workRange);
    const licenseTypeNames = flattenArray(licenseType);
    const licenseAdrNames = flattenArray(licenseAdr);
    

    const allNames: string[] = [...employmentTypeNames, ...workRangeNames, ...licenseTypeNames, ...licenseAdrNames];
    allNames.push(experience!.toString());
    
    // Fetch encoder types by their names
    const encoders = await getEncodersByNames(allNames);

    // Create payloads for insertion
    const offerPreferences = encoders.map((encoder) => ({
      encoderTypeId: encoder.id,
      offerId,
      type: encoder.type
    }));


    // Save all preferences to the database
    const [offerPreferencesResult] = await Promise.allSettled([
      prisma.offerPreferences.createManyAndReturn({ data: offerPreferences }),
    ]);
    
    // Check for rejected operations
    const hasErrors =
    offerPreferencesResult.status === 'rejected';
    if (hasErrors) {
      console.error('Error saving preferences:', {
        employmentError: offerPreferencesResult.status === 'rejected' ? offerPreferencesResult.reason : null,
       });
      throw new Error('Failed to save one or more preference types.');
    }

    // Return saved preferences
    return {
      offerPreferences: offerPreferencesResult.status === 'fulfilled' ? offerPreferencesResult.value : [],
    };
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function updateOfferPreferences(data: OfferDTO): Promise<void> {
  try {
    const offerId: number = parseInt(data.id as unknown as string);
    const { employmentType, workRange, licenseType, licenseAdr, experience } = data;
    
    const actualPreferences = await findManyOfferPreferencesByOfferIdIn([offerId]);

    // Flatten and extract names for each type
    const employmentTypeNames = flattenArray(employmentType);
    const workRangeNames = flattenArray(workRange);
    const licenseTypeNames = flattenArray(licenseType);
    const licenseAdrNames = flattenArray(licenseAdr);

    const allNames = [...employmentTypeNames, ...workRangeNames, ...licenseTypeNames, ...licenseAdrNames];
    allNames.push(experience!.toString());

    const distinctToRemovePreferences = actualPreferences.filter((preference) => {
      return !allNames.some((name) => name === preference.encoderType.name);
    });
    const idsToRemove = distinctToRemovePreferences.map((pref) => pref.id).filter((id) => id != undefined);
    
    // Fetch encoder types by their names
    const encoders = await getEncodersByNames(allNames);
    const distinctPreferences = encoders.filter((preference) => {
      return !actualPreferences.some((actualPref) => actualPref.encoderType.code == preference.code);
    })
    
    const employmentPreferencesPayload = distinctPreferences.map((encoder) => ({
      offerId: offerId,
      encoderTypeId: encoder.id,
      type: encoder.type,
    }));

    const [employmentDeleteResult, employmentResult ] = await Promise.allSettled([
      prisma.offerPreferences.deleteMany({ where: {
        id: {
          in: idsToRemove
        }
      }}),
      prisma.offerPreferences.createManyAndReturn({ data: employmentPreferencesPayload }),
    ]);
  
    if (employmentDeleteResult.status === 'rejected') {
      console.log('ERROR DELETING PREFERENCES.');
    }
    if (employmentResult.status === 'rejected') {
      console.log('ERROR UPDATING PREFERENCES.')
    }
  } catch (err) {
    throw err;
  }
}

export async function editOffer(data: OfferDTO): Promise<OfferDTO | null> {
  try {
    const transaction = prisma.$transaction(async (prisma) => {
      const offerId: number = parseInt(data.id as unknown as string);
      
      const locationData = {
        ...data.Location,
        number: data.Location.number ?? '',
        countryId: parseInt(data.Location.countryId!.toString()),
        latitude: 0,
        longitude: 0,
        updatedAt: new Date(),
        createdAt: new Date(),
      } as Location
      const location = await createLocation(locationData);
      if (!location) {
        return null;
      }
      const updatedOffer = await prisma.offer.update({
        where: {
          id: offerId,
        },
        data: 
          {
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            salary: data.salary,
            contractType: data.contractType,
            locationId: location.id,
            updatedAt: new Date(),
            capCertification: await stringYESNOToBoolean(data.capCertification as unknown as string),
            digitalTachograph: await stringYESNOToBoolean(data.digitalTachograph as unknown as string),
            workDay: data.workDay,
            isAnonymous: data.isAnonymous,
            isFeatured: data.isFeatured,
          },
        include: {
          OfferPreferences: {
            select: {
              id: true,
              EncoderType: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  type: true
                }
              },
              type: true,
              offerId: true
            }
          },
          Location: {
            select: {
              Country: {
                select: {
                  id: true,
                  name_es: true,
                  cod_iso2: true
                }
              }
            }
          }
        }
      });
      if (!updatedOffer) {
        return updatedOffer;
      }
  
      await updateOfferPreferences(data);
      
      const [preferencesResult, companyResult, subscriptionResult] = await Promise.all([
        findManyOfferPreferencesByOfferIdIn([offerId]),
        getCompanyByUserId(updatedOffer.userId),
        getSubscriptionByUserIdAndActive(updatedOffer.userId)
      ]);
      
      if (!companyResult || !subscriptionResult || preferencesResult.length === 0) {
        return null;
      }
      const filterEncoderOption = (type: string) => preferencesResult.filter((pref) => pref.offerId == offerId && pref.type == type);
      
      return {
        ...updatedOffer,
        employmentType: filterEncoderOption(EncoderTypeEnum.EMPLOYEE_TYPE).map((ep) => ep.encoderType),
        workRange: filterEncoderOption(EncoderTypeEnum.WORK_SCOPE).map((wrp) => wrp.encoderType),
        licenseType: filterEncoderOption(EncoderTypeEnum.CARNET).map((lp) => lp.encoderType),
        licenseAdr: filterEncoderOption(EncoderTypeEnum.CARNET_ADR).map((lp) => lp.encoderType),
        User: {
          Company: {
            name: companyResult.name,
            Asset: {
              url: companyResult.assetUrl
            }
          },
        },
        Subscription: subscriptionResult,
      } as OfferDTO;
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
    })
    return transaction;
  } catch (error) { 
    console.log('Error actualizando la oferta, ', error)
    return null;
  }
}


//GET
export async function getOffersByUserPageable(page: number, limit: number, filter: Partial<FilterOffersDTO>): Promise<{ offers: OfferDTO[], total: number }> {

  try {
    const active = filter != undefined ? filter.active : true;
    const userId = filter.userId;
    if (!userId) {
      return { offers: [], total: 0 };
    }
    let where = {};
    if(active) {
      where = {
        userId: userId,
        endDate: {
          gte: new Date()
        }
      }
    } else {
      where = {
        userId: userId,
        endDate: {
          lt: new Date()
        }
      }
    }

    const offers = await prisma.offer.findMany({
      where: where,
      include: {
        Location: {
          select: {
            Country: {
              select: {
                id: true,
                name_es: true,
                cod_iso2: true
              }
            },
          countryId: true,
          street:true,
          number: true,
          zip: true,
          state: true,
          city: true
          }
        },
        OfferPreferences: {
          select: {
            id: true,
            offerId: true,
            EncoderType: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true
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
        },
        Subscription: {
          select: {
            status: true
          }
        },
        _count: {
          select: {
            ApplicationOffer: true
          }
        }
        },
        orderBy: [
          {
            isFeatured: 'desc'
          },
          {
            createdAt: 'desc'
          }
        ],
      skip: (page - 1) * limit,
      take: limit
    });

    if (!offers) {
      return { offers: [], total: 0 };
    }

    // const offerResult: OfferDTO[] = await offerSlimDTOToOfferDTO(offers);

    return { offers: offers, total: offers.length };
  } catch (error) {
    console.log(error);
    return { offers: [], total: 0 };
  }

}

// const offerSlimDTOToOfferDTO = async (offers: OfferSlimDTO[]): Promise<OfferDTO[]> => {
//   try {
    
//     await Promise.all(offers.map(async (offer) => {
//       const filterEncoderOption = (type: string) => offer.OfferPreferences.filter((pref) => pref.type == type);
//       const offer: OfferDTO = {
//         ...offer,
//         employmentType: filterEncoderOption(EncoderTypeEnum.EMPLOYEE_TYPE).map((ep) => ep.EncoderType),
//         workRange: filterEncoderOption(EncoderTypeEnum.WORK_SCOPE).map((wrp) => wrp.EncoderType),
//         licenseType: filterEncoderOption(EncoderTypeEnum.CARNET).map((lp) => lp.EncoderType),
//         licenseAdr: filterEncoderOption(EncoderTypeEnum.CARNET_ADR).map((lp) => lp.EncoderType),
//         experience: filterEncoderOption(EncoderTypeEnum.EXPERIENCE).map((lp) => lp.EncoderType).at(0) ?? {} as EncoderType,
//         location: location,
//         company: company,
//         subscription: subscription,
    
//     }));
//   }
// }

export async function getOffersByUserId(userId: string): Promise<OfferDTO[]> {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        userId: userId
      },
      include: {
        Location: {
          include: {
            Country: 
            {
              select: {
                id: true,
                name_es: true,
                cod_iso2: true
              }
            }
          }
        },
        OfferPreferences: {
          select: {
            id: true,
            EncoderType: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true
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
      orderBy: [
      {
        isFeatured: 'desc'
      },
      {
        createdAt: 'desc'
      }
      ]
    });

    if(!offers) {
      return [];
    }
    return offers.filter((o) => o.id !== undefined);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getOfferById(offerId: number): Promise<OfferDTO | null> {
  try {
    const offer = await prisma.offer.findUnique({
      where: {
        id: offerId
      },
      include: {
        Location: {
          include: {
            Country: 
            {
              select: {
                id: true,
                name_es: true,
                cod_iso2: true
              }
            }
          }
        },
        OfferPreferences: {
          select: {
            id: true,
            EncoderType: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true
              }
            },
            type: true
          }
        },
        Subscription: {
          select: {
            status: true
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
      }
    });

    if(!offer) {
      return null;
    }

    return offer;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getOfferSlimCardById(offerId: number): Promise<OfferDTO | null> {
  try {
    const offer = await prisma.$queryRaw<OfferCustomDTO[]>(Prisma.sql`
      SELECT
        "Offer"."id" as "id",
        "Offer"."userId" as "userId",
        "Offer"."title" as "title",
        "loc"."state" as "locationState",
        "Offer"."endDate" as "endDate",
        "Offer"."isFeatured" as "isFeatured",
        "Offer"."isAnonymous" as "isAnonymous",
        "Offer"."createdAt" as "createdAt",
        "sub"."status" as "subStatus"
      FROM "Offer"
      INNER JOIN "Location" AS "loc" ON "Offer"."locationId" = "loc"."id"
      INNER JOIN "Subscription" AS "sub" ON "Offer"."subscriptionId" = "sub"."id"
      WHERE "Offer"."id" = ${offerId}
      ORDER BY "Offer"."isFeatured" DESC, "Offer"."createdAt" DESC
    `);
    if(!offer) {
      return null;
    }
    const offerResult = await generateSlimOfferDTO(offer);
    return offerResult[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}


async function getEncodersByNames(allNames: string[]){
  // Fetch encoder types by their names
  const encoders = await getEncoderTypeByNameIn(allNames);
  if (!encoders || encoders.length === 0) {
    throw new Error('No encoders found for the provided names.');
  }
  return encoders;
}

/**
 * @param page 
 * @param pageSize 
 * @param data 
 * @returns 
 */
export async function getAllOffersPageableByFilter(page: number = 1, pageSize: number = 10, data: Partial<FilterOffersDTO>): Promise<OfferSearchResponse> {
  try {
    //Generate where clauses
    const whereClause: Prisma.Sql = generateFilterClausure(data);
    
    const transaction = await prisma.$transaction(async (prisma) => {
      const offers = await prisma.$queryRaw<OfferCustomDTO[]>(Prisma.sql`
        SELECT
          "Offer"."id" as "id",
          "Offer"."userId" as "userId",
          "Offer"."title" as "title",
          "loc"."state" as "locationState",
          "Offer"."endDate" as "endDate",
          "Offer"."isFeatured" as "isFeatured",
          "Offer"."isAnonymous" as "isAnonymous",
          "Offer"."createdAt" as "createdAt",
          "sub"."status" as "subStatus"
        FROM "Offer"
        INNER JOIN "Location" AS "loc" ON "Offer"."locationId" = "loc"."id"
        INNER JOIN "Subscription" AS "sub" ON "Offer"."subscriptionId" = "sub"."id"
        ${whereClause}
        ORDER BY "Offer"."isFeatured" DESC, "Offer"."createdAt" DESC
        OFFSET ${(page - 1) * pageSize}
        LIMIT ${pageSize}
      `);
      const total: [{count:number | null}] = await prisma.$queryRaw<[{count:number | null}]>(Prisma.sql`
        SELECT COUNT(*) 
        FROM "Offer"
        INNER JOIN "Location" AS "loc" ON "Offer"."locationId" = "loc"."id"
        ${whereClause}
      `);
      return { offers, total: Number(total[0].count ?? 0) };
    });
    if (!transaction.offers) {
      return { offers: [], total: 0 };
    }
    const offerResult  = await generateSlimOfferDTO(transaction.offers);
    const totalOffers = transaction.total ?? 0;
    return { offers: offerResult.filter((o) => o.id !== undefined), total:Number(totalOffers) } as OfferSearchResponse;
  } catch (error) {
    console.log(error);
    return { offers: [], total: 0 };
  }
}

export async function getOffersPage(query: string) {
  try {
    const filter: Partial<FilterOffersDTO> = {};
    const whereClause = generateFilterClausure(filter)
    const count = await prisma.$queryRaw<number>(Prisma.sql`
      SELECT COUNT(*) 
      FROM "Offer"
      INNER JOIN "Location" AS "loc" ON "Offer"."locationId" = "loc"."id"
      ${whereClause}
    `)
    return count
  }catch (err) {
    throw err;
  }
}

// {
//   titulo: string,
//   companyName: string,
//   locationState: string,
//   licenseType: string,
//   endDate: Date,
//   isFeatured: boolean,
//   companyLogo: string,
// }
const mapUserIdCompany: Map<string, Partial<CompanyDTO>> = new Map();
async function generateSlimOfferDTO(offers: OfferCustomDTO[]): Promise<OfferDTO[]> {
  try { 
    const offerIds = offers.map((o) => o.id);
    const preferences = await findManyOfferPreferencesByOfferIdIn(offerIds);
    const filterEncoderOption = (offerId: number, type: string) => preferences.filter((pref) => pref.offerId == offerId && pref.type == type);
    const offerResult: OfferDTO[] = await Promise.all(offers.map(async (offer) => {
      let company: Partial<CompanyDTO> | undefined = mapUserIdCompany.get(offer.userId);
      if(!company) {
        company = await getCompanySlimByUserId(offer.userId);
        if(company) mapUserIdCompany.set(offer.userId, company);
      }
      const result : OfferDTO = {
        ...offer,
        licenseType: filterEncoderOption(offer.id, EncoderTypeEnum.CARNET).map((lp) => lp.encoderType),
        endDate: offer.endDate,
        isFeatured: offer.isFeatured,
        User: {
          Company: {
            name: company?.name ?? '',
            Asset: {
              url: company?.assetUrl ?? ''
            }
          }
        },
        Subscription: {
          status: offer.subStatus ?? ''
        } as SubscriptionDTO,
        OfferPreferences: preferences.filter((pref) => pref.offerId == offer.id).map((pref) => {
          return {
            id: pref.id ?? 0,
            offerId: pref.offerId,
            EncoderType: {
              id: pref.encoderType.id ?? 0,
              name: pref.encoderType.name,
              code: pref.encoderType.code,
              type: pref.encoderType.type
            },
            type: pref.type
          };
        }),
        Location: {
          state: offer.locationState,
          Country: null,
        }
      }
      return result;
    }));
    return offerResult;
  } catch (err) {
    console.error(err);
    return [];
  }
}


export async function countOffersAfterTransactionCreated(transactionId: number): Promise<number> {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId
    },
    select: {
      subscriptionId: true,
      createdAt: true
    }
  });
  if (!transaction) {
    return 0;
  }
  const count = await prisma.offer.count({
    where: {
      subscriptionId: transaction.subscriptionId,
      createdAt: {
        gte: transaction.createdAt
      }
    }
  })
  return count;
}


const generateFilterClausure = (data: Partial<FilterOffersDTO>) => {
  const filter = {
    ...data, 
    contractType: !data.contractType || data.contractType.length === 0 ? 'null' : data.contractType,
    country: data.country ? parseInt(data.country) : null,
    state: data.state ?? null,
    licenseType: !data.licenseType || data.licenseType.length === 0 ? 'null' : data.licenseType,
    adrType: !data.adrType || data.adrType.length === 0 ? 'null' : data.adrType,
    isFeatured: data.allOffers ? null : data.isFeatured,
    isAnonymous: data.allOffers ? null : data.isAnonymous, 
  }
  const whereClauses: Prisma.Sql[] = [];
  if (filter.id != null) {
    whereClauses.push(Prisma.sql`"Offer"."id" = ${filter.id}::int`);
  } else {
    if(filter.userId != null) {
      whereClauses.push(Prisma.sql`"Offer"."userId" = ${filter.userId}::text`);
    }
    if(filter.endDate != null) {
      whereClauses.push(Prisma.sql`"Offer"."endDate" <= ${filter.endDate}::date`);
    }
    if (filter.active != undefined){
      if (filter.active) {
        whereClauses.push(Prisma.sql`"Offer"."endDate" >= CURRENT_DATE`);
      } else {
        whereClauses.push(Prisma.sql`"Offer"."endDate" < CURRENT_DATE`);
      }
    }
    // Condición opcional para contractType
    if (data.contractType != null && data.contractType.length > 0) {
      whereClauses.push(Prisma.sql`
        EXISTS (
          SELECT 1 
          FROM "OfferPreferences" AS "pref"
          INNER JOIN "EncoderType" AS "et" ON "pref"."encoderTypeId" = "et"."id"
          WHERE "pref"."offerId" = "Offer"."id" 
          AND "pref"."type" = 'EMPLOYEE_TYPE'
          AND "et"."name" = ANY(${data.contractType}::text[])
        )
      `);
    }
    // Condición opcional para country
    if (filter.country) {
      whereClauses.push(Prisma.sql`"loc"."countryId" = ${filter.country}::int`);
    }
    // Condición opcional para state
    if (filter.state) {
      whereClauses.push(Prisma.sql`"loc"."state" = ${filter.state}::text`);
    }
    // Condición opcional para licenseType
    if (data.licenseType != null && data.licenseType.length > 0) {
      whereClauses.push(Prisma.sql`
        EXISTS (
          SELECT 1 
          FROM "OfferPreferences" AS "pref"
          INNER JOIN "EncoderType" AS "et" ON "pref"."encoderTypeId" = "et"."id"
          WHERE "pref"."offerId" = "Offer"."id" 
          AND "pref"."type" = 'CARNET'
          AND "et"."name" = ANY(${data.licenseType}::text[])
        )
      `);
    }
    if (data.adrType != null && data.adrType.length > 0) {
      whereClauses.push(Prisma.sql`
        EXISTS (
          SELECT 1 
          FROM "OfferPreferences" AS "pref"
          INNER JOIN "EncoderType" AS "et" ON "pref"."encoderTypeId" = "et"."id"
          WHERE "pref"."offerId" = "Offer"."id" 
          AND "pref"."type" = 'CARNET_ADR'
          AND "et"."name" = ANY(${data.adrType}::text[])
        )
      `);
    }
    if (data.workRange != null && data.workRange.length > 0) {
      whereClauses.push(Prisma.sql`
        EXISTS (
          SELECT 1 
          FROM "OfferPreferences" AS "pref"
          INNER JOIN "EncoderType" AS "et" ON "pref"."encoderTypeId" = "et"."id"
          WHERE "pref"."offerId" = "Offer"."id" 
          AND "pref"."type" = 'WORK_SCOPE'
          AND "et"."name" = ANY(${data.workRange}::text[])
        )
      `);
    }
    if (filter.isFeatured != null) {
      whereClauses.push(Prisma.sql`"Offer"."isFeatured" = ${filter.isFeatured}::boolean`);
    }
    if (filter.isAnonymous != null) {
      whereClauses.push(Prisma.sql`"Offer"."isAnonymous" = ${filter.isAnonymous}::boolean`);
    }
  }

  // Combinar todas las condiciones dinámicas en un solo Prisma.sql
  const whereClause = whereClauses.length > 0 
    ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
    : Prisma.sql``;
  return whereClause;
}