'use server';

import { CloudinaryUploadResponse, EducationDTO, ExperienceDTO, Licence, PersonLanguageDTO, Role, SignUpCandidateFormData, SignUpCompanyFormData, State } from "../definitions";
import { User } from "../definitions";
import prisma from "@/app/lib/prisma/prisma";
import { getRoleByCode } from "../data/role";
import bcrypt from 'bcryptjs';
import { randomUUID } from "crypto";
import { getPlanById } from "../data/plan";
import { Asset, EncoderType, Languages, PersonLanguages, PrismaClient, Subscription } from "@prisma/client";
import next from "next";
import { takeNumberFromString } from "../utils";



//This method creates in database a new company, new user and new contact person
export async function companySignUp(formData: SignUpCompanyFormData, cloudinaryResponse: CloudinaryUploadResponse | null): Promise<User | undefined> {
  const { company, contactInfo, contactPerson, subscriptionPlan } = formData;

	const role: Role | null = await getRoleByCode('COMPANY');
	
	if (!role) {
		throw new Error('Role not found');
	}
	// Find activity
	const activity = await prisma.activity.findFirst({
		where: {
			code: company.activityType
		}
	});
	if (!activity) {
		throw new Error('Activity not found');
	}
  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      // Create new user
      const user = {
        email: company.email,
        password: bcrypt.hashSync(company.password, 10),
        roleId: role.id ?? 2, //2 is the default value for company role
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newUser = await prisma.user.create({
        data: user
      });

      // Create new location
      const location = {
        street: contactInfo.streetAddress,
        number: takeNumberFromString(contactInfo.streetAddress).toString() ?? 'S/N',
        city: contactInfo.locality,
        state: contactInfo.province,
        zip: contactInfo.zip,
        latitude: 0,
        longitude: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        Country: {
          connect: { id: contactInfo.country }
        }
      };

      const newLocation = await prisma.location.create({
        data: location
      });

      // Create new contact person
      const contactPersonData = {
        name: contactPerson.name,
        lastname: contactPerson.lastnames,
        phone: contactPerson.phoneNumber,
        document: null,
        companyPosition: contactPerson.companyPosition,
        email: contactPerson.email,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newContactPerson = await prisma.contactPerson.create({
        data: contactPersonData
      });

      let newAsset = null;
      // Upload company logo to Cloudinary
      if (cloudinaryResponse !== null) {
        const asset = {
          publicId: cloudinaryResponse.public_id,
          secureUrl: cloudinaryResponse.secure_url,
          url: cloudinaryResponse.url,
          width: cloudinaryResponse.width,
          height: cloudinaryResponse.height,
          format: cloudinaryResponse.format,
          originalFilename: cloudinaryResponse.original_filename,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        newAsset = await prisma.asset.create({
          data: asset
        });
      }

      // Create new company
      const companyData = {
        name: company.comercialName,
        socialName: company.socialName,
        description: contactInfo.description,
        landlinePhone: contactInfo.landlinePhone,
        phone: contactInfo.mobilePhone,
        cifnif: company.cifnif,
        email: contactInfo.contactEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
        Activity: {
          connect: { id: activity.id }
        },
        User: {
          connect: { id: newUser.id }
        },
        Location: {
          connect: { id: newLocation.id }
        },
        ContactPerson: {
          connect: { id: newContactPerson.id }
        },
        ...(newAsset && { 
          Asset: {
            connect: { id: newAsset.id }
        }}),
      };

      await prisma.company.create({
        data: companyData
      });

      return newUser;
    } catch (error: any) {
      console.log(error);
      return {} as User;
    }
  });
  console.log(transaction);
  return transaction;
}

export async function candidateSingup(formData: SignUpCandidateFormData, cloudinaryResponse: CloudinaryUploadResponse| null): Promise<State> {
  const { 
    email, 
    password, 
    cifnif, 
    name,
    lastname, 
    birthdate,
    workRange,
    employeeType,
    contactInfo, 
    experiences, 
    licence,
    educations,
    languages
  } = formData;

  const role: Role | null = await getRoleByCode('USER');

  if (!role) {
    throw new Error('Role not found');
  }

  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      // Create new user
      const user = {
        email: email,
        password: bcrypt.hashSync(password, 10),
        roleId: role.id ?? 3, //3 is the default value for user role
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newUser = await prisma.user.create({
        data: user
      });

      // Create new location
      const location = {
        street: contactInfo.streetAddress,
        number: takeNumberFromString(contactInfo.streetAddress).toString() ?? 'S/N',
        city: contactInfo.locality,
        state: contactInfo.province,
        countryId: contactInfo.country,
        zip: contactInfo.zip,
        latitude: 0,
        longitude: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newLocation = await prisma.location.create({
        data: location
      });


      let newAsset = null;
      // Save asset cv summary to database if exists in cloudinary
      if (cloudinaryResponse) {
				const asset = {
					publicId: cloudinaryResponse.public_id,
					secureUrl: cloudinaryResponse.secure_url,
					url: cloudinaryResponse.url,
					width: cloudinaryResponse.width,
					height: cloudinaryResponse.height,
					format: cloudinaryResponse.format,
          originalFilename: cloudinaryResponse.original_filename,
					createdAt: new Date(),
					updatedAt: new Date()
				};
				newAsset = await prisma.asset.create({
					data: asset
				});
			}


      // Create new candidate
      const personData = {
        name: name,
        lastname: lastname,
        birthdate: new Date(birthdate.toString()),
        phone: contactInfo.mobilePhone,
        landlinePhone: contactInfo.landlinePhone,
        document: cifnif,
        hasCar: false,
        relocateOption: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        Location: {
          connect: { id: newLocation.id }
        },
        User: {
          connect: { id: newUser.id }
        },
        ...(newAsset && {
          Asset: {
            connect: { id: newAsset.id }
          }
        }),
      };

      const newPerson = await prisma.person.create({
        data: personData
      });
      
      await Promise.all([
        saveExperincesOnDatabase(experiences, newPerson.id, prisma), 
        saveDriverProfile(licence, workRange, employeeType, newPerson.id, prisma), 
        saveEducations(educations, newPerson.id, prisma),
        saveLanguages(languages, newPerson.id, prisma)
      ]);
      return { message: 'User created successfully', errors: [] };
    } catch (error: any) {
      //removeFileFromCloud(cloudinaryResponse.public_id, cloudinaryResponse.format);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  });
  return transaction;
}

/**
 * Save educations to database for a person with the given id and the given educations
 * @param educations The list of educations to save
 * @param personId The id of the person to associate the educations
 */
async function saveEducations(educations: EducationDTO[], personId: number, prisma: any ) {
  const educationsToSave = [];
  for (const education of educations) {
    const educationData = {
      title: education.title,
      center: education.center,
      speciality: education.speciality,
      startYear: new Date(education.startYear.toString()),
      endYear: new Date(education.endYear.toString()),
      personId: personId,
    };
    educationsToSave.push(educationData);
  }
  await prisma.education.createMany({
    data: educationsToSave
  });
}

/**
 * Save languages to database for a person with the given id and the given languages
 * @param languages list of languages to save
 * @param personId The id of the person to associate the languages
 */
async function saveLanguages(languages: PersonLanguageDTO[], personId: number, prisma: any ) {
  const languagesToSave = [];
  for (const language of languages) {
    const languageData = {
      languageId: language.languageId ?? 0,
      level: language.level ?? '',
      personId: personId,
    };
    languagesToSave.push(languageData);
  }
  await prisma.personLanguages.createMany({
    data: languagesToSave
  });
}
/**
 * Save driver profile to database for a person with the given id and the given licence, work range and employee type
 * @param licence The licence to save
 * @param workRange The work range
 * @param employeeType The employee type the user selected
 * @param personId The id of the person to associate the licence
 */
async function saveDriverProfile(licence: Licence, workRange: string[], employeeType: string[], personId: number, prisma: any ) {
  const driverProfileData = {
    hasCapCertification: licence.capCertificate === 'Si',
    hasDigitalTachograph: licence.digitalTachograph === 'Si',
    personId: personId,
  }
  const newDriverProfile = await prisma.driverProfile.create({
    data: driverProfileData
  });
  

  const workRangesByCodeIn = await prisma.encoderType.findMany({
    where: {
      type: 'WORK_SCOPE',
      name: {
        in: workRange
      }
    }
  });
  // Create new driver employment preferences
  let driverEmploymentPreferecesList = []; 
  for (const range of workRangesByCodeIn) {
    const driverEmploymentPrefereces = {
      driverProfileId: newDriverProfile.id,
      workScopeId: range.id,
    }
    driverEmploymentPreferecesList.push(driverEmploymentPrefereces);
  };
  await prisma.driverWorkRangePreferences.createMany({
    data: driverEmploymentPreferecesList
  });

  const employmentsTypesByCodeIn = await prisma.encoderType.findMany({
    where: {
      type: 'EMPLOYEE_TYPE',
      name: {
        in: employeeType
      }
    }
  });
 
  // Create new driver employment preferences
  let driverEmploymentTypesList = [];
  for (const type of employmentsTypesByCodeIn) {
    const driverEmploymentTypes = {
      driverProfileId: newDriverProfile.id,
      employmentTypeId: type.id,
    } 
    driverEmploymentTypesList.push(driverEmploymentTypes);
  };
  await prisma.driverEmploymentPreferences.createMany({
    data: driverEmploymentTypesList
  });

  const licencesTypes = await prisma.encoderType.findMany({
    where: {
      type: {
        in: ['CARNET', 'CARNET_ADR']
      }
    }
  });
  
  if (!licencesTypes) {
    throw new Error('Licence type not found');
  }

  const licencesCarnet: EncoderType[] | undefined = licencesTypes.filter((licenceType: EncoderType) => licenceType.code === licence.code);
  const licencesAdr: EncoderType[] | undefined = licencesTypes.filter((licenceType: EncoderType) => licence.adrCode.includes(licenceType.code));
  if (!licencesCarnet || !licencesAdr) {
    throw new Error('Licence type not found');
  }
  
  const licenses = [];
  for (const carnet of licencesCarnet) {
    const driverLicence = {
      licenceTypeId: carnet.id,
      driverProfileId: newDriverProfile.id,
      countryId: licence.country
    }
    licenses.push(driverLicence);
  }

  for (const adr of licencesAdr) {
    const driverLicence = {
      licenceTypeId: adr.id,
      driverProfileId: newDriverProfile.id,
      countryId: licence.country
    }
    licenses.push(driverLicence);
  }

  await prisma.driverLicence.createMany({
    data: licenses
  });
}

/**
 * Save experiences to database for a person with the given id and the given experiences
 * @param experiences The list of experiences to save
 * @param personId The id of the person to associate the experiences
 */
async function saveExperincesOnDatabase(experiences: ExperienceDTO[], personId: number, prisma: any ) {
  const experienceTypesByCode = await prisma.encoderType.findMany({
    where: {
      type: 'EXPERIENCE_TYPE'
    }
  });
  // Create new experiences
  for (const experience of experiences) {
    const experienceTypeByCode = experienceTypesByCode.find((type: EncoderType) => type.name === experience.experienceType);
    const experienceData = {
      jobName: experience.experienceType,
      description: experience.description,
      startYear: new Date(experience.startYear.toString()),
      endYear: new Date(experience.endYear.toString()),
      personId: personId,
      experienceTypeId: experienceTypeByCode!.id,
    };

    await prisma.experience.create({
      data: experienceData
    });
  }
}

/**
 * Create a subscription plan for a user with the given plan id
 * @param planId The id of the plan to create the subscription
 * @param userId The id of the user to associate the subscription
 * @returns 
 */
export async function createSubscriptionPlan(planId: number, userId: string): Promise<Subscription> {

  const plan = await prisma.plan.findUnique({
    where: {
      id: planId
    }
  });

  if (!plan) {
    throw new Error('Plan not found');
  }

  const startDate = new Date();
  const endDate = new Date(startDate.setMonth(startDate.getMonth() + 6));

  const subscription = {
    startDate: startDate,
    endDate: endDate,
    stripeSubscriptionId: 'sub_' + randomUUID(),
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    User: {
      connect: { id: userId }
    },
    Plan: {
      connect: { id: plan?.id }
    }
  };

  const newSubscription = await prisma.subscription.create({
    data: subscription
  });
  return newSubscription;
}
