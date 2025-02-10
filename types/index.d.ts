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
  Person,
  Experience,
  Languages,
  Transaction,
  PlanPreferences,
   } from "@prisma/client";

import { CompanyDTO as CompanyDefinitionsDTO } from '@lib/definitions';
import { EncoderTypeDTO } from "@/lib/definitions";

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
        Plan: {
          id: number;
          title: string;
          description: string;
          price: number | null;
          priceMonthly: number | null;
          priceBianual: number | null;
          priceYearly: number | null;
          PlanPreferences: {
            id: number;
            planId: number;
            preferencePlanId: number;
          }[]
      };
      Transaction?: {
        stripe_transaction_id: string;
        stripe_payment_method?: string;
        status: string;
        amount: number;
      }[];
    }

    interface TransactionDTO extends Transaction {
        stripe_transaction_id: string;
        stripe_payment_method?: string;
        amount: number;
        paidOffers: number;
        Plan: {
          id: number;
          title: string;
        };
        Subscription: {
          remainingOffers: number;
          usedOffers: number;
        };  
    }

    interface SubscriptionSlimDTO extends PrismaSubscription {
        Plan: {
            id: number;
            title: string;
            price: number;
            priceMonthly: number;
            priceBianual: number;
            priceYearly: number;
            maxOffers: number;
            principalOffers: number;
            anonymousOffers: number;
            maxOffersBianual: number;
            maxOffersMonthly: number;
            maxOffersYearly: number;
            PlanPreferences: {
              id: number;
              planId: number;
              preferencePlanId: number;
              preferencePlanEncType: EncoderType;
            }[]
        } & Plan;
        Transaction: {
          amount: number;
        }[] & Transaction[];
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
        price: number;
        priceMonthly?: number;
        priceBianual?: number;
        priceYearly?: number;
        PlanPreferences: {
          id: number;
          planId: number;
          preferencePlanId: number;
          preferencePlanEncType: EncoderType;
        }[];
    }

    interface OfferDTO extends Offer {
        Location: {
            Country: {
              name_es: string;
              id: number;
              cod_iso2: string | null;
            } | null,
        } & Partial<Location>;
        isAnonymous: boolean;
        isFeatured: boolean;
        Subscription?: {
          status: string;
        };
        company?: CompanyDefinitionsDTO;
        OfferPreferences: {
          id: number;  
          offerId?: number;
          EncoderType: EncoderType;
          type: string;
        }[];
        User: {
          Company: {
            name: string;
            Asset: {
              url: string;
            } | null;
          } | null;
        },
        _count?: {
          ApplicationOffer: number;
        }
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
    interface OfferSlimDTO extends Partial<Offer> {
      id?: number;
      isAnonymous: boolean;
      isFeatured: boolean;
      Location: {
          state: string;
          city: string;
      },
      User: {
        Company: {
            name: string;
            Asset: {
                url: string;
            } | null;
        } | null;
      },
      OfferPreferences: {
          EncoderType: {
              id: number;
              type: string;
              name: string;
              code: string;
          };
          type: string;
      }[],
      Subscription: {
        planId: number;
        status: string;
      },
      _count: {
        ApplicationOffer: number;
      }
    }

    interface ApplicationOfferDTO extends Partial<ApplicationOffer> {
      id?: number;
      status: string;
      updatedAt: Date;
      Person?: {
        User: {
          email: string;
        }
        Location: {
          state: string;
          city: string;
        };
        PersonLanguages: {
          id: number;
          level: string;
          Languages: Languages;
        }[],
        Education: {
          id: number,
          title: string,
          startYear: Date,
          endYear: Date,
          center: string | null,
        }[];
        Experience: Experience[],
        DriverProfile: {
          hasCapCertification: boolean;
          hasDigitalTachograph: boolean;
          DriverWorkRangePreferences: {
            id: number;
            workScope: {
              id: number;
              name: string;
              code: string;
              type: string;
            };
          }[];
          DriverEmploymentPreferences: {
            id: number;
            EncoderType: EncoderTypeDTO;
          }[];
          DriverLicence: {
            id: number;
            countryId: number;
            Country: {
              id: number;
              name_es: string;
              cod_iso2: string | null;
            }
            LicenceType: EncoderTypeDTO | null;
          }[];
        }[],
        Asset: {
          url: string | null;
          secureUrl: string | null;
          publicId: string | null;
        } | null;
        PersonProfileImage: {
          url: string | null;
        } | null;
      } & Person | null;
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
            phone: string | null;
            landlinePhone: string | null;
            Asset: {
              url: string | null;
            } | null;
          } | null;
        } & User | null;
      };

    }
}
