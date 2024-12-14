'use server';
import prisma from "@/app/lib/prisma/prisma";
import { getDriverProfileByUserId, getDriverProfileIdByUserId } from "./driver-profile";
import { DriverPreferencesDTO } from "../definitions";
import { DriverEmploymentPreferences, DriverEmploymentPreferencesDTO, DriverWorkRangePreferences, DriverWorkRangePreferencesDTO } from "@prisma/client";
import { getPersonIdByUserId } from "./person";

export async function getDriverPreferencesByUserId(userId:string) : Promise<DriverPreferencesDTO | undefined> {
  try {
    const personId = await getPersonIdByUserId(userId);
    const driverProfileId = await getDriverProfileIdByUserId(userId);
    if (!driverProfileId) {
      throw new Error('Driver profile not found');
    }

    const employmentPreferences = await prisma.driverEmploymentPreferences.findMany({
      where: {
        driverProfileId: driverProfileId
      },
      include: {
        EncoderType: true
      }
    });
    const workRangePreferences = await prisma.driverWorkRangePreferences.findMany({
      where: {
        driverProfileId: driverProfileId
      },
      include: {
        workScope: true
      }
    });

    if (!employmentPreferences || !workRangePreferences) {
      return undefined;
    }
    const workRangePreferencesDTO: DriverWorkRangePreferencesDTO[] = workRangePreferences.map((workRangePreference) => {
      return {
        ...workRangePreference,
        workScope: workRangePreference.workScope!
      }
    })
    const employmentPreferencesDTO: DriverEmploymentPreferencesDTO[] = employmentPreferences.map((employmentPreference) => {
      return {
        ...employmentPreference,
        EncoderType: employmentPreference.EncoderType!
      }
    });

    const driverPreferences: DriverPreferencesDTO = {
      driverProfileId: driverProfileId,
      userId: userId,
      personId: personId,
      workRanges: workRangePreferencesDTO,
      employeeTypes: employmentPreferencesDTO
    }

    return driverPreferences;
  }catch (error) {
    console.error(error);
    throw new Error('Error getting driver preferences');  
  }


  
}

export async function updateEmployeeTypes(employeeTypes: DriverEmploymentPreferencesDTO[], employeeTypesDelete: DriverEmploymentPreferencesDTO[]): Promise<void> {
  try {
    const deleteEmployeeTypes = employeeTypesDelete.map((employeeType) => {
      return prisma.driverEmploymentPreferences.delete({
        where: {
          id: employeeType.id
        }
      });
    });
    const saveEmployeeTypes = employeeTypes.map((employeeType) => {
      if (employeeType.id) {
        return prisma.driverEmploymentPreferences.update({
          where: {
            id: employeeType.id
          },
          data: {
            employmentTypeId: employeeType.employmentTypeId,
            driverProfileId: employeeType.driverProfileId
          }
        });
      } else {
        return prisma.driverEmploymentPreferences.create({
          data: {
            employmentTypeId: employeeType.employmentTypeId,
            driverProfileId: employeeType.driverProfileId
          }
        });
      }
    });
    await prisma.$transaction([...deleteEmployeeTypes, ...saveEmployeeTypes]);
  } catch (error) {
    console.error(error);
    throw new Error('Error updating employee types');
  }
}

export async function updateWorkRangeTypes(workRangeTypes: DriverWorkRangePreferencesDTO[], workRangeTypesDelete: DriverWorkRangePreferencesDTO[]): Promise<void> {
  try {
    const deleteWorkRangeTypes = workRangeTypesDelete.map((workRangeType) => {
      return prisma.driverWorkRangePreferences.delete({
        where: {
          id: workRangeType.id
        }
      });
    });
    const saveWorkRangeTypes = workRangeTypes.map((workRangeType) => {
      if (workRangeType.id) {
        return prisma.driverWorkRangePreferences.update({
          where: {
            id: workRangeType.id
          },
          data: {
            driverProfileId: workRangeType.driverProfileId,
            workScopeId: workRangeType.workScopeId
          }
        });
      } else {
        return prisma.driverWorkRangePreferences.create({
          data: {
            driverProfileId: workRangeType.driverProfileId,
            workScopeId: workRangeType.workScopeId
          }
        });
      }
    });
    await prisma.$transaction([...deleteWorkRangeTypes, ...saveWorkRangeTypes]);
  } catch (error) {
    console.error(error);
    throw new Error('Error updating work range types');
  }
}
