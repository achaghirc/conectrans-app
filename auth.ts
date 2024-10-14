import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

///Your own logic for dealing with plain text passwords strings; be careful with this
import bcrypt from 'bcrypt'
import { getUserByEmail } from './lib/data/user'
import { User } from './lib/definitions'
import prisma from './app/lib/prisma/prisma'
import { authConfig } from './auth.config'

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await getUserByEmail(email);
        
        if (!user) {
            return undefined;
        }
    
        const userDef = {
            id: user.id?.toString(),
            email: user.email,
            password: user.password,
        } as User;
        return userDef;
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while fetching the user');
    }

}

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {
                let user = null;
                const email = credentials.email
                const password = credentials.password
                if (!email || !password) {
                    throw new Error('Please provide an email and password')
                }

                user = await getUser(email.toString());
                if (!user) {
                    throw new CustomError('No encontramos una cuenta con ese correo. ¿Te gustaría registrarte?', 'NoUserFound')
                }
                
                const passwordHash = await bcrypt.compare(password.toString(), user.password)
                if (!passwordHash) {
                    throw new CustomError('La contraseña proporcionada es incorrecta. Por favor, inténtalo de nuevo.', 'PasswordIncorrect')
                }
                return user
            },
        }),
    ],
})

class CustomError extends Error {
    public name: string;
    constructor(message: string, name: string) {
        super(message);
        this.name = name;
    }
}