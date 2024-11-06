import { Company as PrismaCompany } from "@prisma/client";

declare module '@prisma/client' {
    interface CompanyDTO extends PrismaCompany {
        Asset: {
            url: string;
        } & PrismaCompany;
    }
}