'use server';

import { z } from "zod";
import { State } from "../definitions";
import { LocationDTO } from "@prisma/client";


const FormValidateLocationSchema = z.object({
  street: z.string().min(1, 'Campo obligatorio').max(255, 'Máximo 255 caracteres'),
  number: z.string().min(1, 'Campo obligatorio').max(10, 'Máximo 10 caracteres'),
  city: z.string().min(1, 'Campo obligatorio').max(255, 'Máximo 255 caracteres'),
  state: z.string().min(1, 'Campo obligatorio').max(255, 'Máximo 255 caracteres'),
  countryId: z.number().int().min(1, 'Campo obligatorio'),
  zip: z.string().min(1, 'Campo Obligatorio').max(255, 'Máximo 255 caracteres'),
});


export async function validateLocationObject(prevState: State, location: LocationDTO): Promise<State | undefined> {
  try {
    const validation =  await FormValidateLocationSchema.safeParseAsync({
      street: location.street,
      number: location.number,
      city: location.city,
      state: location.state,
      countryId: location.countryId,
      zip: location.zip,
    });
    if (!validation.success){
      return {
        errors: validation.error.errors,
        message: 'Error interno de validación',
      }
    }
    return {
      errors: [],
      message: 'Validación correcta',
    } as State;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: error.errors,
        message: 'Error interno de validación',
      }
    }
  }
}

