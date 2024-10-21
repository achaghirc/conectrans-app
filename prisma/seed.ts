import prisma from '../app/lib/prisma/prisma'
import bcrypt from 'bcrypt';
const seedUsers = () => {
    return [
        {
            name: 'Alice',
            email: '',
            password: bcrypt.hashSync('123456', 10),
            updatedAt: new Date(),
            roleId: 1,
        },
    ];
}

const seedActivityType = () => {
    return [
        {
            name: 'Transporte',
            code: 'TRANSPORT',
            description: 'Transporte de mercancías',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Transporte & Logistica',
            code: 'TRANSPORT_LOGISTIC',
            description: 'Transporte de mercancías y logística',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Transporte & Gestión de residuos',
            code: 'TRANSPORT_TRASH_MANAGEMENT',
            description: 'Transporte de mercancías y gestión de residuos',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Otro',
            code: 'OTHER',
            description: 'Otro tipo de actividad',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];
}

const seedRoles = () => {
    return [
        {
            name: 'Admin',
            code: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Company',
            code: 'COMPANY',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'User',
            code: 'USER',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

}

const seedDataUsers = async () => {
    const users = seedUsers();
    for (const user of users) {
        await prisma.user.create({
            data: user,
        });
    }
}

const seedDataActivityType = async () => {
    const activityTypes = seedActivityType();
    for (const activityType of activityTypes) {
        await prisma.activity.create({
            data: activityType,
        });
    }
}

const seedDataRoles = async () => {
    const roles = seedRoles();
    for (const role of roles) {
        await prisma.role.create({
            data: role,
        });
    }
}

async function main() {
    await seedDataUsers();
    await seedDataActivityType();
    await seedDataRoles();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });