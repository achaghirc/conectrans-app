import prisma from "@/app/lib/prisma/prisma";
import { OfferPreferencesDTO } from "@prisma/client";

export async function findManyOfferPreferencesByOfferIdIn(offerIds: number[]): Promise<OfferPreferencesDTO[]> {
  try {
    const preferences = await prisma.offerPreferences.findMany(
      {
        where: {
          offerId: {
            in: offerIds
          }
        },
        include: {
          EncoderType: true
        }
      }
    );
    if(!preferences) {
      throw new Error('Offer preferences not found');
    }
    
    const result: OfferPreferencesDTO[] = preferences.map(preference => {
      return {
        id: preference.id,
        offerId: preference.offerId,
        encoderTypeId: preference.encoderTypeId,
        encoderType: preference.EncoderType,
        type: preference.EncoderType.type,
      }
    });
    return result;
  } catch (error) {
    if(error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error finding offer preferences');
  }
}
export async function findManyOfferPreferencesByType(type: string): Promise<OfferPreferencesDTO[]> {
  try {
    const preferences = await prisma.offerPreferences.findMany(
      {
        where: {
          type: type
        },
        include: {
          EncoderType: true
        }
      }
    );
    if(!preferences) {
      throw new Error('Offer preferences not found');
    }
    
    const result: OfferPreferencesDTO[] = preferences.map(preference => {
      return {
        id: preference.id,
        offerId: preference.offerId,
        encoderTypeId: preference.encoderTypeId,
        encoderType: preference.EncoderType,
        type: preference.EncoderType.type,
      }
    });
    return result;
  } catch (error) {
    if(error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error finding offer preferences');
  }
}