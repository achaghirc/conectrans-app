'use server';

import { CloudinaryUploadResponse, Role, SignUpCandidateFormData, SignUpCompanyFormData, State } from "../definitions";
import { User } from "../definitions";
import prisma from "@/app/lib/prisma/prisma";
import { getRoleByCode } from "../data/role";
import bcrypt from 'bcryptjs';
import { randomUUID } from "crypto";
import { getPlanById } from "../data/plan";
import { Subscription } from "@prisma/client";
import next from "next";

const takeNumberFromString = (str: string) => {
	return str.match(/\d+/g)!.map(Number);
}

//This method creates in database a new company, new user and new contact person
export async function companySignUp(formData: SignUpCompanyFormData, cloudinaryResponse: CloudinaryUploadResponse | null): Promise<User> {
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
      throw new Error(`Transaction failed: ${error.message}`);
    }
  });

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
    licence
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
      // Upload company logo to Cloudinary
      if (cloudinaryResponse) {
				const asset = {
					publicId: cloudinaryResponse.public_id,
					secureUrl: cloudinaryResponse.secure_url,
					url: cloudinaryResponse.url,
					width: cloudinaryResponse.width,
					height: cloudinaryResponse.height,
					format: cloudinaryResponse.format,
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
      

      const experienceTypesByCode = await prisma.encoderType.findMany({
        where: {
          type: 'EXPERIENCE_TYPE'
        }
      });
      // Create new experiences
      for (const experience of experiences) {
        const experienceTypeByCode = experienceTypesByCode.find((type) => type.name === experience.experienceType);
        const experienceData = {
          jobName: experience.experienceType,
          description: experience.description,
          startYear: new Date(experience.startYear.toString()),
          endYear: new Date(experience.endYear.toString()),
          personId: newPerson.id,
          experienceTypeId: experienceTypeByCode!.id,
        };

        await prisma.experience.create({
          data: experienceData
        });
      }

      // Create new licence
      const driverProfileData = {
        hasCapCertification: licence.capCertificate === 'Si',
        hasDigitalTachograph: licence.digitalTachograph === 'Si',
        personId: newPerson.id,
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
      for (const range of workRangesByCodeIn) {
        const driverEmploymentPrefereces = {
          driverProfileId: newDriverProfile.id,
          workScopeId: range.id,
        }
        
        await prisma.driverWorkRangePreferences.create({
          data: driverEmploymentPrefereces
        });
      };

      const employmentsTypesByCodeIn = await prisma.encoderType.findMany({
        where: {
          type: 'EMPLOYEE_TYPE',
          name: {
            in: employeeType
          }
        }
      });
      console.log(employmentsTypesByCodeIn);
     
      // Create new driver employment preferences
      for (const type of employmentsTypesByCodeIn) {
        const driverEmploymentPrefereces = {
          driverProfileId: newDriverProfile.id,
          employmentTypeId: type.id,
        } 
        await prisma.driverEmploymentPreferences.create({
          data: driverEmploymentPrefereces
        });
      };

      const licenceTypeCode = await prisma.encoderType.findFirst({
        where: {
          type: 'CARNET',
          code: licence.code
        }
      });
      
      if (!licenceTypeCode) {
        throw new Error('Licence type not found');
      }


      const driverLicence = {
        licenceTypeId: licenceTypeCode.id,
        driverProfileId: newDriverProfile.id,
        countryId: licence.country
      }

      await prisma.driverLicence.create({
        data: driverLicence
      });

      return { message: 'User created successfully', errors: [] };
    } catch (error: any) {
      //removeFileFromCloud(cloudinaryResponse.public_id, cloudinaryResponse.format);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  });
  return transaction;
}


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
