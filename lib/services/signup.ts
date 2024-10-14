'use server';

import { Person } from "@mui/icons-material";
import { CloudinaryUploadResponse, Role, SignUpCompanyFormData } from "../definitions";
import { User } from "../definitions";
import prisma from "@/app/lib/prisma/prisma";
import { getRoleByCode } from "../data/role";
import bcrypt from 'bcrypt';
import { uploadImage } from "./cloudinary";

const takeNumberFromString = (str: string) => {
	return str.match(/\d+/g)!.map(Number);
}

//This method creates in database a new company, new user and new contact person
export default async function companySignUp(formData: SignUpCompanyFormData, cloudinaryResponse: CloudinaryUploadResponse): Promise<User> {
  const { company, contactInfo, contactPerson } = formData;

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
        roleId: role.id,
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
        country: contactInfo.country,
        zip: contactInfo.zip,
        latitude: 0,
        longitude: 0,
        createdAt: new Date(),
        updatedAt: new Date()
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
      if (!cloudinaryResponse === null) {
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
        activityId: activity.id,
				userId: newUser.id,
				contactPersonId: newContactPerson.id,
				locationId: newLocation.id,
        assetId: newAsset!= null ? newAsset.id : null,
        createdAt: new Date(),
        updatedAt: new Date()
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