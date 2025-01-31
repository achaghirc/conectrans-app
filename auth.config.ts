import { AuthError, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserByEmail } from './lib/data/user';
import bcrypt from 'bcryptjs';
import { UserDTO } from '@prisma/client';

export default {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                let user = null;

                const data = {
                    email: credentials.email as string,
                    password: credentials.password as string,
                }
                const { email, password } = data;

                user = await getUser(email.toString());
                if (!user) {
                    throw new CustomError('No encontramos una cuenta con ese correo. ¿Te gustaría registrarte?', 'NoUserFound')
                }
                
                const passwordHash = await bcrypt.compare(password.toString(), user.password)
                if (!passwordHash) {
                    throw new CustomError('La contraseña proporcionada es incorrecta. Por favor, inténtalo de nuevo.', 'PasswordIncorrect')
                }
                return user;
            },
        }),
    ]
} satisfies NextAuthConfig;

async function getUser(email: string): Promise<UserDTO | undefined> {
    try {
        const user: UserDTO | undefined = await getUserByEmail(email);
        
        if (!user) {
            throw new CustomError('No encontramos una cuenta con ese correo. ¿Te gustaría registrarte?', 'NoUserFound')
        }
       return user;
    } catch (error) {
        console.error(error);
        return undefined;
    }

}

class CustomError extends AuthError {
    public name: string;
    public message: string;
    constructor(message: string, name: string) {
        super();
        this.message = message;
        this.name = name;
    }
}