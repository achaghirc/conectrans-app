'use server';
import { z, ZodIssue } from "zod"
import { State } from "../definitions"
import { getUserByEmail } from "../data/user";
 
const SignInSchema = z.object({
  email: z.string({ required_error: "Introduce tu correo electrónico" })
    .min(1, "Correo electrónico es necesario")
    .email("Correo electrónico incorrecto")
    .refine(async (email) => {
            const user = await getUserByEmail(email);
            return user;
        }, {
            message: 'El correo electrónico no existe',
        }),
  password: z.string({ required_error: "Contraseña obligatoria" })
    .min(1, "Contraseña es necesaria")
})


export async function validateSignInData(state: State, data: FormData): Promise<State> {
  try {
    const password = data.get('password') != undefined ? data.get('password') as string : '';
    const validate = await SignInSchema.safeParseAsync({
      email: data.get('email') as string,
      password: password
    })
    if (!validate.success) {
      return { message: 'Error', errors: validate.error.errors }
    }
    return { message: '', errors: [] }
  } catch (error) {
    const errorGeneral: ZodIssue = {
      code: 'invalid_literal',
      expected: '',
      received: '',
      path: ['general'],
      message: 'An error occurred while signing in. Please try again.'
    }
    return { message: 'Error', errors: [errorGeneral] }
  }
}