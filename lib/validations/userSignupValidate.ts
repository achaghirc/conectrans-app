'use server';
import { z } from 'zod';
import { getUserByEmail } from '../data/user';
import { Sign } from 'crypto';
import { SignUpCandidateFormData, State } from '../definitions';

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

const FormUserSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    lastname: z.string().min(1, 'Los apellidos son obligatorios'),
    cifnif: z.string().min(1, 'El CIF/NIF es obligatorio'),
    phone: z.string().min(1, 'El teléfono es obligatorio'),
    birthdate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
    streetAddress: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'La dirección es obligatoria'),
    zip: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'El código postal es obligatorio'),
    country: z.number({
        required_error: 'Campo obligatorio',
    }).min(1, 'El país es obligatorio'),
    province: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'La provincia es obligatoria'),
    locality: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'La localidad es obligatoria'),
    mobilePhone: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    landlinePhone: z.string(),
});

const FormUserProfesionalSchema = z.object({
    workRange: z.array(z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio')).min(1, 'Campo obligatorio'),
    employeeType: z.array(z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio')),
    licence: z.object({
        // adrCode is an array of strings
        adrCode: z.array(z.string({
            required_error: 'Campo obligatorio',
        }).min(1, 'Campo obligatorio')),
        code: z.string({
            required_error: 'Campo obligatorio',
        }).min(1, 'Campo obligatorio'),
        country: z.number({
            required_error: 'Campo obligatorio',
        }).min(1, 'Campo obligatorio'),
    }),
});



export async function validateUserAuthData(prevState: State, formData: SignUpCandidateFormData) {
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
export async function validateUserData(prevState: State, formData: SignUpCandidateFormData) {
    const validateUserForm = await FormUserSchema.safeParseAsync({
        name: formData.name,
        lastname: formData.lastname,
        cifnif: formData.cifnif,
        phone: formData.contactInfo.mobilePhone,
        birthdate: formData.birthdate,
        streetAddress: formData.contactInfo.streetAddress,
        zip: formData.contactInfo.zip,
        country: formData.contactInfo.country,
        province: formData.contactInfo.province,
        locality: formData.contactInfo.locality,
        mobilePhone: formData.contactInfo.mobilePhone,
        landlinePhone: formData.contactInfo.landlinePhone,
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

export async function validateProfesionalData(prevState: State, formData: SignUpCandidateFormData) {
    console.log(formData);
    const validateUserForm = await FormUserProfesionalSchema.safeParseAsync({
        workRange: formData.workRange,
        employeeType: formData.employeeType,
        licence: formData.licence,
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