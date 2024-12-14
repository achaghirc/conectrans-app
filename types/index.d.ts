import { Company as PrismaCompany, 
  Location, 
  Subscription as PrismaSubscription, 
  Plan,
  DriverLicence as PrismaDriverLicence,
  EncoderType,
  DriverEmploymentPreferences,
  DriverWorkRangePreferences,
  User as BaseUser,
  country,
   } from "@prisma/client";

declare module '@prisma/client' {
    interface CompanyDTO extends PrismaCompany {
        Asset: {
            url: string;
        } & PrismaCompany;
    }

    interface LocationDTO extends Location {
        countryName: string;
        countryCode: string;
    }

    interface SubscriptionDTO extends PrismaSubscription {
        Plan: Plan;
    }

    interface DriverLicenceDTO extends PrismaDriverLicence {
        id?: number;
        LicenceType: EncoderType;
        Country: country;
    }

    interface DriverEmploymentPreferencesDTO extends DriverEmploymentPreferences {
      id?: number;
      EncoderType: EncoderType;
    }
    interface DriverWorkRangePreferencesDTO extends DriverWorkRangePreferences {
      id?: number;
      workScope: EncoderType;
    }

    interface User extends BaseUser {
        roleCode?: string;
        companyId?: number;
        personId?: number;
        assetUrl?: string;
        name?: string;
    }
}
