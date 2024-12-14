import { EncoderType, Role } from '@prisma/client';
import { Plan }from '../lib/definitions';
import prisma from '../app/lib/prisma/prisma'

import bcrypt from 'bcryptjs';
const seedUsers = (role: Role) => {
    return [
        {
            name: 'Amine',
            email: 'amine1@gmail.com',
            password: bcrypt.hashSync('09092286', 10),
            updatedAt: new Date(),
            roleId: role.id,
        },
    ];
}

const seedEncodersType = () => {
  return [
    {name: 'B', code: 'B', type: 'CARNET'},
    {name: 'C1', code: 'C1', type: 'CARNET'},
    {name: 'C1+E', code: 'C1E', type: 'CARNET'},
    {name: 'C', code: 'C', type: 'CARNET'},
    {name: 'C+E', code: 'CE', type: 'CARNET'},
    {name: 'D1', code: 'D1', type: 'CARNET'},
    {name: 'D1+E', code: 'D1E', type: 'CARNET'},
    {name: 'D', code: 'D', type: 'CARNET'},
    {name: 'D+E', code: 'DE', type: 'CARNET'},
    {name: 'Internacional', code: 'INTERNATIONAL', type: 'WORK_SCOPE'},
    {name: 'Nacional', code: 'NATIONAL', type: 'WORK_SCOPE'},
    {name: 'Regional', code: 'REGIONAL', type: 'WORK_SCOPE'},
    {name: 'Local', code: 'LOCAL', type: 'WORK_SCOPE'},
    {name: 'Autónomo', code: 'AUTONOMUM', type: 'EMPLOYEE_TYPE'},
    {name: 'Asaliariado', code: 'SALARY', type: 'EMPLOYEE_TYPE'},
    {name: 'Rígido Otros', code: 'OTHER_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido General', code: 'GENERAL_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido Pluma', code: 'CRANE_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido Paquetero', code: 'PACK_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido Obra', code: 'WORK_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido Multilift', code: 'MULTILIFT_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido Hormigonera', code: 'CONCRETE_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido Grúa coches', code: 'CAR_CRANE_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido Cisterna', code: 'CISTERN_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido Botellero', code: 'BOTTLE_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido Basuras', code: 'GARBAGE_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido Tauliner/Lona', code: 'TAULINER_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Rígido Frigorífico', code: 'FRIGORIFIC_SOLID', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Otros', code: 'OTHER_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer General', code: 'GENERAL_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Transporte Especial', code: 'SPECIAL_TRANSPORT_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Portavehículos', code: 'VEHICLE_CARRIER_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Portacontenedores', code: 'CONTAINER_CARRIER_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Porta Bobinas', code: 'COIL_CARRIER_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Plataforma', code: 'PLATFORM_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Piso móvil', code: 'MOVING_FLOOR_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Paquetero', code: 'PACK_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Mega Camión', code: 'MEGA_TRUCK_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Ganado', code: 'LIVESTOCK_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Cisterna NO alimentarios', code: 'NON_FOOD_TANK_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Cisterna Alimentarios', code: 'FOOD_TANK_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Basculantes', code: 'TIPPING_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Bañera', code: 'TUB_TRAILER', type: 'EXPERIENCE_TYPE'}, 
    {name: 'Trailer Tautliner/Lona', code: 'TAUTLINER_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'Trailer Frigorífico', code: 'FRIGORIFIC_TRAILER', type: 'EXPERIENCE_TYPE'},
    {name: 'ADR Básico', code: 'BASIC_ADR', type: 'CARNET_ADR'},
    {name: 'ADR Cisternas', code: 'TANK_ADR', type: 'CARNET_ADR'},
    {name: 'ADR Explosivos', code: 'EXPLOSIVE_ADR', type: 'CARNET_ADR'},
    {name: 'ADR Radiactivos', code: 'RADIOACTIVE_ADR', type: 'CARNET_ADR'},
    {name: 'Acceso Limitado', code: 'LIMITED_ACCESS', type: 'PLAN_PREFERENCES'},
    {name: 'Acceso Ilimitado', code: 'TOTAL_ACCESS', type: 'PLAN_PREFERENCES'},
    {name: 'Una Oferta', code: 'ONE_OFFER', type: 'PLAN_PREFERENCES'},
    {name: 'Tres Ofertas', code: 'THREE_OFFER', type: 'PLAN_PREFERENCES'},
    {name: 'Doce Ofertas (1/mes)', code: 'TWELVE_OFFER', type: 'PLAN_PREFERENCES'},
    {name: 'Oferta Destacada', code: 'HIGHLIGHTED_OFFER', type: 'PLAN_PREFERENCES'},
    {name: 'Oferta Anónima', code: 'ANONYMOUS_OFFER', type: 'PLAN_PREFERENCES'},
    {name: 'Ofertas Editables', code: 'EDITABLE_OFFER', type: 'PLAN_PREFERENCES'},
    {name: 'Visualización de ofertas', code: 'OFFER_VISUALIZATION', type: 'PLAN_PREFERENCES'},
  ]
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

const seedLanguages = () => {
  return [
    {  name: 'Español',  code: 'ES'},
    {  name: 'Inglés',  code: 'EN'},
    {  name: 'Francés',  code: 'FR'},
    {  name: 'Alemán',  code: 'DE'},
    {  name: 'Chino',  code: 'ZH'},
    {  name: 'Japonés',  code: 'JA'},
    {  name: 'Ruso',  code: 'RU'},
    {  name: 'Árabe',  code: 'AR'},
    {  name: 'Portugués',  code: 'PT'},
    {  name: 'Hindú',  code: 'HI'},
  ]
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

const seedPlanPreferences = async () => {
  const listFree = ["LIMITED_ACCESS", "OFFER_VISUALIZATION"];
  const listBasic = ["ONE_OFFER","TOTAL_ACCESS"];
  const listStandard = ["THREE_OFFER","TOTAL_ACCESS"];
  const listPremium = ["TWELVE_OFFER","HIGHLIGHTED_OFFER","ANONYMOUS_OFFER","EDITABLE_OFFER", "TOTAL_ACCESS"];

  const savedEncoders = await prisma.encoderType.findMany({
      where: {
          type: 'PLAN_PREFERENCES'
      }
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

const seedDataUsers = async (roles: Role[]) => {
  const role: Role | undefined = roles.find(role => role.code === 'ADMIN');
  if(!role) {
    throw new Error('Role not found');
  }
  const users = seedUsers(role);
  const usersSave = await prisma.user.createManyAndReturn({
      data: users,
  });
  const savedUser = usersSave[0];
  const location = {
    street: 'Calle',
    number: '1',
    city: 'Ciudad',
    state: 'Estado',
    countryId: 64,
    countryName: 'España',
    countryCode: 'ES',
    zip: '12345',
    latitude: 0,
    longitude: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const savedLocation = await prisma.location.create({
    data: location
  });
  const person = {
    name: 'Amine',
    lastname: 'Chaghir',
    userId: savedUser.id,
    birthDate: new Date(),
    email: savedUser.email,
    phone: '123456789',
    landlinePhone: '123456789',
    document: '09092286H',
    createdAt: new Date(),
    updatedAt: new Date(),
    relocateOption: false, 
    hasCar: false,
    assetUrl: null,
    resumeId: null,
    locationId: savedLocation.id,
  }
  await prisma.person.create({
    data: person,
  });
}

const seedDataActivityType = async () => {
  const activityTypes = seedActivityType();
  await prisma.activity.createMany({
      data: activityTypes,
  });
}

const seedDataRoles = async () => {
  const roles = seedRoles();
  return await prisma.role.createManyAndReturn({
      data: roles,
  });
}
const seedDataLanguages = async () => {
  const languages = seedLanguages();
  await prisma.languages.createMany({
      data: languages,
  });
}

const seedDataEncodersType = async () => {
  const encoders = seedEncodersType();
  await prisma.encoderType.createMany({
      data: encoders,
  });
}


async function main() {
  // const roles = await seedDataRoles();
  await seedPlanPreferences()
  // await Promise.all([
  //   //seedDataEncodersType(),
  //   //seedDataActivityType(),
  //   // seedDataUsers(roles),
  //   // seedDataLanguages(),
  // ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });