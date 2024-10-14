import type { NextAuthConfig } from 'next-auth';

const allowedUrls = ['/', '/auth/login', '/auth/signup/company', '/auth/signup/candidate'];   

export const authConfig = {
    pages: {
        signIn: '/auth/login',
        signOut: '/',
        error: '/auth/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl }}){
            const isLoggedIn = !!auth?.user;
            console.log('isLoggedIn', isLoggedIn);
            if(allowedUrls.includes(nextUrl.pathname)){
                return true;
            }
            if (isLoggedIn){
                Response.redirect(new URL('/home', nextUrl));
                return true;
            } else {
                Response.redirect(new URL('/', nextUrl));
                return false;
            }
        },
    }, 
    providers: [],
} satisfies NextAuthConfig;