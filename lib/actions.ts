'use server';

import { signIn, signOut} from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { AuthenticateMessageErr, SignUpCompanyFormData, State, ValidationCIFNIFResult } from "./definitions";
import { getUserByEmail } from "./data/user";

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

export async function validateCIFNIFFormat(cifnif:string): Promise<ValidationCIFNIFResult | undefined> {
    const letrasNIF = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const letrasCIFControl = 'JABCDEFGHI';
    const letrasCIF = 'ABCDEFGHJKLMNPQRSUVW';
  
    cifnif = cifnif.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Eliminar caracteres no válidos
  
    if (/^\d{8}[A-Z]$/.test(cifnif)) {
      const numeros = cifnif.slice(0, 8);
      const letra = cifnif[8];
      const letraEsperada = letrasNIF[parseInt(numeros) % 23];
      if (letra === letraEsperada) {
        return { valid: true };
      } else {
        return { valid: false, message: 'Letra de control incorrecta para el NIF' };
      }
    }
  
    if (/^[XYZ]\d{7}[A-Z]$/.test(cifnif)) {
      const letraInicial = cifnif[0];
      const numeros = cifnif.slice(1, 8);
      const letra = cifnif[8];
      const numeroCompleto = (letraInicial === 'X' ? '0' : letraInicial === 'Y' ? '1' : '2') + numeros;
      const letraEsperada = letrasNIF[parseInt(numeroCompleto) % 23];
      if (letra === letraEsperada) {
        return { valid: true };
      } else {
        return { valid: false, message: 'Letra de control incorrecta para el NIE' };
      }
    }
  
    if (/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/.test(cifnif)) {
      const letraInicial = cifnif[0];
      const numeros = cifnif.slice(1, 8);
      const control = cifnif[8];
  
      let sumaPares = 0;
      let sumaImpares = 0;
      for (let i = 0; i < numeros.length; i++) {
        const digito = parseInt(numeros[i]);
        if (i % 2 === 0) {
          const doble = digito * 2;
          sumaImpares += doble > 9 ? doble - 9 : doble;
        } else {
          sumaPares += digito;
        }
      }
  
      const total = sumaPares + sumaImpares;
      const digitoControlNumerico = (10 - (total % 10)) % 10;
  
      if (/[ABEH]/.test(letraInicial)) {
        if (control === digitoControlNumerico.toString()) {
          return { valid: true };
        } else {
          return { valid: false, message: 'Dígito de control incorrecto para el CIF' };
        }
      } else if (/[NPQRSVW]/.test(letraInicial)) {
        if (control === letrasCIFControl[digitoControlNumerico]) {
          return { valid: true };
        } else {
          return { valid: false, message: 'Letra de control incorrecta para el CIF' };
        }
      }
    }
  
    return { valid: false, message: 'Formato inválido para NIF, NIE o CIF' };
  }


export async function authenticate(
    prevState: string | undefined,
    formData: FormData
): Promise<AuthenticateMessageErr | undefined> {
    try {
        await signIn('credentials', formData);
    } catch (error: any) {
        if(error instanceof AuthError) {
            let authErr: AuthenticateMessageErr = {} as AuthenticateMessageErr;
            switch (error.type) {
                case 'CredentialsSignin':
                    authErr.message= error.message;
                    authErr.type= 'email';
                    return authErr;
                case 'AccessDenied':
                    authErr.message= error.message;
                    authErr.type= 'general';
                    return authErr;
                case 'CallbackRouteError':
                    return {
                        message: error.cause?.err?.message || 'An error occurred while signing in. Please try again.',
                        type: error.cause?.err?.name || 'general',
                    }
                default:
                    return {
                        message: 'An error occurred while signing in. Please try again.',
                        type: 'general',                        
                    }
            }
        }
        throw error;
    }
}

export async function logout(): Promise<void> {
    await signOut();
}