'use server';
import prisma from "@/app/lib/prisma/prisma";
import { DriverProfile } from "@prisma/client";
import { getPersonByUserId } from "./person";

export async function getDriverProfileByUserId(userId: string): Promise<DriverProfile | undefined> {
  try {
    const person = await getPersonByUserId(userId);
    if (!person) {
      throw new Error('Person not found');
    }
    const driverProfile = await prisma.driverProfile.findFirst({
      where: {
        personId: person.id
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