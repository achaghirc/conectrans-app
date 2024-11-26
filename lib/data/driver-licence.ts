'use server';
import prisma from "@/app/lib/prisma/prisma";
import { DriverLicence, DriverLicenceDTO, EncoderType } from "@prisma/client";
import { getDriverProfileByUserId } from "./driver-profile";
import { DriverLicenceProfileDTO } from "../definitions";

export async function getDriverLicenceByDriverProfileId(userId: string): Promise<DriverLicenceProfileDTO | undefined> {

  try {
    const driverProfile = await getDriverProfileByUserId(userId);
    if (!driverProfile) {
      throw new Error('Driver profile not found');
    }
    const driverLicences = await prisma.driverLicence.findMany({
      where: {
        driverProfileId: driverProfile.id
      },
      include: {
        LicenceType: true,
        Country: true
      }
    });
    if (!driverLicences) {
      return undefined;
    }
    const licences: DriverLicenceDTO[] = driverLicences.map((driverLicence) => {
      return {
        ...driverLicence,
        LicenceType: driverLicence.LicenceType!,
        Country: driverLicence.Country!,
      }
    })
    
    const res: DriverLicenceProfileDTO = {
      driverProfileId: driverProfile.id,
      personId: driverProfile.personId,
      licences: licences,
      hasCapCertificate: driverProfile.hasCapCertification,
      hasDigitalTachograph: driverProfile.hasDigitalTachograph
    }
    return res;
  } catch (error) {
    console.error(error);
    throw new Error('Error getting driver licences');
  }
}

export async function updateDriverLicences(licencesSave:DriverLicenceDTO[], licencesDelete:DriverLicenceDTO[] ): Promise<void> {
  try {
    const deleteLicences = licencesDelete.map((licence) => {
      return prisma.driverLicence.delete({
        where: {
          id: licence.id
        }
      });
    });
    const saveLicences = licencesSave.map((licence) => {
      if (licence.id) {
        return prisma.driverLicence.update({
          where: {
            id: licence.id
          },
          data: {
            licenceTypeId: licence.licenceTypeId,
            countryId: licence.countryId
          }
        });
      } else {
        return prisma.driverLicence.create({
          data: {
            driverProfileId: licence.driverProfileId,
            licenceTypeId: licence.licenceTypeId,
            countryId: licence.countryId
          }
        });
      }
    });
    await prisma.$transaction([...deleteLicences, ...saveLicences]);
  } catch (error) {
    console.error(error);
    throw new Error('Error updating driver licences');
  } 
}