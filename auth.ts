import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

///Your own logic for dealing with plain text passwords strings; be careful with this
import { getUserByEmail } from './lib/data/user'
import {PrismaAdapter} from '@auth/prisma-adapter'
import prisma from './app/lib/prisma/prisma'
import authConfig from './auth.config'
import { getCompanyByUserId } from './lib/data/company'
import { getPersonByUserId } from './lib/data/person'
import { User } from '@prisma/client'

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await getUserByEmail(email);
        
        if (!user) {
            throw new CustomError('No encontramos una cuenta con ese correo. ¿Te gustaría registrarte?', 'NoUserFound')
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
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/login',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 1 * 24 * 60 * 60, //Duration of the session in seconds is 1 day
    },
    ...authConfig,
    callbacks: {
        //Jwt se ejecuta cada vez que se crea o actualiza un token
        //Se puede usar para agregar información adicional al token
        async jwt({ token, user }) {
          if (user) { // User is available during sign-in
            if(user.roleCode == 'COMPANY') {
              await getCompanyByUserId(user.id!).then((company) => {
                if(company) {
                  token.companyId = company.id;
                  token.name = company.name;
                  token.assetUrl = company.assetUrl;
                }
              });
            }
            if(user.roleCode == 'USER') {
              await getPersonByUserId(user.id!).then((person) => {
                if(person) {
                  token.personId = person.id;
                  token.name = person.name;
                  token.assetUrl = person.assetUrl;
                }
              });
            }
            token.id = user.id;
            token.role = user.roleCode;
            token.email = user.email;
          }
          return token
        },
        //session() se utiliza para agregar la información del usuario del token al objeto de sesión
        //La hace disponible en cliente
        session({ session, token }) {
          session.user.id = token.id as string
          session.user.roleCode = token.role as string
          session.user.email = token.email as string
          session.user.name = token.name as string
          session.user.assetUrl = token.assetUrl as string
          session.user.companyId = token.companyId as number
          session.user.personId = token.personId as number
          return session
        },
      },
})


class CustomError extends Error {
    public name: string;
    constructor(message: string, name: string) {
        super(message);
        this.name = name;
    }
}