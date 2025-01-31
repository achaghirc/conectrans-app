'use server';
import { Experience } from "@prisma/client";
import { getPersonByUserId, getPersonIdByUserId } from "./person";
import prisma from "@/app/lib/prisma/prisma";
import { ExperienceDTO } from "../definitions";

export async function getExperiencesByUserId(userId:string): Promise<ExperienceDTO[] | undefined> {
  try { 
    const personId = await getPersonIdByUserId(userId);
    if (!personId) {
      return undefined;
    }
    const experiences = await prisma.experience.findMany({
      where: {
        personId: personId
      },
      include: {
        ExperienceType: true
      }
    });
    if (!experiences) {
      return undefined;
    }
    const experiencesDTO: ExperienceDTO[] = experiences.map((experience) => {
      return {
        id: experience.id,
        experienceType: experience.ExperienceType.name,
        experienceTypeId: experience.experienceTypeId,
        experienceTypeCode: experience.ExperienceType.code,
        startYear: experience.startYear,
        endYear: experience.endYear,
        personId: experience.personId,
        description: experience.description
      }
    });
    return experiencesDTO;
  } catch (error) {
    throw error;
  }
}

export async function saveExperiences(experiences: ExperienceDTO[], userId: string): Promise<void> {
  try {
    const personId = await getPersonIdByUserId(userId);
    if (!personId) {
      throw new Error('Person not found');
    }
    const data = experiences.map((experience) => {
      return {
        personId: personId,
        experienceTypeId: experience.experienceTypeId ?? 0,
        jobName: experience.experienceType ?? '',
        description: experience.description,
        startYear: experience.startYear,
        endYear: experience.endYear,
      }
    });
    
    await prisma.experience.createMany({
      data: data
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteExperiences(experiences: ExperienceDTO[]): Promise<void> {
  try {
    const deleteExperiences = experiences.map((experience) => {
      return prisma.experience.delete({
        where: {
          id: experience.id
        }
      });
    });
    await Promise.all(deleteExperiences);
  } catch (error) {
    throw error;
  }
}