import { ContactPerson } from "@prisma/client";
import { z } from "zod";
import { validateCIFNIFFormat } from "../actions";
import { State } from "../definitions";

const ContactPersonValidateSchema = z.object({
  name: z.string()
    .min(1, 'Campo obligatorio').max(255, 'Máximo 255 caracteres'),
  lastname: z.string()
    .min(1, 'Campo obligatorio').max(255, 'Máximo 255 caracteres'),
  phone: z.string()
    .min(1, 'Campo obligatorio').max(255, 'Máximo 255 caracteres'),
  email: z.string()
    .email('Email inválido').min(1, 'Campo obligatorio').max(255, 'Máximo 255 caracteres'),
  companyPosition: z.string()
    .min(1, 'Campo obligatorio').max(255, 'Máximo 255 caracteres'),
  document: z.string()
    .min(0, 'Campo opciónal').max(9, 'Máximo 9 caracteres')
    .refine(async (value) => {
      const validate = await validateCIFNIFFormat(value);
      return validate?.valid;
    }, {
      message: 'CIF/NIF inválido, revisa el campo',
    }),
});



export async function validateContactPersonData(data:ContactPerson) : Promise<State> {
  try { 
    const validation = await ContactPersonValidateSchema.safeParseAsync({
      name: data.name,
      lastname: data.lastname,
      phone: data.phone,
      email: data.email,
      companyPosition: data.companyPosition,
      document: data.document,
    });

    if (!validation.success) {
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
    throw new Error(`Error validating contact person ${error}`);
  }
    
  

  
}