'use server';
import prisma from "@/app/lib/prisma/prisma";
import { Languages } from "@prisma/client";

export async function getLanguages(): Promise<Languages[] | undefined> {
  const languages = await prisma.languages.findMany();
  return languages;
}