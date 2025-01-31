'use server';
import { z } from 'zod';
import { getUserByEmail } from '../data/user';
import { Sign } from 'crypto';
import { SignUpCandidateFormData, State } from '../definitions';
import { count } from 'console';

const FormUserAuthSchema = z.object({
    email: z.string({
        invalid_type_error: 'Correo electrónico no válido',
    }).email('Correo electrónico no válido').refine(async (email) => {
        const user = await getUserByEmail(email);
        return !user;
    }, {
        message: 'El correo electrónico ya está en uso',
    }),
    password: z.string().min(8, 'Contraseña no válida, debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(8, 'Contraseña no válida, debe tener al menos 8 caracteres')
});
const date18YearsAgo = new Date();
date18YearsAgo.setFullYear(date18YearsAgo.getFullYear() - 18);
const FormUserSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  lastname: z.string().min(1, 'Los apellidos son obligatorios'),
  cifnif: z.string().min(1, 'El CIF/NIF es obligatorio'),
  "contactInfo.phone": z.string().min(1, 'El teléfono es obligatorio'),
  birthdate: z.date({
    required_error: 'Campo obligatorio',
    invalid_type_error: 'Campo obligatorio',
  }).max(date18YearsAgo, 'Recuerda que debes ser mayor de edad +18.'),
  "contactInfo.streetAddress": z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'La dirección es obligatoria'),
  "contactInfo.zip": z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'El código postal es obligatorio'),
  "contactInfo.country": z.number({
    required_error: 'Campo obligatorio',
  }).min(1, 'El país es obligatorio'),
  "contactInfo.province": z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'La provincia es obligatoria'),
  "contactInfo.locality": z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'La localidad es obligatoria'),
  "contactInfo.mobilePhone": z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio'),
  "contactInfo.landlinePhone": z.string(),
});

const FormUserProfesionalSchema = z.object({
  workRange: z.array(z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio')).min(1, 'Debe seleccionar al menos un rango de trabajo'),
  employeeType: z.array(z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio')).min(1, 'Debe seleccionar al menos un tipo de empleado'),
  licences: z.array(
    z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio'))
  .nonempty('Debe seleccionar al menos una licencia'),
  adrLicences: z.array(z.string()),
  countryLicences: z.number({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio'),
  capCertificate: z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio'),
  digitalTachograph: z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio'),
});



export async function validateUserAuthData(prevState: State, formData: Partial<SignUpCandidateFormData>) {
    const validateUserForm = await FormUserAuthSchema.safeParseAsync(formData);
    if (!validateUserForm.success) {
        return {
            ...prevState,
            errors: validateUserForm.error.errors,
            message: 'Error en los campos del formulario',
        };
    }

    return {};
}
export async function validateUserData(prevState: State, formData: Partial<SignUpCandidateFormData>) {
  const contactInfo = formData.contactInfo!;
  const validateUserForm = await FormUserSchema.safeParseAsync({
    name: formData.name,
    lastname: formData.lastname,
    cifnif: formData.cifnif,
    birthdate: formData.birthdate,
    "contactInfo.streetAddress": contactInfo.streetAddress,
    "contactInfo.zip": contactInfo.zip,
    "contactInfo.country": Number(contactInfo.country),
    "contactInfo.province": contactInfo.province,
    "contactInfo.locality": contactInfo.locality,
    "contactInfo.mobilePhone": contactInfo.mobilePhone,
    "contactInfo.landlinePhone": contactInfo.landlinePhone,
    "contactInfo.phone": contactInfo.mobilePhone,
  });
  if (!validateUserForm.success) {
    return {
        ...prevState,
        errors: validateUserForm.error.errors,
        message: 'Error en los campos del formulario',
    };
  }
  return {};
}

export async function validateProfesionalData(prevState: State, formData: Partial<SignUpCandidateFormData>) {
    console.log(formData);
    const validateUserForm = await FormUserProfesionalSchema.safeParseAsync({
        workRange: formData.workRange,
        employeeType: formData.employeeType,
        licences: formData.licences,
        adrLicences: formData.adrLicences,
        countryLicences: formData.countryLicences,
        digitalTachograph: formData.digitalTachograph,
        capCertificate: formData.capCertificate,
    });
    if (!validateUserForm.success) {
        return {
            ...prevState,
            errors: validateUserForm.error.errors,
            message: 'Error en los campos del formulario',
        };
    }

    return {};
}