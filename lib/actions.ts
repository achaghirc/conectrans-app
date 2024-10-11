'use server';

import { signIn, signOut} from "@/auth";
import { AuthError } from "next-auth";
import { tree } from "next/dist/build/templates/app-page";
import { z, ZodIssue } from "zod";

export type State = {
    errors?: ZodIssue[];
    message?: string | null;
};

const FormCompanySchema = z.object({
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
    tipoActividad: z.string({
        required_error: 'Debe seleccionar una actividad. Obligatorio',
    }).min(1),
    logo: z.string().nullable(),
});

const FormContactSchema = z.object({
    streetAddress: z.string({
        required_error: 'La dirección es obligatoria',
    }).min(1, 'La dirección es obligatoria'),
    codigoPostal: z.string().min(1, 'El código postal es obligatorio'),
    pais: z.string().min(1, 'El país es obligatorio'),
    provincia: z.string().min(1, 'La provincia es obligatoria'),
    localidad: z.string().min(1, 'La localidad es obligatoria'),
    telefonoMovil: z.string().min(1, 'El teléfono móvil es obligatorio'),
    telefonoFijo: z.string(),
    sitioWeb: z.string(),
    emailContacto: z.string({
        invalid_type_error: 'Correo electrónico no válido',
    }).email('Correo electrónico no válido'),
    descripcion: z.string({
        required_error: 'Campo obligatorio',
    }).min(1).max(250, 'Maximo 250 caracteres'),
});

const FormPersonContactSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    apellidos: z.string().min(1, 'Los apellidos son obligatorios'),
    cargo: z.string().min(1, 'El cargo es obligatorio'),
    telefono: z.string().min(1, 'El teléfono es obligatorio'),
    email: z.string().email('Correo electrónico no válido'),
});


const FormDataSchema = z.object({
    empresa: z.object({
        email: z.string({
            invalid_type_error: 'Correo electrónico no válido',
        }).email(),
        password: z.string({
            invalid_type_error: 'Contraseña no válida, debe tener al menos 8 caracteres',
        }).min(8),
        confirmPassword: z.string({
            invalid_type_error: 'Contraseña no válida, debe tener al menos 8 caracteres',
        }).min(8),
        socialName: z.string(),
        comercialName: z.string(),
        tipoActividad: z.string(),
        logo: z.string().nullable(),
    }),
    contacto: z.object({
        streetAddress: z.string(),
        codigoPostal: z.string(),
        pais: z.string(),
        provincia: z.string(),
        localidad: z.string(),
        telefonoMovil: z.string(),
        telefonoFijo: z.string(),
        sitioWeb: z.string(),
        emailContacto: z.string().email(),
        descripcion: z.string(),
    }),
    personaContacto: z.object({
        nombre: z.string(),
        apellidos: z.string(),
        cargo: z.string(),
        telefono: z.string(),
        email: z.string().email(),
    }),
});

export async function validateCompanyData(prevState: State, formData: FormData) {
    console.log('formData', formData);
    const validatedFields = FormCompanySchema.safeParse({
        email: formData.get('empresa.email') as string,
        password: formData.get('empresa.password') as string,
        confirmPassword: formData.get('empresa.confirmPassword') as string,
        socialName: formData.get('empresa.socialName') as string,
        comercialName: formData.get('empresa.comercialName') as string,
        tipoActividad: formData.get('empresa.tipoActividad') as string,
        logo: formData.get('empresa.logo') as string,
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

export async function validateContactData(prevState: State, formData: FormData) {
    const validatedFields = FormContactSchema.safeParse({
        streetAddress: formData.get('contacto.streetAddress') as string,
        codigoPostal: formData.get('contacto.codigoPostal') as string,
        pais: formData.get('contacto.pais') as string,
        provincia: formData.get('contacto.provincia') as string,
        localidad: formData.get('contacto.localidad') as string,
        telefonoMovil: formData.get('contacto.telefonoMovil') as string,
        telefonoFijo: formData.get('contacto.telefonoFijo') as string,
        sitioWeb: formData.get('contacto.sitioWeb') as string,
        emailContacto: formData.get('contacto.emailContacto') as string,
        descripcion: formData.get('contacto.descripcion') as string,
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

export async function validatePersonContactData(prevState: State, formData: FormData) {
    const validatedFields = FormPersonContactSchema.safeParse({
        nombre: formData.get('personaContacto.nombre') as string,
        apellidos: formData.get('personaContacto.apellidos') as string,
        cargo: formData.get('personaContacto.cargo') as string,
        telefono: formData.get('personaContacto.telefono') as string,
        email: formData.get('personaContacto.email') as string,
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


export async function authenticate(
    prevState: string | undefined,
    formData: FormData
): Promise<string | undefined> {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if(error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin': 
                    return 'Invalid credentials. Please try again.';
                default:
                    return 'An error occurred while signing in. Please try again.';
            }
        }
        throw error;
    }
}

export async function logout(): Promise<void> {
    await signOut();
}