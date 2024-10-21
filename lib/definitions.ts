import { Dayjs } from "dayjs";
import { ZodIssue } from "zod";

export type User = {
    id?: string;
    name?: string;
    email: string;
    password: string;
};

export type Person = {
    id: string;      
    name: string;  
    lastname: string; 
    birthdate: string;
    phone: string;  
    document: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date; 
}

export type Company = {
    id?: string;
    name: string;
    socialName: string;
    cif: string;
    description: string;
    address: string;
    phone: string;
    cifnif: string;
    userId: string;
    activityId?: number;
    locationId?: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export type Activity = {
    id?: number;
    name: string;
    code: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type Location = {
    id?: number;
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    latitude: number;
    longitude: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export type Role = {
    id: number;
    name: string;
    code: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export type State = {
    errors?: ZodIssue[];
    message?: string | null;
};

export type SignUpCompanyFormData = {
    company: SignUpCompanyCompanyFormData;
    contactInfo: SignUpCompanyContactFormData;
    contactPerson: SignUpCompanyPersonContactFormData;
};

export type SignUpCompanyContactFormData = {
    streetAddress: string;
    zip: string;
    country: string;
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
    phone: string;
    landlinePhone?: string;
    birthdate: Dayjs | string;
    workRange: string[];
    licence: Licence;
    contactInfo: SignUpCompanyContactFormData;
}

export type SignUpCandidateContactFormData = Partial<SignUpCompanyContactFormData>;

export type Licence = {
    id: number;
    name: string;
    code: string;
    adrCode: string[];
    digitalTachograph: 'Si' | 'No' ;
    capCertificate: 'Si' | 'No';
    country: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
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


export type AuthenticateMessageErr ={
    message: string,
    type: string,
}

export type StepperProps = {
    children: React.JSX.Element | null;
    activeStep: number;
    steps: string[];
    handleNext: () => void;
    handleBack: () => void;
    isLastStep: boolean;
}
export type PasswordType = 'password' | 'confirmPassword';


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

export type SignUpCandidateProps = {
    countries: Country[];
}