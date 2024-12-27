'use server';
import { Decimal } from "@prisma/client/runtime/library";

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