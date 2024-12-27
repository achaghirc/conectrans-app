'use server';
import prisma from "@/app/lib/prisma/prisma";
import { LocationDTO, OfferDTO, OfferSlimDTO, PrismaClient } from "@prisma/client";
import { createLocation, getLocationById } from "./location";
import { getSubscriptionByUserIdAndActive } from "./subscriptions";
import { getEncoderTypeByNameIn } from "./encoderType";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { getCompanyByUserId } from "./company";

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
          isAnonymous: isAnonymous == 'YES' ? true : false,
          contractType: data.contractType,
          locationId: locationSaved.id,
          subscriptionId: subscriptionResult.id,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          capCertification: capCertification == 'YES' ? true : false, 
          digitalTachograph: digitalTachograph == 'YES' ? true : false,
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
function flattenArray(data: any[]): string[] {
  return data.flat();
}
export async function createOfferPreferences(data: OfferDTO, offerId: number, prisma: PrismaClient) {
  try {
    const { employmentType, workRange, licenseType, licenseAdr } = data;

    // Flatten and extract names for each type
    const employmentTypeNames = flattenArray(employmentType);
    const workRangeNames = flattenArray(workRange);
    const licenseTypeNames = flattenArray(licenseType);
    const licenseAdrNames = flattenArray(licenseAdr);

    const allNames = [...employmentTypeNames, ...workRangeNames, ...licenseTypeNames, ...licenseAdrNames];
    
    // Fetch encoder types by their names
    const encoders = await getEncoderTypeByNameIn(allNames);
    if (!encoders || encoders.length === 0) {
      throw new Error('No encoders found for the provided names.');
    }
    // Filter encoders by type
    const mapEncodersByType = (names: string[]) => encoders.filter((e) => names.includes(e.name));

    const employmentTypeEncoders = mapEncodersByType(employmentTypeNames);
    const workRangeEncoders = mapEncodersByType(workRangeNames);
    const licenseTypeEncoders = mapEncodersByType([...licenseTypeNames, ...licenseAdrNames]);

    // Create payloads for insertion
    const employmentPreferencesPayload = employmentTypeEncoders.map((encoder) => ({
      employmentTypeId: encoder.id,
      offerId,
    }));

    const workRangePreferencesPayload = workRangeEncoders.map((encoder) => ({
      workScopeId: encoder.id,
      offerId,
    }));

    const licensePreferencesPayload = licenseTypeEncoders.map((encoder) => ({
      licenceTypeId: encoder.id,
      offerId,
    }));

    // Save all preferences to the database
    const [employmentResult, workRangeResult, licenseResult] = await Promise.allSettled([
      prisma.offerEmploymentPreferences.createManyAndReturn({ data: employmentPreferencesPayload }),
      prisma.offerWorkRangePreferences.createMany({ data: workRangePreferencesPayload }),
      prisma.offerLicencePreferences.createMany({ data: licensePreferencesPayload }),
    ]);
    
    // Check for rejected operations
    const hasErrors =
      employmentResult.status === 'rejected' ||
      workRangeResult.status === 'rejected' ||
      licenseResult.status === 'rejected';

    if (hasErrors) {
      console.error('Error saving preferences:', {
        employmentError: employmentResult.status === 'rejected' ? employmentResult.reason : null,
        workRangeError: workRangeResult.status === 'rejected' ? workRangeResult.reason : null,
        licenseError: licenseResult.status === 'rejected' ? licenseResult.reason : null,
      });
      throw new Error('Failed to save one or more preference types.');
    }

    // Return saved preferences
    return {
      employmentPreferencesSaved: employmentResult.value,
      workRangePreferencesSaved: workRangeResult.value,
      licensePreferencesSaved: licenseResult.value,
    };
  } catch (error) {
    console.log(error);
    return undefined;
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
      }
    });

    if(!offers) {
      return [];
    }
    const offerIds = offers.map((o) => o.id);

    const [employmentPreferences, workRangePreferences, licensePreferences] = await Promise.all([
      prisma.offerEmploymentPreferences.findMany({
        where: { offerId: { in: offerIds } },
        include: { EncoderType: true }
      }),
      prisma.offerWorkRangePreferences.findMany({
        where: { offerId: { in: offerIds } },
        include: { EncoderType: true }
      }),
      prisma.offerLicencePreferences.findMany({
        where: { offerId: { in: offerIds } },
        include: { EncoderType: true }
      })
    ]);

    const company = await getCompanyByUserId(userId);
    const subscription = await getSubscriptionByUserIdAndActive(userId);

    const offerResult: OfferDTO[] = await Promise.all(offers.map(async (offer) => {
      if (!subscription) {
        return {} as OfferDTO;
      }
      const location = await getLocationById(offer.locationId) ?? {} as LocationDTO;
      return {
        ...offer,
        employmentType: employmentPreferences.filter((ep) => ep.offerId === offer.id).map((ep) => ep.EncoderType),
        workRange: workRangePreferences.filter((wrp) => wrp.offerId === offer.id).map((wrp) => wrp.EncoderType),
        licenseType: licensePreferences.filter((lp) => lp.offerId === offer.id).map((lp) => lp.EncoderType).filter((lp) => lp.type === 'CARNET'),
        licenseAdr: licensePreferences.filter((lp) => lp.offerId === offer.id).map((lp) => lp.EncoderType).filter((lp) => lp.type === 'CARNET_ADR'),
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

    const [employmentPreferences, workRangePreferences, licensePreferences] = await Promise.all([
      prisma.offerEmploymentPreferences.findMany({
        where: { offerId: offer.id },
        include: { EncoderType: true }
      }),
      prisma.offerWorkRangePreferences.findMany({
        where: { offerId: offer.id },
        include: { EncoderType: true }
      }),
      prisma.offerLicencePreferences.findMany({
        where: { offerId: offer.id },
        include: { EncoderType: true }
      })
    ]);

    const company = await getCompanyByUserId(offer.userId);
    const subscription = await getSubscriptionByUserIdAndActive(offer.userId);
    if (!subscription) {
      return null;
    }
    const location = await getLocationById(offer.locationId) ?? {} as LocationDTO;

    return {
      ...offer,
      employmentType: employmentPreferences.map((ep) => ep.EncoderType),
      workRange: workRangePreferences.map((wrp) => wrp.EncoderType),
      licenseType: licensePreferences.map((lp) => lp.EncoderType).filter((lp) => lp.type === 'CARNET'),
      licenseAdr: licensePreferences.map((lp) => lp.EncoderType).filter((lp) => lp.type === 'CARNET_ADR'),
      location: location,
      company: company,
      subscription: subscription,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}