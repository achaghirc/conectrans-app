'use server';
import prisma from "@/app/lib/prisma/prisma";
import { Company, Location, LocationDTO } from "@prisma/client";
import { CompanyDTO } from "../definitions";

export type LocationFilter = {
  street: string;
  number: string;
  city: string;
  state: string;
  countryId: number;
  zip: string;
};

export async function getLocationById(id: number): Promise<LocationDTO | undefined> {
    try {
        const location = await prisma.location.findFirst({
            where: {
                id: id,
            },
            include: {
                Country: {
                    select: {
                        name_es: true,
                        cod_iso2: true,
                },
            }
          },
        });
        if (!location) return undefined;
        const locationDto: LocationDTO = {
            ...location,
            countryName: location.Country!.name_es,
            countryCode: location.Country!.cod_iso2 ?? '',
        };
        return locationDto;
    }catch(e) {
        console.log(e);
    }
}

export async function getLocationByFilter(filter: LocationFilter): Promise<LocationDTO | undefined> {
  try {
    const location = await prisma.location.findFirst({
      where: {
        street: filter.street,
        number: filter.number,
        city: filter.city,
        state: filter.state,
        countryId: filter.countryId,
        zip: filter.zip,
      },
      include: {
        Country: {
          select: {
            name_es: true,
            cod_iso2: true,
          },
        },
      },
    });
    if (!location) return undefined;
    const locationDto: LocationDTO = {
      ...location,
      countryName: location.Country!.name_es,
      countryCode: location.Country!.cod_iso2 ?? '',
    };
    return locationDto;
  } catch (error) {
    console.log(error);
    return undefined;
   }

}

export async function createLocation(newLocation: Location): Promise<LocationDTO> {
  try {
    const createdLocation = await prisma.location.create({
      data: newLocation,
      include: {
        Country: {
          select: {
            name_es: true,
            cod_iso2: true,
          },
        },
      },
    });
    return {...createdLocation, 
        countryName: createdLocation.Country!.name_es,
        countryCode: createdLocation.Country!.cod_iso2 ?? '',       
    };
  } catch (error) {
    throw new Error(`Error creating location: ${error}`);
  }
}

export async function updateLocationByCompany(location: Location, company: CompanyDTO): Promise<LocationDTO> {
  try {
    const updatedLocation = await prisma.location.update({
      where: {
        id: location.id,
      },
      data: {
        street: company.locationStreet!,
        number: company.locationNumber!,
        city: company.locationCity!,
        state: company.locationState!,
        countryId: company.locationCountryId!,
        zip: company.locationZip!,
        updatedAt: new Date(),
      },
      include: {
        Country: {
          select: {
            name_es: true,
            cod_iso2: true,
          },
        },
      },
    });
    return {...updatedLocation, 
        countryName: updatedLocation.Country!.name_es,
        countryCode: updatedLocation.Country!.cod_iso2 ?? '',
    };
  } catch (error) {
    throw new Error(`Error updating location: ${error}`);
  }
}
