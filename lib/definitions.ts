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
