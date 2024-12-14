'use server';
import prisma from "@/app/lib/prisma/prisma";
import { EducationDTO } from "../definitions";
import { getPersonByUserId, getPersonIdByUserId } from "./person";

export async function getEducationDataByUserId(userId: string): Promise<EducationDTO[] | undefined> {
  
  try {
    const personId = await getPersonIdByUserId(userId);
    if (!personId) {
      return undefined;
    }
    const educationData = await prisma.education.findMany({
      where: {
        personId: personId
      },
    });
    if (!educationData) {
      return undefined;
    }
    const educations: EducationDTO[] = educationData.map((education) => {
      return {
        id: education.id,
        title: education.title,
        center: education.center ?? '',
        speciality: education.speciality ?? '',
        startYear: education.startYear,
        endYear: education.endYear,
        personId: education.personId,
      }
    });
    return educations;
  } catch (error: any) {
    throw new Error('Error getting education data ' + error.message);
  }
}


export async function saveEducationData(educationData: EducationDTO[], userId: string): Promise<void> {
  try {
    const personId = await getPersonIdByUserId(userId);
    if (!personId) {
      throw new Error('Person not found');
    }
    const data = educationData.map((education) => {
      return {
        personId: personId,
        title: education.title,
        center: education.center,
        speciality: education.speciality,
        startYear: education.startYear,
        endYear: education.endYear,
      }
    });
    
    await prisma.education.createMany({
      data: data
    });
  } catch (error: any) {
    throw new Error('Error saving education data ' + error.message);
  }
}

export async function deleteEducations(educationData: EducationDTO[]): Promise<void> {
  try {
    const deleteEducations = educationData.map((education) => {
      return prisma.education.delete({
        where: {
          id: education.id
        }
      });
    });
    await Promise.all(deleteEducations);
  } catch (error: any) {
    throw new Error('Error deleting education data ' + error.message);
  }
}