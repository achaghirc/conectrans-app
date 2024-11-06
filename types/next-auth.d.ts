import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            roleCode?: string;
        } & DefaultSession["user"];
    }
    interface User {
        roleCode?: string;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
    }
}
