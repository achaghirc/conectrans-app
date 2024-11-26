'use server';
import prisma from "@/app/lib/prisma/prisma";
import { Languages } from "@prisma/client";
import { PersonLanguageDTO } from "../definitions";
import { getPersonByUserId } from "./person";

export async function getLanguages(): Promise<Languages[] | undefined> {
  const languages = await prisma.languages.findMany();
  return languages;
}

export async function getPersonLanguageByUserId(userId: string): Promise<PersonLanguageDTO[] | undefined> {
  try {
    const person = await getPersonByUserId(userId);
    if (!person) {
      return undefined;
    }
    const personLanguages = await prisma.personLanguages.findMany({
      where: {
        personId: person.id
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