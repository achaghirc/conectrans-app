'use server';
import prisma from "@/app/lib/prisma/prisma";
import { ContactPerson } from "@prisma/client";

export async function getContactPersonById(contactPersonId: number): Promise<ContactPerson | null> {
    try {
        const contactPerson : ContactPerson | null = await prisma.contactPerson.findUnique({
            where: {
                id: contactPersonId,
            },
        });
        return contactPerson;
    } catch (error) {
        throw new Error(`Error getting contact person ${error}`);
    }
}

export async function updateContantPerson(contactPerson: ContactPerson): Promise<ContactPerson | null> {
    try {
      contactPerson.id = parseInt(contactPerson.id as unknown as string);
      const updatedContactPerson : ContactPerson = await prisma.contactPerson.update({
          where: {
              id: contactPerson.id,
          },
          data: {
            ...contactPerson,
            updatedAt: new Date(),
          }
      });
      if (!updatedContactPerson) {
          return null;
      }
      return updatedContactPerson;
    } catch (error) {
        throw new Error(`Error updating contact person ${error}`);
    }
}