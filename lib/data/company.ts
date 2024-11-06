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
            }
        });
        if (!company) {
            return undefined;
        }
        const companyDTO: CompanyDTO = {...company, assetUrl: company.Asset!.url};
        return companyDTO
    } catch (error) {
        throw new Error(`Error getting company ${error}`);
    }
}