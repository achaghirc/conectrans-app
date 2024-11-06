import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcryptjs';
import prisma from "@/app/lib/prisma/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            return createUserHandler(req, res);
        case 'GET':
            return getUserHandler(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function createUserHandler( req: NextApiRequest, res: NextApiResponse) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide an email and password' });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                roleId: 0,
                password: hashPassword,
                updatedAt: new Date(),
            },
        });
        return user;
    } catch (error) {
        res.status(400).json({ message: 'Email already in use', error});
    } 
}

async function getUserHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: 'Error getting users', error});
    }
}