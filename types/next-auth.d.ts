import { DefaultSession } from "next-auth";
import { UserDTO } from "@prisma/client";
declare module "next-auth" {
    interface Session {
        user: UserDTO
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
