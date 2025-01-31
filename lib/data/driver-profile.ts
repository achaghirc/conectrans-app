'use server';
import prisma from "@/app/lib/prisma/prisma";
import { DriverProfile } from "@prisma/client";
import { getPersonByUserId, getPersonIdByUserId } from "./person";
import { getDriverLicenceByUserId } from "./driver-licence";
import { getDriverPreferencesByUserId } from "./preferences";
import { getExperiencesByUserId } from "./experiences";
import { getEducationDataByUserId } from "./education";
import { getPersonLanguageByUserId } from "./languaje";

export async function getDriverProfileByUserId(userId: string): Promise<DriverProfile | undefined> {
  try {
    const personId = await getPersonIdByUserId(userId);
    if (!personId) {
      throw new Error('Person not found');
    }
    const driverProfile = await prisma.driverProfile.findFirst({
      where: {
        personId: personId
      }
    });
    if (!driverProfile) {
      return undefined;
    }
    return driverProfile;
  } catch (error) {
    console.error(error);
    throw new Error('Error getting driver profile');
  }
}
const driverProfileIdCache = new Map<string, number>(); // A simple cache

export async function getDriverProfileIdByUserId(userId: string): Promise<number | undefined> {
  try {
    if (driverProfileIdCache.has(userId)) {
      return driverProfileIdCache.get(userId); // Return cached value
    }
    const personId = await getPersonIdByUserId(userId);
    if (!personId) {
      throw new Error('Person not found');
    }
    const driverProfile = await prisma.driverProfile.findFirst({
      where: {
        personId: personId
      },
      select: {
        id: true
      }
    });
    if (!driverProfile?.id) {
      return undefined;
    }
    driverProfileIdCache.set(userId, driverProfile.id); // Store result in cache
    return driverProfile.id;
  } catch (error) {
    console.error(error);
    throw new Error('Error getting driver profile id');
  }
}

export async function updateDriverProfile(driverProfile: DriverProfile): Promise<void> {
  try {
    await prisma.driverProfile.update({
      where: {
        id: driverProfile.id
      },
      data: driverProfile
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error updating driver profile');
  }
}



export async function getDriverProfileData(userId: string) {
  const [ preferences, educations, languajes ] = await Promise.all([
    getDriverPreferencesByUserId(userId),
    getEducationDataByUserId(userId),
    getPersonLanguageByUserId(userId)
  ]);
  return { preferences, educations, languajes };
}