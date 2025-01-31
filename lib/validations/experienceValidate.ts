'use server';

import { z } from "zod";
import { ExperienceDTO, State } from "../definitions";


const FormAddExperienceSchema = z.object({
  experienceType: z.string({
    required_error: 'Debes escoger una experiencia',
  }).nullable().refine(value => value !== null, {
    message: 'Debes escoger una experiencia',
  }),
  startYear: z.date({
    required_error: 'Le fecha de inicio es obligatoria',
  }).max(new Date(new Date().setHours(24)), 'La fecha no puede ser mayor a la fecha actual'),
  endYear: z.date({
    required_error: 'La fecha de fin es obligatoria',
  }).max(new Date(new Date().setHours(24)), 'La fecha no puede ser mayor a la fecha actual'),
  description: z.string({
    required_error: 'La descripción es obligatoria',
  }).min(1, 'La descripción es obligatoria').max(250, 'Máximo 250 caracteres'),
}).refine(data => data.startYear <= data.endYear, {
  message: 'La fecha de inicio debe ser anterior a la fecha de fin',
  path: ['startYear'],
});


export async function validateExperience(prevState: State, data: ExperienceDTO): Promise<State> {
  let errors: State = {message: null, errors: []};
  try {
    const validate = await FormAddExperienceSchema.safeParse(data);
    if (!validate.success) {
      errors = {message: 'Error en los campos del formulario', errors: validate.error.errors};
    }
  } catch (error: any) {
    errors = {message: error.message, errors: error.errors};
  }
  return errors;
}
