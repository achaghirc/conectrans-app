import { EncoderType } from '@prisma/client';
import { Plan }from '../lib/definitions';
import prisma from '../app/lib/prisma/prisma'

import bcrypt from 'bcryptjs';
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

const seedPlanPreferences = async () => {
    // INSERT INTO "EncoderType" (id, "name", code, "type") VALUES (48, 'Acceso Limitado', 'LIMITED_ACCESS', 'PLAN_PREFERENES');
    // INSERT INTO "EncoderType" (id, "name", code, "type") VALUES (49, 'Acceso Ilimitado', 'TOTAL_ACCESS', 'PLAN_PREFERENES');
    // INSERT INTO "EncoderType" (id, "name", code, "type") VALUES (50, 'Una Oferta', 'ONE_OFFER', 'PLAN_PREFERENES');
    // INSERT INTO "EncoderType" (id, "name", code, "type") VALUES (51, 'Tres Ofertas', 'THREE_OFFER', 'PLAN_PREFERENES');
    // INSERT INTO "EncoderType" (id, "name", code, "type") VALUES (52, 'Doce Ofertas (1/mes)', 'TWELVE_OFFER', 'PLAN_PREFERENES');
    // INSERT INTO "EncoderType" (id, "name", code, "type") VALUES (53, 'Oferta Destacada', 'HIGHLIGHTED_OFFER', 'PLAN_PREFERENES');
    // INSERT INTO "EncoderType" (id, "name", code, "type") VALUES (54, 'Oferta Anónima', 'ANONYMOUS_OFFER', 'PLAN_PREFERENES');
    // INSERT INTO "EncoderType" (id, "name", code, "type") VALUES (55, 'Ofertas Editables', 'EDITABLE_OFFER', 'PLAN_PREFERENES');
    // INSERT INTO "EncoderType" (id, "name", code, "type") VALUES (57, 'Visualización de ofertas', 'OFFER_VISUALIZATION', 'PLAN_PREFERENES');

    const listFree = ["LIMITED_ACCESS", "OFFER_VISUALIZATION"];
    const listBasic = ["ONE_OFFER","TOTAL_ACCESS"];
    const listStandard = ["THREE_OFFER","TOTAL_ACCESS"];
    const listPremium = ["TWELVE_OFFER","HIGHLIGHTED_OFFER","ANONYMOUS_OFFER","EDITABLE_OFFER", "TOTAL_ACCESS"];

    const encoderTypes = [
        {   
            id: 49,
            name: 'Acceso Limitado',
            code: 'LIMITED_ACCESS',
            type: 'PLAN_PREFERENCES',
        },
        {
            id: 50,
            name: 'Acceso Ilimitado',
            code: 'TOTAL_ACCESS',
            type: 'PLAN_PREFERENCES',
        },
        {
            id: 51,
            name: 'Una Oferta',
            code: 'ONE_OFFER',
            type: 'PLAN_PREFERENCES',
        },
        {
            id: 52,
            name: 'Tres Ofertas',
            code: 'THREE_OFFER',
            type: 'PLAN_PREFERENCES',
        },
        {
            id: 53,
            name: 'Doce Ofertas (1/mes)',
            code: 'TWELVE_OFFER',
            type: 'PLAN_PREFERENCES',
        },
        {
            id: 54,
            name: 'Oferta Destacada',
            code: 'HIGHLIGHTED_OFFER',
            type: 'PLAN_PREFERENCES',
        },
        {
            id: 55,
            name: 'Oferta Anónima',
            code: 'ANONYMOUS_OFFER',
            type: 'PLAN_PREFERENCES',
        },
        {
            id: 56,
            name: 'Ofertas Editables',
            code: 'EDITABLE_OFFER',
            type: 'PLAN_PREFERENCES',
        }
    ]

    const alreadyExists = await prisma.encoderType.findMany({
        where: {
            type: 'PLAN_PREFERENCES'
        }
    });
    let encoders = encoderTypes;
    console.log('alreadyExists', alreadyExists);
    if (alreadyExists.length > 0) {
        const setEncoders = new Set<string>(encoderTypes.map(encoderType => encoderType.code));
        const distinctEncoders:EncoderType[] = alreadyExists.filter(encoderType => !setEncoders.has(encoderType.code));
        console.log('distinctEncoders', distinctEncoders);
        encoders = distinctEncoders;
    }
    const savedEncoders: EncoderType[] = await prisma.encoderType.createManyAndReturn({
        data: encoders
    });

    const plans: Plan[] = generatePlans();
    const plansToSave = plans.map(({ id,planPreferences, ...rest }) => rest);
   for (const plan of plansToSave) {
        const planSaved = await prisma.plan.create({
            data: plan,
        });
        if (planSaved.title === 'Gratuito') {
            const planPreferences = savedEncoders.filter(encoderType => listFree.includes(encoderType.code));
            for (const encoderType of planPreferences) {
                await prisma.planPreferences.create({
                    data: {
                        preferencePlanId: encoderType.id,
                        planId: planSaved.id
                    }
                });
            }
        }
        if (planSaved.title === 'Básico') {
            const planPreferences = savedEncoders.filter(encoderType => listBasic.includes(encoderType.code));
            for (const encoderType of planPreferences) {
                await prisma.planPreferences.create({
                    data: {
                        preferencePlanId: encoderType.id,
                        planId: planSaved.id
                    }
                });
            }
        }
        if (plan.title === 'Estándar') {
            const planPreferences = savedEncoders.filter(encoderType => listStandard.includes(encoderType.code));
            for (const encoderType of planPreferences) {
                await prisma.planPreferences.create({
                    data: {
                        preferencePlanId: encoderType.id,
                        planId: planSaved.id,
                    }
                });
            }
        }
        if (plan.title === 'Premium') {
            const planPreferences = savedEncoders.filter(encoderType => listPremium.includes(encoderType.code));
            for (const encoderType of planPreferences) {
                await prisma.planPreferences.create({
                    data: {
                        preferencePlanId: encoderType.id,
                        planId: planSaved.id,
                    }
                });
            }
        }
    }
}

const generatePlans = (): Plan[] => {
    const planFree = {
        id: 1,
        title: "Gratuito",
        description: "Plan gratuito con acceso limitado",
        price: 0,
        priceMonthly: 0,
        priceYearly: 0,
        priceBianual: 0,
        currency: '€',
        maxOffers: 0,
        allowEditOffer: false,
        accessLimited: true,
        planPreferences: []
    };
    const planBasic = {
        id: 2,
        title: "Básico",
        description: "Plan básico con acceso ilimitado",
        price: 200,
        priceMonthly: 200,
        priceYearly: 0,
        priceBianual: 0,
        currency: '€',
        maxOffers: 1,
        allowEditOffer: false,
        accessLimited: false,
        planPreferences: []
    };
    const planStandard = {
        id: 3,
        title: "Estándar",
        description: "Plan estándar con acceso ilimitado",
        price: 450,
        priceMonthly: 450,
        priceYearly: 0,
        priceBianual: 0,
        currency: '€',
        maxOffers: 3,
        allowEditOffer: false,
        accessLimited: false,
        planPreferences: []
    };
    const planPremium = {
        id: 4,
        title: "Premium",
        description: "Plan premium con acceso ilimitado",
        price: 1400,
        priceMonthly: 120,
        priceBianual: 600,
        priceYearly: 1400,
        currency: '€',
        maxOffers: 12,
        allowEditOffer: true,
        accessLimited: false,
        planPreferences: []
    };

    return [planFree, planBasic, planStandard, planPremium];
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
    //await seedDataUsers();
    //await seedDataActivityType();
    //await seedDataRoles();
    await seedPlanPreferences();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });