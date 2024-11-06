'use server';

import { z } from "zod";
import { SignUpCompanyFormData, State } from "../definitions";
import { getUserByEmail } from "../data/user";


const FormCompanySchema = z.object({
    email: z.string({
        invalid_type_error: 'Correo electrónico no válido',
    }).email('Correo electrónico no válido').refine(async (email) => {
        const user = await getUserByEmail(email);
        return !user;
    }, {
        message: 'El correo electrónico ya está en uso',
    }),
    password: z.string().min(8, 'Contraseña no válida, debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(8, 'Contraseña no válida, debe tener al menos 8 caracteres'),
    socialName: z.string({
        invalid_type_error: 'Campo obligatorio',
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    comercialName: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    cifnif: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    activityType: z.string({
        required_error: 'Debe seleccionar una actividad. Obligatorio',
    }).min(1, 'Debe seleccionar una actividad. Obligatorio'),
    logo: z.string().nullable(),
});

const FormContactSchema = z.object({
    streetAddress: z.string({
        required_error: 'La dirección es obligatoria',
    }).min(1, 'La dirección es obligatoria'),
    zip: z.string().min(1, 'El código postal es obligatorio'),
    country: z.number().min(1, 'El país es obligatorio'),
    province: z.string().min(1, 'La provincia es obligatoria'),
    locality: z.string().min(1, 'La localidad es obligatoria'),
    mobilePhone: z.string().min(1, 'El teléfono móvil es obligatorio'),
    landlinePhone: z.string(),
    website: z.string(),
    contactEmail: z.string({
        invalid_type_error: 'Correo electrónico no válido',
    }).email('Correo electrónico no válido'),
    description: z.string({
        required_error: 'Campo obligatorio',
    }).min(1).max(250, 'Maximo 250 caracteres'),
});

const FormPersonContactSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    lastnames: z.string().min(1, 'Los apellidos son obligatorios'),
    companyPosition: z.string().min(1, 'El cargo es obligatorio'),
    phoneNumber: z.string().min(1, 'El teléfono es obligatorio'),
    email: z.string().email('Correo electrónico no válido'),
});

const FormDataSchema = z.object({
    company: z.object({
        email: z.string({
            invalid_type_error: 'Correo electrónico no válido',
        }).email(),
        password: z.string().min(8, 'Contraseña no válida, debe tener al menos 8 caracteres'),
        confirmPassword: z.string().min(8, 'Contraseña no válida, debe tener al menos 8 caracteres'),
        socialName: z.string({
            invalid_type_error: 'Campo obligatorio',
            required_error: 'Campo obligatorio',
        }).min(1),
        comercialName: z.string({
            required_error: 'Campo obligatorio',
        }).min(1),
        activityType: z.string({
            required_error: 'Debe seleccionar una actividad. Obligatorio',
        }).min(1),
        logo: z.string().nullable(),
    }),
    contactInfo: z.object({
        streetAddress: z.string({
            required_error: 'La dirección es obligatoria',
        }).min(1, 'La dirección es obligatoria'),
        zip: z.string().min(1, 'El código postal es obligatorio'),
        country: z.string().min(1, 'El país es obligatorio'),
        province: z.string().min(1, 'La provincia es obligatoria'),
        locality: z.string().min(1, 'La localidad es obligatoria'),
        mobilePhone: z.string().min(1, 'El teléfono móvil es obligatorio'),
        landlinePhone: z.string(),
        website: z.string(),
        contactEmail: z.string({
            invalid_type_error: 'Correo electrónico no válido',
        }).email('Correo electrónico no válido'),
        description: z.string({
            required_error: 'Campo obligatorio',
        }).min(1).max(250, 'Maximo 250 caracteres'),
    }),
    contactPerson: z.object({
        name: z.string().min(1, 'El nombre es obligatorio'),
        lastnames: z.string().min(1, 'Los apellidos son obligatorios'),
        companyPosition: z.string().min(1, 'El cargo es obligatorio'),
        phoneNumber: z.string().min(1, 'El teléfono es obligatorio'),
        email: z.string().email('Correo electrónico no válido'),
    }),
});

export async function validateCompanyData(prevState: State, formData: SignUpCompanyFormData) {
    const validatedFields = await FormCompanySchema.safeParseAsync({
        email: formData.company.email,
        password: formData.company.password,
        confirmPassword: formData.company.confirmPassword,
        socialName: formData.company.socialName,
        comercialName: formData.company.comercialName,
        cifnif: formData.company.cifnif,
        activityType: formData.company.activityType,
        logo: formData.company.logo,
    });
    if (!validatedFields.success) {
        return {
            ...prevState,
            errors: validatedFields.error.errors,
            message: 'Error en los campos del formulario',
        };
    }

    return {};
}

export async function validateContactData(prevState: State, formData: SignUpCompanyFormData) {
    const validatedFields = FormContactSchema.safeParse({
        streetAddress: formData.contactInfo.streetAddress,
        zip: formData.contactInfo.zip,
        country: formData.contactInfo.country,
        province: formData.contactInfo.province,
        locality: formData.contactInfo.locality,
        mobilePhone: formData.contactInfo.mobilePhone,
        landlinePhone: formData.contactInfo.landlinePhone,
        website: formData.contactInfo.website,
        contactEmail: formData.contactInfo.contactEmail,
        description: formData.contactInfo.description,
    });
    if (!validatedFields.success) {
        return {
            ...prevState,
            errors: validatedFields.error.errors,
            message: 'Error en los campos del formulario',
        };
    }
    return {};
}

export async function validatePersonContactData(prevState: State, formData: SignUpCompanyFormData) {
    const validatedFields = FormPersonContactSchema.safeParse({
        name: formData.contactPerson.name,
        lastnames: formData.contactPerson.lastnames,
        companyPosition: formData.contactPerson.companyPosition,
        phoneNumber: formData.contactPerson.phoneNumber,
        email: formData.contactPerson.email,
    });
    if (!validatedFields.success) {
        return {
            ...prevState,
            errors: validatedFields.error.errors,
            message: 'Error en los campos del formulario',
        };
    }
    return {};
}

export async function validateFormData(prevState: State, formData: SignUpCompanyFormData) {
    const validatedFields = FormDataSchema.safeParse(formData);
    if (!validatedFields.success) {
        return {
            ...prevState,
            errors: validatedFields.error.errors,
            message: 'Error en los campos del formulario',
        };
    }
    return {};
}