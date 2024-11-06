import prisma from "@/app/lib/prisma/prisma";
import { PersonDTO } from "../definitions";

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
            }
        });
        if (!person) {
            return undefined;
        }
        const personDTO: PersonDTO = {...person, assetUrl: person.Asset ? person.Asset.url : ''};
        return personDTO
    } catch (error) {
        throw new Error(`Error getting person ${error}`);
    }
}