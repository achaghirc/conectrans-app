'use server';
import prisma from "@/app/lib/prisma/prisma";
import { Country, Province, ProvinceCountryType } from "../definitions";
import { Hash } from "crypto";


export async function getCountries(): Promise<Country[] | undefined> {
    try {
        return await prisma.country.findMany();
    }catch(e) {
        console.log(e);
    }
}

export async function getCountryByCode(code: string): Promise<Country | undefined> {
    try {
        const country = await prisma.country.findFirst({
            where: {
                cod_iso2: code,
            },
        });
        if (!country) return undefined;
        return country;
    } catch(e) {
        console.log(e);
    }
}

export async function getCountryById(id: number): Promise<Country | undefined> {
    try {
        const country = await prisma.country.findFirst({
            where: {
                id: id,
            },
        });
        if (!country) return undefined;
        return country;
    } catch(e) {
        console.log(e);
    }
}

export async function getProvincesByCountryId(id: number): Promise<Province[] | undefined> {
    try {
        const country: Country | undefined = await getCountryById(id);
        if (!country) return undefined;
        const provinces: Province[] = await prisma.province.findMany({
            where: {
                country_id: country.id,
            },
        });
        return provinces;
    } catch(e) {
        console.log(e);
        return undefined;
    }
}

export async function getGeolocationData(countryId: number) {
    try {
        const [countries, provinces] = await Promise.all([
            getCountries(),
            getProvincesByCountryId(countryId),
        ]);
        return {
            countries: countries,
            provinces: provinces,
        }
    } catch(e) {
        console.log(e);
        return undefined;
    }
}