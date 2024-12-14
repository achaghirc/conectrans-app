import { DefaultSession } from "next-auth";
import { User as BaseUser } from "@prisma/client";
declare module "next-auth" {
    interface Session {
        user: User
    }
    interface User extends BaseUser {
        roleCode?: string;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
    }
}
