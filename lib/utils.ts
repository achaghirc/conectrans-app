'use server';
import { Decimal } from "@prisma/client/runtime/library";
import { FilterOffersDTO } from "./definitions";

export const convertDecimalToNumber = async (value: Decimal | null | undefined): Promise<number> => {
  return await Promise.resolve(value ? value.toNumber() : 0);
}

export const takeNumberFromString = async (value: string) => {
  let str = value;
  if (value.includes(',')) {
    str = value.split(',')[0];
  }
  if (str.match(/\d+/g) === null || str.match(/\d+/g) === undefined || str.match(/\d+/g)!.length === 0) {
    return 'S/N';
  }
	return await Promise.resolve(str.match(/\d+/g)!.map(Number));
}

export async function stringYESNOToBoolean(value: string) {
  return value == 'YES';
}

export  const generatePagination = async (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const checkIfIsNumber = async (value: string) => {
  return !isNaN(Number(value));
}

export const getNumberFromSearchParam = async (paramValue: string, defNumber?: number) => {
  if (!paramValue || !checkIfIsNumber(paramValue)) {
    return defNumber || 1;
  }
  return Number(paramValue);
}

export const getFilterDataFromQuery = async (searchParams: URLSearchParams): Promise<FilterOffersDTO> => {
  const params = searchParams;
  const data = {
    contractType: params.getAll('contractType') ?? [],
    country: params.get('country') ?? undefined,
    state: params.get('state') ?? undefined,
    licenseType: params.getAll('licenseType') ?? [],
    adrType: params.getAll('adrType') ?? [],
    workRange: params.getAll('workRange') ?? [],
    experience: params.get('experience') ?? undefined,
    isFeatured: params.get('isFeatured') === 'true' ? true : false,
    isAnonymous: params.get('isAnonymous') === 'true' ? true : false,
    allOffers: params.get('allOffers') === 'true' ? true : false
  };
  return data; 
}