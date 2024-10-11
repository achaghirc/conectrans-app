import bcrypt from 'bcrypt';
import z from 'zod';
import { User } from "@/lib/definitions";
import prisma from '@/app/lib/prisma/prisma';

const createUserSchema = z.object({
    email: z.string({
        invalid_type_error: 'Please provide a valid email',
    }).email(),
    password: z.string({
        invalid_type_error: 'Please provide a valid password',
    }).min(6),
});


export async function createUserHandler(
    formData: FormData
) :Promise<User | string> {
    try {
        const validatedData = createUserSchema.safeParse({
            email: formData.get('email'),
            password: formData.get('password')});
        
        if (!validatedData.success) {
            return validatedData.error.message;
        }

        const hashPassword = await bcrypt.hash(validatedData.data?.password, 10);
        const user = await prisma.user.create({
            data: {
                email: validatedData.data?.email,
                password: hashPassword,
                updatedAt: new Date(),
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
        });
        if (!user) {
            return undefined;
        }
        return user as User;
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