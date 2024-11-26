'use server';
import prisma from "@/app/lib/prisma/prisma";
import { EducationDTO } from "../definitions";
import { getPersonByUserId } from "./person";

export async function getEducationDataByUserId(userId: string): Promise<EducationDTO[] | undefined> {
  
  try {
    const person = await getPersonByUserId(userId);
    if (!person) {
      return undefined;
    }
    const educationData = await prisma.education.findMany({
      where: {
        personId: person.id
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