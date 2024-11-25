import { AuthError, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserByEmail } from './lib/data/user';
import { signInSchema } from './lib/validations/loginValidations';
import bcrypt from 'bcryptjs';
import { User } from './lib/definitions';

const allowedUrls = ['/home', '/auth/login', '/auth/signup/company', '/auth/signup/candidate'];   

export default {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                let user = null;

                const {data, success } = await signInSchema.safeParseAsync(credentials);
                if (!success) {
                    throw new CustomError('Please provide an email and password', 'CredentialsSignin');
                }
                const { email, password } = data;
                if (!email || !password) {
                    throw new CustomError('Please provide an email and password', 'CredentialsSignin');
                }

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

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user: User | undefined = await getUserByEmail(email);
        
        if (!user) {
            throw new CustomError('No encontramos una cuenta con ese correo. ¿Te gustaría registrarte?', 'NoUserFound')
        }
        const userDef = {
            id: user.id,
            email: user.email,
            password: user.password,
            roleCode: user.roleCode,
        } as User;
        return userDef;
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