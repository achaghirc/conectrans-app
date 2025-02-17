import { DriverEmploymentPreferences, DriverEmploymentPreferencesDTO, DriverLicenceDTO, DriverWorkRangePreferences, DriverWorkRangePreferencesDTO, OfferCustomDTO, OfferDTO, PlanDTO } from "@prisma/client";
import { Dayjs } from "dayjs";
import { ZodIssue } from "zod";

export type User = {
    id?: string;
    name?: string;
    email: string;
    roleCode?: string;
    password: string;
};

export type PersonDTO = {
    id: number;      
    name: string;  
    lastname: string; 
    birthdate: Date | null;
    phone: string;
    landlinePhone: string | null;
    relocateOption: boolean | null;
    hasCar: boolean |null 
    document: string | null;
    location: LocationDTO | undefined;
    userId: string;
    assetUrl: string | null;
    resumeId: number | null;
    resumeUrl: string | null;
    createdAt: Date;
    updatedAt: Date; 
}

export type AssetSlimDTO = {
    id: number;
    publicId: string;
    url: string;
    secureUrl: string;
    height: number | null;
    width: number | null;
    format: string | null; 
    originalFilename: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;

}

export type CompanyDTO = {
    id?: number;
    name: string;
    socialName: string;
    description: string;
    email: string | null;
    phone: string;
    landlinePhone?: string;
    assetUrl: string;
    cifnif: string;
    userId: string;
    contactPersonId?: number;
    contactPersonName?: string;
    contactPersonLastname?: string;
    contactPersonPhone?: string;
    contactPersonDocument?: string | null;
    contactPersonCompanyPosition?: string;
    contactPersonEmail?: string;
    locationId?: number;
    locationStreet?: string;
    locationNumber?: string;
    locationCity?: string;
    locationState?: string;
    locationCountryId?: number;
    locationCountryName?: string;
    locationCountryCode?: string;
    locationZip?: string;
    activityId?: number;
    activityName?: string;
    activityCode?: string;
    activityDescription?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type CompanyUserAccountDTO = {
    userEmail: string;
    userPassword: string;
    contactPersonName: string;
    contactPersonLastname: string;
    contactPersonPhone: string;
    contactPersonDocument: string | null;
    contactPersonCompanyPosition: string;
    contactPersonEmail: string;
}

export type Activity = {
    id?: number;
    name: string;
    code: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type LocationDTO = {
    id?: number;
    street: string;
    number: string;
    city: string;
    state: string;
    countryId: number;
    countryName: string;
    countryCode: string;
    zip: string;
    latitude: number;
    longitude: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export type Role = {
    id?: number;
    name?: string;
    code: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type EncoderTypeDTO = {
    id: number;
    name: string;
    code: string;
    type?: string;
}

export type Plan = {
    id: number | undefined;
    title: string
    description: string;
    price: number;
    priceMonthly: number;
    priceYearly: number | null;
    priceBianual: number | null;
    currency: string;
    maxOffers: number;
    allowEditOffer: boolean;
    accessLimited: boolean;
    planPreferences: EncoderTypeDTO[];
}

export type PlanPreference = {
    id: number;
    planId: number;
    preferencePlanId: number;
}

export type DriverLicenceProfileDTO = {
  driverProfileId: number;
  personId: number;
  licences: DriverLicenceDTO[];
  hasCapCertificate: boolean;
  hasDigitalTachograph: boolean;
}

export type DriverPreferencesDTO = {
    driverProfileId: number;
    userId: string;
    personId?: number;
    workRanges: DriverWorkRangePreferencesDTO[];
    employeeTypes: DriverEmploymentPreferencesDTO[];
}



///////


export type State = {
    errors?: ZodIssue[];
    message?: string | null;
};

export type SignUpCompanyFormData = {
    company: SignUpCompanyCompanyFormData;
    contactInfo: SignUpCompanyContactFormData;
    contactPerson: SignUpCompanyPersonContactFormData;
    subscriptionPlan: Subscriptions;
};

export type Subscriptions = {
    id: number;
    userId: string;
    planId: number;
    Plan?: PlanDTO;
    startDate: Date;
    endDate: Date;
    stipeSubscriptionId: string;
    status: string;
    createdAt: Date;
}

export type SignUpCompanyContactFormData = {
    streetAddress: string;
    zip: string;
    country: number;
    province: string;
    locality: string;
    mobilePhone: string;
    landlinePhone: string;
    website: string;
    contactEmail: string;
    description: string;
};

export type SignUpCompanyPersonContactFormData = {
    name: string;
    lastnames: string;
    companyPosition: string;
    phoneNumber: string;
    email: string;
};

export type SignUpCompanyCompanyFormData = {
    email: string;
    password: string;
    confirmPassword: string;
    socialName: string;
    comercialName: string;
    cifnif: string;
    activityType: string;
    logo: File | null;
};

export type SignUpCandidateFormData = {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    lastname: string;
    cifnif: string;
    birthdate: Date | string;
    workRange: string[];
    employeeType: string[];
    summaryFile: File | null;
    licences: string[];
    adrLicences: string[];
    countryLicences: number;
    digitalTachograph: 'YES' | 'NO' ;
    capCertificate: 'YES' | 'NO';
    contactInfo: SignUpCandidateContactFormData;
    experiences: ExperienceDTO[];
    educations: EducationDTO[];
    languages: PersonLanguageDTO[];
}

export type EducationDTO = {
    id?: number;
    title: string;
    center: string;
    speciality?: string;
    startYear: string | Date;
    endYear: string | Date;
}
export type PersonLanguageDTO = {
    id?: number;
    personId?: number;
    languageId?: number;
    languageName?: string;
    languageCode?: string;
    level?: string;
}


export type ExperienceDTO = {
    id?: number;
    jobName?: string;
    startYear: string | Date;
    endYear: string | Date;
    description: string;
    experienceType: string;
    experienceTypeId?: number;
    experienceTypeCode?: string;
    personId?: number;
}

export type SignUpCandidateContactFormData = Partial<SignUpCompanyContactFormData>;

export type CandidateLicence = {
  type: 'LICENCE' | 'ADR_LICENCE';
  licence: Licence;
  adrLicence: Licence;
}

export type Licence = {
    id?: number;
    name?: string;
    code: string;
    country: number;
    countryName: string;
    expiresAt?: Date;
    createdAt?: Date;
}

export type ValidationCIFNIFResult = {
    valid: boolean;
    message?: string;
};

export type CloudinaryUploadResponse = {
    url: string;
    secure_url: string;
    original_filename: string;
    public_id: string;
    created_at: string;
    width: number;
    height: number;
    format: string;
}

export type CloudinaryRemoveResponse = {
    result: string;
}


export type AuthenticateMessage ={
    message: string,
    type: string,
    success: boolean,
}


export type PasswordType = 'password' | 'confirmPassword';
export type AccountForm = {
  email: boolean,
  password: boolean
}

export type Country = {
    id: number;
    name_es: string;
    name_en: string;
    cod_iso2: string | null;
    cod_iso3: string | null;
    phone_code: string | null;
}

export type Province = {
    id: number;
    name: string;
    cod_iso2: string;
    country_id: number | null;   
}

export type ProvinceCountryType = {
    country: Country;
    provinces: Province[];
}
///MAPS
export type MapComponentProps = {
  width?: string;
  height?: string;
  center?: { lat: number, lng: number };
  zoom?: number;
  locations: ReadonlyArray<google.maps.LatLngLiteral>;
}

export type OfferSearchResponse = {
  offers: OfferDTO[];
  total: number;
}

//FILTERS

export type ApplicationOfferFilter = {
  personId: number;
  status: string;
  offerId: number;
}

export type FilterOffersDTO = {
  id?: string | undefined;
  userId?: string | undefined;
  country: string | undefined;
  state: string | undefined;
  contractType: string[] | undefined;
  workRange: string[] | undefined;
  experience: string | undefined;
  licenseType: string[] | undefined;
  adrType: string[] | undefined;
  isFeatured: boolean | undefined;
  isAnonymous: boolean | undefined;
  allOffers: boolean | undefined;
  endDate?: Date | undefined;
  active?: boolean | undefined; // If is active or historical based on the end date
}

export type FilterTransactionsDTO = {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  planId?: number;
  planCode?: string;
  subscriptionId?: number;
}

export type SubscriptionFilterDTO = {
  userId?: string;
  status?: string;
}