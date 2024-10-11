export type User = {
    id?: string;
    name?: string;
    email: string;
    password: string;
};

export type Company = {
    id?: string;
    name: string;
    socialName: string;
    cif: string;
    description: string;
    address: string;
    phone: string;
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
    id?: number;
    name: string;
    code: string;
    createdAt?: Date;
    updatedAt?: Date;
}
