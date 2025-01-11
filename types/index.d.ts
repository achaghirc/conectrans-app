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
  Offer,
  OfferPreferences,
  ApplicationOffer,
   } from "@prisma/client";

import { CompanyDTO as CompanyDefinitionsDTO } from '@lib/definitions';

declare module '@prisma/client' {
    interface CompanyDTO extends PrismaCompany {
        Asset: {
            url: string;
        } & PrismaCompany;
        activityName: string;
        activityCode: string;
    }

    interface LocationDTO extends Location {
        countryName: string;
        countryCode: string;
    }

    interface SubscriptionDTO extends PrismaSubscription {
        Plan: PlanDTO;
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

    interface UserDTO extends BaseUser {
        roleCode?: string;
        companyId?: number;
        companyDescription?: string;
        personId?: number;
        assetUrl?: string;
        name?: string;
        confirmPassword?: string;
    }

    interface PlanDTO extends Plan {
        description: string;
        price: number;
        priceMonthly?: number;
        priceBianual?: number;
        priceYearly?: number;
        planPreferences: EncoderType[];
    }

    interface OfferDTO extends Offer {
        location: LocationDTO;
        isAnonymous: boolean;
        isFeatured: boolean;
        subscription: SubscriptionDTO;
        company?: CompanyDefinitionsDTO;
        employmentType?: EncoderType[];
        workRange?: EncoderType[];
        licenseType?: EncoderType[];
        licenseAdr?: EncoderType[];
        experience?: EncoderType;
    }

    interface OfferCustomDTO extends Offer {
      locationState: string;
      planId: number;
      subStatus?: string; 
      companyName?: string;
      companyLogoUrl?: string;
      licenseType?: EncoderType[];
    }

    interface OfferPreferencesDTO extends OfferPreferences {
      id?: number;
      encoderType: EncoderType;
    }
    interface OfferSlimDTO extends Offer {
        id?: number;
        isAnonymous: boolean;
        isFeatured: boolean;
    }

    interface ApplicationOfferDTO extends Partial<ApplicationOffer> {
      id?: number;
      status: string;
      updatedAt: Date;
      Offer: {
        id: number;
        title: string;
        endDate: Date;
        Location: {
          state: string;
          city: string;
        };
        OfferPreferences: {
          EncoderType: {
            name: string | null;
            code: string | null;
          };
          type: string | null;
        }[];
        User: {
          Company: {
            name: string | null;
            Asset: {
              url: string | null;
            } | null;
          } | null;
        } | null;
      };

    }
}
