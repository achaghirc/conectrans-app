'use server';
import { Experience } from "@prisma/client";
import { getPersonByUserId } from "./person";
import prisma from "@/app/lib/prisma/prisma";
import { ExperienceDTO } from "../definitions";

export async function getExperiencesByUserId(userId:string): Promise<ExperienceDTO[] | undefined> {
  try { 
    const person = await getPersonByUserId(userId);
    if (!person) {
      return undefined;
    }
    const experiences = await prisma.experience.findMany({
      where: {
        personId: person.id
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