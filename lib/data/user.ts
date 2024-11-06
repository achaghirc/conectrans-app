'use server';
import bcrypt from 'bcryptjs';
import z from 'zod';
import prisma from '@/app/lib/prisma/prisma';
import { getRoleByCode } from './role';
import { NavbarSessionData, PersonDTO, User } from '../definitions';
import { getCompanyByUserId } from './company';
import { CompanyDTO } from '../definitions';
import { getPersonByUserId } from './person';

const createUserSchema = z.object({
    email: z.string({
        invalid_type_error: 'Please provide a valid email',
    }).email(),
    password: z.string({
        invalid_type_error: 'Please provide a valid password',
    }).min(6),
});


export async function createUserHandler(
    formData: FormData,
    roleCode?: string,
) :Promise<User | string> {
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

export async function getUserByEmail(email: string): Promise<User | undefined> {  
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
        return {...user, roleCode: user.Role.code};

    } catch (error) {
        throw new Error(`Error getting users ${error}`);
    }
}

async function getAllUsers(): Promise<User[] | string> {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        return `Error getting users ${error}`;
    }
}

async function getUserById(id: string): Promise<User | string> {
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

export async function getUserDataSideNav(id: string): Promise<NavbarSessionData | undefined> {
    try {
        const responseUser : User | String = await getUserById(id);
        if (typeof responseUser === 'string') {
            return undefined;
        }
        const user: User = responseUser as User;
        let data : NavbarSessionData= {} as NavbarSessionData;
        switch (user.roleCode) {
            case 'COMPANY':
                const company: CompanyDTO | undefined = await getCompanyByUserId(user.id!);
                if (!company) {
                    return undefined;
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
                    return undefined;
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