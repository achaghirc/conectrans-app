import prisma from "@/app/lib/prisma/prisma";
import { Role } from "../definitions";


export async function getRoleByCode(code: string): Promise<Role | null> {
    return await prisma.role.findFirst({
        where: {
            code: code,
        },
    });
}