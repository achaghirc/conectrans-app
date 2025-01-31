'use server';
import prisma from "@/app/lib/prisma/prisma";
import { EncoderType } from "@prisma/client";



export async function getEncoderTypeData(){
    try {
      const encoders: EncoderType[] = await prisma.encoderType.findMany();
      return encoders;
    } catch(e) {
      console.log('error searching for all the encoders: ', e);
    }
}

export async function getEncoderTypeByIdsIn(ids: number[]): Promise<EncoderType[] | undefined> {
    try {
      const encoders = await prisma.encoderType.findMany({
        where: {
          id: {
              in: ids
          }
        }
      });
      return encoders;
    } catch(e) {
      console.log('error searching for encoders by ids: ', e);
    }
}

const map = new Map<string, EncoderType[]>();

export async function getEncoderTypeByNameIn(name: string[]): Promise<EncoderType[]| undefined> {
  try {
    const key = name.join(',')
    if(map.has(key)){
      return map.get(key)
    }
    const encoders = await prisma.encoderType.findMany({
      where: {
        name: {
          in: name
        }
      }
    });
    if (!encoders) return undefined;
    map.set(key, encoders);
    return encoders;
  } catch(e) {
    console.log('error searching for encoders by name: ', e);
    return undefined;
  }
}