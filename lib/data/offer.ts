'use server';
import prisma from "@/app/lib/prisma/prisma";
import { Company, EncoderType, LocationDTO, Offer, OfferDTO, OfferPreferences, OfferPreferencesDTO, OfferSlimDTO, Prisma, PrismaClient, Subscription, SubscriptionDTO } from "@prisma/client";
import { createLocation, getLocationByFilter, getLocationById, LocationFilter } from "./location";
import { getSubscriptionByUserIdAndActive } from "./subscriptions";
import { getEncoderTypeByNameIn } from "./encoderType";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { getCompanyByUserId, getCompanySlimByUserId } from "./company";
import { stringYESNOToBoolean } from "../utils";
import { EncoderTypeEnum } from "../enums";
import { findManyOfferPreferencesByOfferIdIn } from "./offerPreferences";
import { FilterOffersDTO } from "@/app/ui/offers/OffersGeneralComponent";
import { CompanyDTO, OfferSearchResponse } from "../definitions";
import { OfferCustomDTO } from "@prisma/client";

type Response = {
  status: 'OK' | 'KO' | 'WARN';
  message: string;
}

//POST
export async function createOffer(data: OfferDTO, userId: string): Promise<Response> {
    const transaction = prisma.$transaction(async (prisma) => {
      try {
        const response: Response = {
          status: 'OK',
          message: 'Oferta creada correctamente'
        }

        const [locationSaved, subscriptionResult] = await Promise.all([
          createLocation({
            ...data.location,
            countryId: parseInt(data.location.countryId.toString()),
            latitude: 0,
            longitude: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
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
    
        const offerObject: OfferSlimDTO = {
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
        await createOfferPreferences(data, offer.id, prisma as PrismaClient);
        
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
      
      const locationData: LocationDTO = {
        ...data.location,
        countryId: parseInt(data.location.countryId.toString()),
        latitude: 0,
        longitude: 0,
        updatedAt: new Date(),
        createdAt: new Date(),
      }
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
        location: location,
        company: companyResult,
        subscription: subscriptionResult,
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
export async function getOffersByUserId(userId: string): Promise<OfferDTO[]> {
  try {
    const offers = await prisma.offer.findMany({
      where: {
      userId: userId
      },
      include: {
      Location: true
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
    const offerIds = offers.map((o) => o.id);

    const preferences = await findManyOfferPreferencesByOfferIdIn(offerIds);
    const company = await getCompanyByUserId(userId);
    const subscription = await getSubscriptionByUserIdAndActive(userId);

    const filterEncoderOption = (offerId: number, type: string) => preferences.filter((pref) => pref.offerId == offerId && pref.type == type);

    const offerResult: OfferDTO[] = await Promise.all(offers.map(async (offer) => {
      if (!subscription) {
        return {} as OfferDTO;
      }
      const location = await getLocationById(offer.locationId) ?? {} as LocationDTO;
      return {
        ...offer,
        employmentType: filterEncoderOption(offer.id, EncoderTypeEnum.EMPLOYEE_TYPE).map((ep) => ep.encoderType),
        workRange: filterEncoderOption(offer.id, EncoderTypeEnum.WORK_SCOPE).map((wrp) => wrp.encoderType),
        licenseType: filterEncoderOption(offer.id, EncoderTypeEnum.CARNET).map((lp) => lp.encoderType),
        licenseAdr: filterEncoderOption(offer.id, EncoderTypeEnum.CARNET_ADR).map((lp) => lp.encoderType),
        experience: filterEncoderOption(offer.id, EncoderTypeEnum.EXPERIENCE).map((lp) => lp.encoderType).at(0) ?? {} as EncoderType,
        location: location,
        company: company,
        subscription: subscription,
      };
    }));
    return offerResult.filter((o) => o.id !== undefined);
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
      include: {
        Location: true
      }
    });

    if(!offer) {
      return null;
    }

    const offerResult = await generateOffers([offer]);
    return offerResult[0];
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
        "sub"."planId" as "planId",
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

export async function getAllOffersPageable(page?: number, pageSize?: number): Promise<{ offers: OfferDTO[], total: number }> {
  try {
    if(!page) page = 1;
    if (!pageSize) pageSize = 10;
    const [offers, total] = await prisma.$transaction([
      prisma.offer.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          Location: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }),
      prisma.offer.count()
    ]);

    if (!offers) {
      return { offers: [], total: 0 };
    }
    const offerResult  = await generateOffers(offers);

    return { offers: offerResult.filter((o) => o.id !== undefined), total };
  } catch (error) {
    console.log(error);
    return { offers: [], total: 0 };
  }
}

export async function getAllOffersPageableByFilter(page: number = 1, pageSize: number = 10, data: FilterOffersDTO): Promise<OfferSearchResponse> {
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
          "sub"."planId" as "planId",
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
    const filter: FilterOffersDTO = {
      contractType: null,
      country: null,
      state: null,
      licenseType: null,
      adrType: null,
      workRange: null,
      isFeatured: null,
      experience: null,
      isAnonymous: null,
      allOffers: null
    }
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
async function generateSlimOfferDTO(offers: OfferCustomDTO[]): Promise<OfferDTO[]> {
  try { 
    const offerIds = offers.map((o) => o.id);
    const preferences = await findManyOfferPreferencesByOfferIdIn(offerIds);
    const filterEncoderOption = (offerId: number, type: string) => preferences.filter((pref) => pref.offerId == offerId && pref.type == type);
    const offerResult: OfferDTO[] = await Promise.all(offers.map(async (offer) => {
      const company: Partial<CompanyDTO> | undefined = await getCompanySlimByUserId(offer.userId);
      const result : OfferDTO = {
        ...offer,
        licenseType: filterEncoderOption(offer.id, EncoderTypeEnum.CARNET).map((lp) => lp.encoderType),
        endDate: offer.endDate,
        isFeatured: offer.isFeatured,
        company: {
          name: company?.name ?? '',
          assetUrl: company?.assetUrl ?? '',
        } as CompanyDTO,
        subscription: {
          planId: offer.planId,
          status: offer.subStatus ?? ''
        } as SubscriptionDTO,
        location: {
          state: offer.locationState
        } as LocationDTO
      };
      return result;
    }));
    return offerResult;
  } catch (err) {
    console.error(err);
    return [];
  }
}




async function generateOffers(offers: Offer[]): Promise<OfferDTO[]> {
  const offerIds = offers.map((o) => o.id);
  const preferences = await findManyOfferPreferencesByOfferIdIn(offerIds);

  const filterEncoderOption = (offerId: number, type: string) => preferences.filter((pref) => pref.offerId == offerId && pref.type == type);

  const offerResult: OfferDTO[] = await Promise.all(offers.map(async (offer) => {
    const location = await getLocationById(offer.locationId) ?? {} as LocationDTO;
    const company = await getCompanyByUserId(offer.userId);
    const subscription = await getSubscriptionByUserIdAndActive(offer.userId);

    return {
      ...offer,
      employmentType: filterEncoderOption(offer.id, EncoderTypeEnum.EMPLOYEE_TYPE).map((ep) => ep.encoderType),
      workRange: filterEncoderOption(offer.id, EncoderTypeEnum.WORK_SCOPE).map((wrp) => wrp.encoderType),
      licenseType: filterEncoderOption(offer.id, EncoderTypeEnum.CARNET).map((lp) => lp.encoderType),
      licenseAdr: filterEncoderOption(offer.id, EncoderTypeEnum.CARNET_ADR).map((lp) => lp.encoderType),
      experience: filterEncoderOption(offer.id, EncoderTypeEnum.EXPERIENCE).map((lp) => lp.encoderType).at(0) ?? {} as EncoderType,
      location: location,
      company: company,
      subscription: subscription ?? {} as any,
    };
  }));

  return offerResult;
}

const generateFilterClausure = (data: FilterOffersDTO) => {
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
          AND "pref"."type" = 'EMPLOYEE_TYPE'
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