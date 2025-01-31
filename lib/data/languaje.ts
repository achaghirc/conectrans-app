'use server';
import prisma from "@/app/lib/prisma/prisma";
import { Languages } from "@prisma/client";
import { PersonLanguageDTO } from "../definitions";
import { getPersonByUserId, getPersonIdByUserId } from "./person";

export async function getLanguages(): Promise<Languages[] | undefined> {
  const languages = await prisma.languages.findMany();
  return languages;
}

export async function getPersonLanguageByUserId(userId: string): Promise<PersonLanguageDTO[] | undefined> {
  try {
    const personId = await getPersonIdByUserId(userId);
    if (!personId) {
      return undefined;
    }
    const personLanguages = await prisma.personLanguages.findMany({
      where: {
        personId: personId
      },
      include: {
        Languages: true
      }
    });
    if (!personLanguages) {
      return undefined;
    }

    const personLanguagesDTO: PersonLanguageDTO[] = personLanguages.map((personLanguage) => {
      return {
        id: personLanguage.id,
        languageId: personLanguage.languageId,
        personId: personLanguage.personId,
        languageName: personLanguage.Languages.name,
        languageCode: personLanguage.Languages.code,
        level: personLanguage.level
      }
    });
    return personLanguagesDTO;
  } catch (error: any) {
    throw new Error('Error getting person languages ' + error.message);
  }
}

export async function savePersonLanguages(personLanguages: PersonLanguageDTO[], userId: string): Promise<void> {
  try {
    const personId = await getPersonIdByUserId(userId);
    if (!personId) {
      throw new Error('Person not found');
    }
    const data = personLanguages.map((personLanguage) => {
      return {
        personId: personId,
        languageId: personLanguage.languageId!,
        level: personLanguage.level!
      }
    });

    await prisma.personLanguages.createMany({
      data: data
    });
  } catch (error: any) {
    throw new Error('Error saving person languages ' + error.message);
  }
}

export async function deletePersonLanguages(personLanguages: PersonLanguageDTO[]): Promise<void> {
  try {
    const deleteLanguages = personLanguages.map((language) => {
      return prisma.personLanguages.delete({
        where: {
          id: language.id
        }
      });
    });
    await Promise.all(deleteLanguages);
  } catch (error: any) {
    throw new Error('Error deleting person languages ' + error.message);
  }
}