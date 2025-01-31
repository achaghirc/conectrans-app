'use server';

import { signIn, signOut} from "@/auth";
import { AuthError } from "next-auth";
import { AuthenticateMessage, ValidationCIFNIFResult } from "./definitions";



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
): Promise<AuthenticateMessage | undefined> {
    try {
        await signIn('credentials', {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            redirect: false,
        });
        return { message: 'Logged in successfully', type: 'Success', success: true };
    } catch (error: any) {
        if(error instanceof AuthError) {
            const authErr: AuthenticateMessage = {
              success: false,
            } as AuthenticateMessage;
            switch (error.name) {
                case 'NoUserFound':
                    authErr.message= error.message ?? 'No user found with that email';
                    authErr.type= 'email';
                    return authErr;
                case 'PasswordIncorrect':
                    authErr.message= error.message ?? 'Incorrect password provided. Please try again.';
                    authErr.type= 'password';
                    return authErr;
                case 'CredentialsSignin':
                    authErr.message= error.message ?? 'Please provide an email and password';
                    authErr.type= 'email';
                    return authErr;
                case 'AccessDenied':
                    authErr.message= error.message ?? 'Access denied';
                    authErr.type= 'general';
                    return authErr;
                case 'CallbackRouteError':
                    authErr.message= error.cause?.err?.message ?? 'Error with user login';
                    authErr.type= 'general';
                    return authErr;
                default:
                  return {
                      message: 'An error occurred while signing in. Please try again.',
                      type: 'general',
                      success: false,                     
                  }
            }
        }
    }
}

export async function logout(): Promise<void> {
    await signOut({ redirectTo: '/', redirect: true });
}