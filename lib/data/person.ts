'use server';
import prisma from "@/app/lib/prisma/prisma";
import { PersonDTO } from "../definitions";
import { getLocationById } from "./location";
import { LocationDTO } from "@prisma/client";

export async function getPersonByUserId(userId: string): Promise<PersonDTO | undefined> {
    try {
        const person = await prisma.person.findUnique({
            where: {
                userId: userId,
            },
            include: {
                Asset: {
                    select: {
                        url: true,
                    },
                },
                PersonProfileImage: {
                    select: {
                        url: true,
                    },
                }, 
            }
        });
        if (!person) {
            return undefined;
        }
        const location: LocationDTO | undefined= await getLocationById(person.locationId);
        const personDTO: PersonDTO = {...person, 
          assetUrl: person.PersonProfileImage ? person.PersonProfileImage.url : null,
          resumeUrl: person.Asset ? person.Asset.url : null,
          location: location,
        };
        return personDTO;
    } catch (error) {
        throw new Error(`Error getting person ${error}`);
    }
}