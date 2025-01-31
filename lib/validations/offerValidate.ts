'use server';
import { OfferDTO } from "@prisma/client";
import { State } from "../definitions";
import { z } from "zod";

const OfferInformationSchema = z.object({
  title: z.string()
    .min(5, 'Título debe tener mínimo 5 caracteres')
    .max(50, 'Título debe tener máximo 50 caracteres'),
  subtitle: z.string()
    .min(5, 'Subtítulo debe tener mínimo 5 caracteres')
    .max(50, 'Subtítulo debe tener máximo 50 caracteres'),
  description: z.string()
    .min(1, 'Campo obligatorio, por favor introduce una descripción para que tu oferta llegue a más gente.')
    .max(1500, 'La descripción no puede tener más de 250 caracteres'),
  startDate: z.date({
    required_error: 'Campo obligatorio',
  }).max(new Date(new Date().setHours(24)), 'La fecha no puede ser mayor a la fecha actual'),
  endDate: z.date({
    required_error: 'Campo obligatorio',
  }),
  salary: z.string()
    .min(1, 'Campo obligatorio')
    .max(50, 'El salario no puede tener más de 50 caracteres'),
  employmentType: z.array(
    z.string({
      required_error: 'Campo obligatorio',
    }))
  .min(1, 'Campo obligatorio, selecciona al menos una opción'),
  contractType: z.string()
    .min(1, 'Campo obligatorio')
    .refine(data => data === 'INDEFINIDO' || data === 'TEMPORAL' || data === 'PRACTICAS', {
      message: 'El contrato debe ser de tipo Indefinido, Temporal o Prácticas',
  }),
  workDay: z.string()
    .min(1, 'Campo obligatorio')
    .max(50, 'La jornada laboral no puede tener más de 50 caracteres')
    .refine(data => data === 'COMPLETA' || data === 'PARCIAL', {
      message: 'La jornada laboral debe ser de tiempo Completa o Parcial',
  }),
}).refine(data => data.startDate <= data.endDate, {
    message: 'La fecha de inicio debe ser anterior a la fecha límite',
    path: ['startDate'],
  });

const OfferRequirementsSchema = z.object({
  licenseType: z.array(z.string()
  .min(1, 'Campo obligatorio')
  ).min(1, 'Campo obligatorio, seleccione al menos una opción'),
  licenseAdr: z.array(z.string()
  .min(1, 'Campo obligatorio')
  ).min(1, 'Campo obligatorio, seleccione al menos una opción'),
  workRange: z.array(z.string()
  .min(1, 'Campo obligatorio')
  ).min(1, 'Campo obligatorio, seleccione al menos una opción'),
  capCertification: z.string()
  .min(1, 'Campo obligatorio, seleccione una opción')
  .refine(data => data === 'YES' || data === 'NO', {
    message: 'El certificado CAP debe ser Si o No',
  }),
  digitalTachograph: z.string()
  .min(1, 'Campo obligatorio, seleccione una opción')
  .refine(data => data === 'YES' || data === 'NO', {
    message: 'El tacógrafo digital debe ser Si o No',
  }),
  isAnonymous: z.boolean()
  .refine(data => data === true || data === false, {
    message: 'Campo obligatorio, seleccione una opción',
  }),
  isFeatured: z.boolean()
  .refine(data => data === true || data === false, {
    message: 'Campo obligatorio, seleccione una opción',
  }),
});


const OfferLocationsSchema = z.object({
  'Location.street': z.string()
    .min(1, 'Campo obligatorio, introduce la dirección.')
    .max(255, 'Máximo 255 caracteres'),
  'Location.number': z.string()
    .min(1, 'Campo obligatorio, introduce el número o S/N en caso de no disponer de uno.')
    .max(10, 'Máximo 10 caracteres'),
  'Location.city': z.string()
    .min(1, 'Campo obligatorio, introduce la ciudad.')
    .max(255, 'Máximo 255 caracteres'),
  'Location.state': z.string()
    .min(1, 'Campo obligatorio, introduce o selecciona la provincia.')
    .max(255, 'Máximo 255 caracteres'),
  'Location.countryId': z.string()
    .min(1, 'Campo obligatorio, selecciona un país.'),
  'Location.zip': z.string()
    .min(1, 'Campo Obligatorio, introduce tu código postal')
    .max(255, 'Máximo 255 caracteres'),
});


export async function validateOfferInformation(offer: Partial<OfferDTO>) : Promise<State> {
  try {
    const validate = OfferInformationSchema.safeParse(offer);
    if (!validate.success) {
      return {message: 'Error en los campos del formulario', errors: validate.error.errors};
    }
    return {
      message: 'Oferta validada correctamente',
      errors: []
    }
  } catch(e) {
    console.log(e);
    return {
      message: 'Error al validar la oferta',
      errors: []
    }
  }
}

export async function validateOfferRequirements(offer: Partial<OfferDTO>) : Promise<State> {
  try {
    const validate = OfferRequirementsSchema.safeParse(offer);
    if (!validate.success) {
      return {message: 'Error en los campos del formulario', errors: validate.error.errors};
    }
    return {
      message: 'Requisitos validados correctamente',
      errors: []
    }
  } catch(e) {
    console.log(e);
    return {
      message: 'Error al validar los requisitos',
      errors: []
    }
  }
}

export async function validateOfferLocation(object: Partial<OfferDTO>) : Promise<State> {
  try {
    const validate = OfferLocationsSchema.safeParse({
      'Location.street': object.Location?.street,
      'Location.number': object.Location?.number,
      'Location.city': object.Location?.city,
      'Location.state': object.Location?.state,
      'Location.countryId': object.Location?.countryId,
      'Location.zip': object.Location?.zip
    });
    if (!validate.success) {
      return {message: 'Error en los campos del formulario', errors: validate.error.errors};
    }
    return {
      message: 'Ubicación validada correctamente',
      errors: []
    }
  } catch(e) {
    console.log(e);
    return {
      message: 'Error al validar la ubicación',
      errors: []
    }
  }
}