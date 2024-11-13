import prisma from "@/app/lib/prisma/prisma";
import { Asset } from "@prisma/client";
import { CompanyDTO } from "../definitions";


export async function getCompanyByUserId(userId: string): Promise<CompanyDTO | undefined> {
    try {
        const company = await prisma.company.findUnique({
            where: {
                userId: userId,
            },
            include: {
                Asset: {
                    select: {
                        url: true,
                    },
                },
                ContactPerson:{
                    select:{
                        name: true,
                        lastname: true,
                        phone: true,
                        document: true,
                        companyPosition: true,
                        email: true,
                    }
                }
            }
        });
        if (!company) {
            return undefined;
        }
        const companyDTO: CompanyDTO = {...company, 
                assetUrl: company.Asset!.url,
                contactPersonName: company.ContactPerson!.name,
                contactPersonLastname: company.ContactPerson!.lastname,
                contactPersonPhone: company.ContactPerson!.phone,
                contactPersonDocument: company.ContactPerson!.document,
                contactPersonCompanyPosition: company.ContactPerson!.companyPosition,
                contactPersonEmail: company.ContactPerson!.email,
            };
        return companyDTO
    } catch (error) {
        throw new Error(`Error getting company ${error}`);
    }
}