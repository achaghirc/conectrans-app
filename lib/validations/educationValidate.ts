'use server';

import { z } from "zod";
import { EducationDTO, State} from "../definitions";

const FormAddEducationSchema = z.object({ 
  title: z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio'),
  center: z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio'),
  speciality: z.string().optional(),
  startYear: z.date({
    required_error: 'Campo obligatorio',
  }).max(new Date(new Date().setHours(24)), 'La fecha no puede ser mayor a la fecha actual'),
  endYear: z.date({
    required_error: 'Campo obligatorio',
  }).max(new Date(new Date().setHours(24)), 'La fecha no puede ser mayor a la fecha actual'),
  }).refine(data => data.startYear <= data.endYear, {
  message: 'La fecha de inicio debe ser anterior a la fecha de fin',
  path: ['startYear'],
});


export async function validateEducation(prevState: State, data: EducationDTO): Promise<State> {
  let errors: State = {message: null, errors: []};
  try {
    const validate = await FormAddEducationSchema.safeParse(data);
    if (!validate.success) {
      errors = {message: 'Error en los campos del formulario', errors: validate.error.errors};
    }
  } catch (error: any) {
    errors = {message: error.message, errors: error.errors};
  }
  return errors;
}
