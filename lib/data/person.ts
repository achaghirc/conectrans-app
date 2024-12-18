'use server';
import prisma from "@/app/lib/prisma/prisma";
import { PersonDTO } from "../definitions";
import { getLocationById } from "./location";
import { LocationDTO } from "@prisma/client";

export async function getPersonById(personId: number): Promise<PersonDTO | undefined> {
    try {
        const person = await prisma.person.findUnique({
            where: {
                id: personId,
            },
        });
        if (!person) {
            return undefined;
        }
        const location: LocationDTO | undefined= await getLocationById(person.locationId);
        const personDTO: Partial<PersonDTO> = {...person, 
          location: location,
        };
        return personDTO as PersonDTO;
    } catch (error) {
        throw new Error(`Error getting person ${error}`);
    }
}
export async function getPersonByUserId(userId: string): Promise<PersonDTO | undefined> {
    try {
        const person = await prisma.person.findUnique({
            where: {
                userId: userId,
            },
            include: {
                Asset: {
                    select: {
                        id: true,
                        secureUrl: true,
                    },
                },
                PersonProfileImage: {
                    select: {
                        secureUrl: true,
                        id: true,
                    },
                }, 
            }
        });
        if (!person) {
            return undefined;
        }
        const location: LocationDTO | undefined= await getLocationById(person.locationId);
        const personDTO: PersonDTO = {...person, 
          assetUrl: person.PersonProfileImage ? person.PersonProfileImage.secureUrl : null,
          resumeUrl: person.Asset ? person.Asset.secureUrl : null,
          location: location,
        };
        return personDTO;
    } catch (error) {
        throw new Error(`Error getting person ${error}`);
    }
}
const personIdCache = new Map<string, number>(); 
export async function getPersonIdByUserId(userId: string): Promise<number | undefined> {
    try {
      if (personIdCache.has(userId)) {
          return personIdCache.get(userId); // Return cached value
      }
      const person = await prisma.person.findUnique({
          
          where: {
              userId: userId,
          },
          select: {
              id: true,
          },
      });
      if (person?.id !== undefined) {
        personIdCache.set(userId, person.id); // Store result in cache
      }
      return person?.id;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving person ID for userId "${userId}": ${error.message}`);
      } else {
          // Handle unexpected error formats
          throw new Error(`Unknown error retrieving person ID for userId "${userId}": ${String(error)}`);
      }
    }
}


export async function updatePerson(data: PersonDTO): Promise<PersonDTO | string> {
    try {
        const updatedPerson = await prisma.person.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                lastname: data.lastname,
                birthdate: data.birthdate,
                phone: data.phone,
                document: data.document,
            },
        });
        const person: PersonDTO | undefined = await getPersonById(updatedPerson.id);
        return person ?? 'Person not found';
    } catch (error) {
        if (error instanceof Error) {
            return `Error updating person ${error.message}`;
        } else {
            return `Unknown error updating person: ${String(error)}`;
        }
    }
}

export async function updatePersonPreferences(personId: number, hasCar: boolean, relocateOption: boolean) : Promise<{hasCar: boolean, relocateOption: boolean} | string> {
    try {
        const updatedPerson = await prisma.person.update({
            where: {
                id: personId,
            },
            data: {
                hasCar: hasCar,
                relocateOption: relocateOption,
            },
        });
        return {hasCar: updatedPerson.hasCar, relocateOption: updatedPerson.relocateOption};
    } catch (error) {
        if (error instanceof Error) {
            return `Error updating person preferences ${error.message}`;
        } else {
            return `Unknown error updating person preferences: ${String(error)}`;
        }
    }
}