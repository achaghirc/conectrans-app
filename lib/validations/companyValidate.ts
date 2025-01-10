'use server';

import { string, z } from "zod";
import { SignUpCompanyFormData, State } from "../definitions";
import { getUserByEmail } from "../data/user";
import { CompanyDTO } from "@prisma/client";
import { CompanyDTO as CompanyDefinitionDTO } from '../definitions';
import { validateCIFNIFFormat } from "../actions";


const FormCompanySchema = z.object({
    "company.email": z.string({
        invalid_type_error: 'Correo electrónico no válido',
    }).email('Correo electrónico no válido').refine(async (email) => {
        const user = await getUserByEmail(email);
        return !user;
    }, {
        message: 'El correo electrónico ya está en uso',
    }),
    "company.password": z.string().min(8, 'Contraseña no válida, debe tener al menos 8 caracteres'),
    "company.confirmPassword": z.string().min(8, 'Contraseña no válida, debe tener al menos 8 caracteres'),
    "company.socialName": z.string({
        invalid_type_error: 'Campo obligatorio',
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    "company.comercialName": z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    "company.cifnif": z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    "company.activityType": z.string({
        required_error: 'Debe seleccionar una actividad. Obligatorio',
    }).min(1, 'Debe seleccionar una actividad. Obligatorio'),
    "company.logo": z.object({
      name: z.string()
      .min(1, 'Campo obligatorio, debe proporcionar un logo'),
    }),
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


const CompanyDataUpdateSchema = z.object({
    email: z.string({
        invalid_type_error: 'Correo electrónico no válido',
    }).email('Correo electrónico no válido'),
    socialName: z.string({
        invalid_type_error: 'Campo obligatorio',
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    name: z.string({
      invalid_type_error: 'Campo obligatorio',
      required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    cifnif: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio').refine(async (cifnif) => {
        const validate = await validateCIFNIFFormat(cifnif);
        return validate && validate.valid;
      }, {
        message: 'Formato inválido para NIF, NIE o CIF',
      }),
    landlinePhone: z.string({
        invalid_type_error: 'Número de teléfono no válido',
    }).nullable(),
    phone: z.string({
        invalid_type_error: 'Número de teléfono no válido',
    }).min(1, 'Número de teléfono no válido, campo obligatorio'),
    activityCode: z.string({
        required_error: 'Debe seleccionar una actividad. Obligatorio',
    }).min(1, 'Debe seleccionar una actividad. Obligatorio'),
    description: z.string({
        required_error: 'Campo obligatorio',
    }).min(1).max(250, 'Maximo 250 caracteres'),
    locationStreet: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    locationCity: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    locationState: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    locationCountryId: z.number({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),
    locationZip: z.string({
        required_error: 'Campo obligatorio',
    }).min(1, 'Campo obligatorio'),

});

export async function validateCompanyData(prevState: State, formData: Partial<SignUpCompanyFormData>) {
  const company = formData.company!;  
  
  const validatedFields = await FormCompanySchema.safeParseAsync({
      "company.email": company.email,
      "company.password": company.password,
      "company.confirmPassword": company.confirmPassword,
      "company.socialName": company.socialName,
      "company.comercialName": company.comercialName,
      "company.cifnif": company.cifnif,
      "company.activityType": company.activityType,
      "company.logo": company.logo ? company.logo : '', 
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

export async function validateCompanyDataUpdate(prevState: State, company: Partial<CompanyDefinitionDTO>): Promise<State> {
  
  const validatedFields = await CompanyDataUpdateSchema.safeParseAsync({
      email: company.email,
      socialName: company.socialName,
      name: company.name,
      cifnif: company.cifnif,
      activityCode: company.activityCode,
      landlinePhone: company.landlinePhone,
      phone: company.phone,
      description: company.description,
      locationStreet: company.locationStreet,
      locationCity: company.locationCity,
      locationState: company.locationState,
      locationCountryId: company.locationCountryId,
      locationZip: company.locationZip,
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


export async function validateContactData(prevState: State, formData: Partial<SignUpCompanyFormData>) {
  const contactInfo = formData.contactInfo!;

  const validatedFields = FormContactSchema.safeParse({
    streetAddress: contactInfo.streetAddress,
    zip: contactInfo.zip,
    country: contactInfo.country,
    province: contactInfo.province,
    locality: contactInfo.locality,
    mobilePhone: contactInfo.mobilePhone,
    landlinePhone: contactInfo.landlinePhone,
    website: contactInfo.website,
    contactEmail: contactInfo.contactEmail,
    description: contactInfo.description,
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

export async function validatePersonContactData(prevState: State, formData: Partial<SignUpCompanyFormData>) {
  const contactPerson = formData.contactPerson!;  
  const validatedFields = FormPersonContactSchema.safeParse({
    name: contactPerson.name,
    lastnames: contactPerson.lastnames,
    companyPosition: contactPerson.companyPosition,
    phoneNumber: contactPerson.phoneNumber,
    email: contactPerson.email,
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