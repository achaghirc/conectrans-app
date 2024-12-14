'use server';

import prisma from "@/app/lib/prisma/prisma";
import { Asset, Person } from "@prisma/client";
import { getPersonByUserId } from "./person";
import { AssetSlimDTO, CloudinaryUploadResponse, PersonDTO } from "../definitions";

export async function getAssetFileByUserId(userId: string): Promise<AssetSlimDTO> {
  try {

    const person: PersonDTO | undefined= await getPersonByUserId(userId);
    if (!person) {
      throw new Error('Person not found');
    }

    if (!person.resumeId || !person.resumeUrl) {
      return {} as AssetSlimDTO
    }

    const asset: Asset | null = await prisma.asset.findUnique({
      where: {
        id: person.resumeId
      }
    });
    if (!asset) {
      return {} as AssetSlimDTO;
    }
    const assetSlim: AssetSlimDTO = {
      ...asset,
      originalFilename: asset.originalFilename,
    }
    return assetSlim;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error getting asset file by user id '+ userId);
  }
}

export async function saveAssetOnDatabase(cloudinaryResponse: CloudinaryUploadResponse, userId: string): Promise<AssetSlimDTO | undefined> {
  try {
    const person: PersonDTO | undefined= await getPersonByUserId(userId);
    if (!person) {
      throw new Error('Person not found');
    }
    const asset = {
      url: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
      secureUrl: cloudinaryResponse.secure_url,
      height: cloudinaryResponse.height,
      width: cloudinaryResponse.width,
      format: cloudinaryResponse.format,
      originalFilename: cloudinaryResponse.original_filename,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const assetSaved = await prisma.asset.create({
      data: asset
    });
    if (!assetSaved) {
      throw new Error('Error saving asset on database');
    } 
    //Update person with asset id
    await prisma.person.update({
      where: {
        id: person.id
      },
      data: {
        resumeId: assetSaved.id,
      }
    });
    return {
      ...assetSaved,
      originalFilename: assetSaved.originalFilename,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error saving asset on database');
  }
}

export async function removeAssetFromDatabase(id: number): Promise<boolean> {
  try {
    const asset = await prisma.asset.delete({
      where: {
        id: id
      }
    });
    if (!asset) {
      throw new Error('Error deleting asset from database');
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error deleting asset from database');
  }
}
