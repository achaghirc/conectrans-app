'use server';
import bcrypt from 'bcryptjs';
import z from 'zod';
import prisma from '@/app/lib/prisma/prisma';
import { getRoleByCode } from './role';
import { AccountForm, CompanyUserAccountDTO, PersonDTO, State } from '../definitions';
import { getCompanyByUserId } from './company';
import { CompanyDTO } from '../definitions';
import { getPersonByUserId } from './person';
import { NavbarSessionData } from '../types/nav-types';
import { User, UserDTO } from '@prisma/client';

const updateUserSchema = z.object({
    email: z.string({
        invalid_type_error: 'Por favor, introduce un correo electrónico válido',
    }).email(),
    password: z.string({
        invalid_type_error: 'Por favor, introduce una contraseña válida',
    }).min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const createUserSchema = z.object({
  email: z.string({
      invalid_type_error: 'Por favor, introduce un correo electrónico válido',
  }).email('Correo electrónico no válido, Pej: example@dominio.com').refine(async (email) => {
    const user = await getUserByEmail(email);
    return !user;
  }, {
    message: 'El correo electrónico ya está en uso',
  }),
  password: z.string({
      invalid_type_error: 'Por favir, introduce una contraseña válida',
  }).min(6, 'La contraseña debe tener al menos 6 caracteres'),
});


export async function createUserHandler(
    formData: FormData,
    roleCode?: string,
) :Promise<UserDTO | string> {
    try {
        const validatedData = createUserSchema.safeParse({
            email: formData.get('email'),
            password: formData.get('password')});
        
        if (!validatedData.success) {
            return validatedData.error.message;
        }
        let role;
        if(roleCode) {
            role = await getRoleByCode(roleCode);
        } else {
            role = await getRoleByCode('USER');
        }
        if (!role) {
            return 'Role not found';
        }

        const hashPassword = await bcrypt.hash(validatedData.data?.password, 10);
        const user = await prisma.user.create({
            data: {
                email: validatedData.data?.email,
                password: hashPassword,
                updatedAt: new Date(),
                roleId: role?.id as number,
            },
        });
        return user;
    } catch (error) {
        return `Email already in use ${error}`;
    } 
}

export async function updateUserHandler(prevState: State, userData:UserDTO, changedForm: AccountForm, actualEmail: string): Promise<UserDTO | State> {
  const validatedData = await createUserSchema.safeParseAsync({
    email: changedForm.email ? userData.email : 'example@gmail.com',
    password: userData.password
  });
  
  if (!validatedData.success) {
      return {
          ...prevState,
          errors: validatedData.error.errors,
          message: 'Error en los campos del formulario',
      };
      
  }
  const hashPassword = await bcrypt.hash(validatedData.data?.password, 10);
  
  const data: Partial<UserDTO> = {
    email: validatedData.data?.email,
    updatedAt: new Date()
  }
  if (userData.password && changedForm.password) {
    data.password = hashPassword;
  }
  
  const user: UserDTO = await prisma.user.update({
    where: {
      email: actualEmail
    },
    data: {
      email: userData.email,
      password: hashPassword,
      updatedAt: new Date()
    }
  })

  const updatedUser = await getUserByEmail(userData.email);
  return updatedUser as UserDTO;  
}

export async function getUserByEmail(email: string): Promise<UserDTO | undefined> {  
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                Role: {
                    select: {
                        code: true,
                    },
                }
            },
        });
        if (!user) {
            return undefined;
        }
        return {...user, roleCode: user.Role.code} as UserDTO;

    } catch (error) {
        throw new Error(`Error getting users ${error}`);
    }
}

async function getAllUsers(): Promise<UserDTO[] | string> {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        return `Error getting users ${error}`;
    }
}

async function getUserById(id: string): Promise<UserDTO | string> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                Role: {
                    select: {
                        code: true,
                    },
                },
            },
        });
        if (!user) {
            return 'User not found';
        }
        return {...user, roleCode: user.Role.code};
    } catch (error) {
        return `Error getting user ${error}`;
    }
}

//Unused
export async function getUserDataSideNav(id: string): Promise<NavbarSessionData> {
    try {
        const responseUser : UserDTO | String = await getUserById(id);
        if (typeof responseUser === 'string') {
            return {} as NavbarSessionData;
        }
        const user: UserDTO = responseUser as UserDTO;
        let data : NavbarSessionData= {} as NavbarSessionData;
        switch (user.roleCode) {
            case 'COMPANY':
                const company: CompanyDTO | undefined = await getCompanyByUserId(user.id!);
                if (!company) {
                    return {} as NavbarSessionData;
                }
                data = {...data, 
                    name: company.name,
                    email: user.email,
                    role: user.roleCode,
                    companyId: company.id!,
                    userId: user.id,
                    assetUrl: company.assetUrl!,
                };
                break;
            case 'ADMIN':
                break;
            case 'USER':
                const personData : PersonDTO | undefined = await getPersonByUserId(user.id!);
                if (!personData) {
                    return {} as NavbarSessionData;
                }
                data= {...data,
                    name: personData.name,
                    email: user.email,
                    role: user.roleCode!,
                    companyId: 0,
                    userId: user.id,
                    assetUrl: personData.assetUrl!,
                };
                break;
        }

        return data;
    } catch (error) {
        throw new Error(`Error getting user ${error}`);
    }
}

export async function getCompanyUserAccountData(id: string): Promise<CompanyUserAccountDTO | undefined> {
    try {
        const responseUser : UserDTO | String = await getUserById(id);
        if (typeof responseUser === 'string') {
            return undefined;
        }
        const user: UserDTO = responseUser as UserDTO;
        if (user.roleCode !== 'COMPANY') {
            return undefined;
        }
        const company: CompanyDTO | undefined = await getCompanyByUserId(user.id!);
        if (!company) {
            return undefined;
        }
        const response : CompanyUserAccountDTO = {
            userEmail: user.email,
            userPassword: user.password,
            contactPersonName: company.contactPersonName ?? '',
            contactPersonLastname: company.contactPersonLastname ?? '',
            contactPersonPhone: company.contactPersonPhone ?? '',
            contactPersonDocument: company.contactPersonDocument ?? '',
            contactPersonCompanyPosition: company.contactPersonCompanyPosition ?? '',
            contactPersonEmail: company.contactPersonEmail ?? '',
        }
        return response;
    } catch (error) {
        throw `Error getting user ${error}`;
    }
}

export async function checkPasswordUser(email: string, password: string | undefined): Promise<boolean> {
  let res: boolean = false;
  if (!password) return res;
  const user: UserDTO | undefined = await getUserByEmail(email);
  if(!user) {
    return res;
  }
  const passwordHash = await bcrypt.compare(password.toString(), user.password)
  if (passwordHash) {
      res = true;
  }
  return res;

}