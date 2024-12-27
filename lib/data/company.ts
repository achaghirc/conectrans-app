'use server';
import prisma from "@/app/lib/prisma/prisma";
import { Asset, LocationDTO } from "@prisma/client";
import { CompanyDTO} from "../definitions";
import { createLocation, getLocationById, updateLocationByCompany } from "./location";
import { Location } from "@prisma/client";
import { getActitivieByCode } from "./activity";
import { takeNumberFromString } from "../utils";
import { getAssetById } from "./asset";


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
                ContactPerson:{
                    select:{
                        name: true,
                        lastname: true,
                        phone: true,
                        document: true,
                        companyPosition: true,
                        email: true,
                    }
                },
                Activity: true,
            }
        });

        if (!company) {
            return undefined;
        }
        const location : LocationDTO | undefined = await getLocationById(company.locationId!);
        const companyDTO: CompanyDTO = {...company, 
                assetUrl: company.Asset!.url,
                contactPersonName: company.ContactPerson!.name,
                contactPersonLastname: company.ContactPerson!.lastname,
                contactPersonPhone: company.ContactPerson!.phone,
                contactPersonDocument: company.ContactPerson!.document,
                contactPersonCompanyPosition: company.ContactPerson!.companyPosition,
                contactPersonEmail: company.ContactPerson!.email,
                locationStreet: location!.street,
                locationNumber: location!.number,
                locationCity: location!.city,
                locationState: location!.state,
                locationCountryId: location!.countryId,
                locationCountryName: location!.countryName,
                locationCountryCode: location!.countryCode,
                locationZip: location!.zip,
                activityName: company.Activity!.name,
                activityCode: company.Activity!.code,
                activityDescription: company.Activity!.description,
            };
        return companyDTO
    } catch (error) {
        throw new Error(`Error getting company ${error}`);
    }
}

export async function getCompanyById(companyId: number): Promise<CompanyDTO | undefined> {
  try{
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      include: {
        Asset: {
            select: {
                url: true,
            },
        },
        Location: true,
        Activity: true,
      }
    });
    if (!company) {
      return undefined;
    }
    const location : LocationDTO | undefined = await getLocationById(company.locationId!);
    return {
      ...company,
      assetUrl: company.Asset!.url,
      locationStreet: company.Location!.street,
      locationNumber: company.Location!.number,
      locationCity: company.Location!.city,
      locationState: company.Location!.state,
      locationCountryId: company.Location!.countryId,
      locationCountryName: location!.countryName,
      locationCountryCode: location!.countryCode,
      locationZip: company.Location!.zip,
      activityName: company.Activity!.name,
      activityCode: company.Activity!.code,
    }
  }catch (error) {
    throw new Error(`Error getting company ${error}`);
  }
}

export async function getCompanySlimDTOById(companyId: number): Promise<Partial<CompanyDTO> | undefined> {

  try{
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        name: true,
        socialName: true,
        description: true,
        assetId: true,
      },
    });
    if (!company) {
      return undefined;
    }
    const asset: Asset | null = await getAssetById(company.assetId!);
    return {
      name: company.name,
      socialName: company.socialName,
      description: company.description,
      assetUrl: asset ? asset.url : undefined,
    }
  } catch (error) { 
    throw new Error(`Error getting company ${error}`);
  }

}


export async function updateCompanyData(company: CompanyDTO): Promise<CompanyDTO> {
  try {
    const activity = await getActitivieByCode(company.activityCode!);
    if (!activity) {throw new Error(`Activity not found`);}

    const number = (await takeNumberFromString(company.locationStreet || "")).toString();

    let location: LocationDTO | undefined = await getLocationById(company.locationId!);
    if (!location) {
      const newLocation : Location = {
        id: 0,
        street: company.locationStreet!,
        number: number,
        city: company.locationCity!,
        state: company.locationState!,
        countryId: company.locationCountryId!,
        zip: company.locationZip!,
        latitude: 0,
        longitude: 0,
        updatedAt: new Date(),
        createdAt: new Date(),
      }
      location = await createLocation(newLocation)
    } else {
      location = await updateLocationByCompany(location, company);
    }
    if (!location) {
      const newLocation : Location = {
        id: 0,
        street: company.locationStreet!,
        number: number,
        city: company.locationCity!,
        state: company.locationState!,
        countryId: company.locationCountryId!,
        zip: company.locationZip!,
        latitude: 0,
        longitude: 0,
        updatedAt: new Date(),
        createdAt: new Date(),
      }
      location = await createLocation(newLocation)
    }
    const updatedCompany = await prisma.company.update({
      where: {
        userId: company.userId,
      },
      data: {
        name: company.name,
        socialName: company.socialName,
        description: company.description,
        email: company.email,
        phone: company.phone,
        cifnif: company.cifnif,
        locationId: location?.id,
        activityId: activity.id,
        updatedAt: new Date(),
      },
      include: {
        Asset: {
            select: {
                url: true,
            },
        },
        ContactPerson:{
            select:{
                name: true,
                lastname: true,
                phone: true,
                document: true,
                companyPosition: true,
                email: true,
            }
        },
        Activity: true,
      }
    });

    if (!updatedCompany) {
      throw new Error(`Company not found`);
    }
    const companyDTO: CompanyDTO = {...updatedCompany,
        assetUrl: updatedCompany.Asset!.url,
        contactPersonName: updatedCompany.ContactPerson!.name,
        contactPersonLastname: updatedCompany.ContactPerson!.lastname,
        contactPersonPhone: updatedCompany.ContactPerson!.phone,
        contactPersonDocument: updatedCompany.ContactPerson!.document,
        contactPersonCompanyPosition: updatedCompany.ContactPerson!.companyPosition,
        contactPersonEmail: updatedCompany.ContactPerson!.email,
        locationStreet: location!.street,
        locationNumber: location!.number,
        locationCity: location!.city,
        locationState: location!.state,
        locationCountryId: location!.countryId,
        locationCountryName: location!.countryName,
        locationCountryCode: location!.countryCode,
        locationZip: location!.zip,
        activityName: updatedCompany.Activity!.name,
        activityCode: updatedCompany.Activity!.code,
        activityDescription: updatedCompany.Activity!.description,
    };
    return companyDTO;
  }catch (error) {
    throw new Error(`Error updating company ${error}`);
  }



}
