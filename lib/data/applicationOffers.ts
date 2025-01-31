'use server';
import prisma from "@/app/lib/prisma/prisma";
import { ApplicationOffer, ApplicationOfferDTO } from "@prisma/client";
import { ApplicationOfferFilter } from "../definitions";
import { ApplicationOfferStatusEnum } from "../enums";

export async function getApplicationCountByPersonId(personId: number) : Promise<number> {
  try {
    const applications = await prisma.applicationOffer.count({
      where: {
        personId: personId
      }
    });
    return applications;
  } catch (error: any) {
    throw new Error('Error getting applications ' + error.message);
  }
}

export async function getApplicationsOfferUserByFilter(filter: Partial<ApplicationOfferFilter>, page?: number, limit?: number) : Promise<ApplicationOfferDTO[]> {
  try {
    if (!page ) page = 1;
    if (!limit) limit = 10;
    const where: Record<string, any> = {};
    if (filter.personId) where.personId = filter.personId;
    if (filter.status) where.status = filter.status;
    if (filter.offerId) where.offerId = filter.offerId;

    const applications = await prisma.applicationOffer.findMany({
      where: where,
      select: {
        id: true,
        status: true,
        updatedAt: true,
        Person: {
          include: {
            User: {
              select: {
                email: true,
              }
            },
            Location: {
              select: {
                state: true,
                city: true
              }
            },
            Asset: {
              select: {
                url: true,
                secureUrl: true,
                publicId: true
              }
            },
            PersonProfileImage: {
              select: {
                url: true
              }
            },
            Education: {
              select: {
                id: true,
                title: true,
                startYear: true,
                endYear: true,
                center: true,
              }
            },
            PersonLanguages: {
              select: {
                id: true,
                Languages: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  }
                },
                level: true,
              }
            },
            Experience: {
              select: {
                id: true,
                jobName: true,
                startYear: true,
                endYear: true,
                description: true,
                experienceTypeId: true,
                personId: true,
              }
            },
            DriverProfile: {
              include: {
                DriverWorkRangePreferences: {
                  select: {
                    id: true,
                    workScope: {
                      select: {
                        id: true,
                        name: true,
                        code: true,
                        type: true
                      }
                    }
                  }
                },
                DriverEmploymentPreferences: {
                  select: {
                    id: true,
                    EncoderType: {
                      select: {
                        id: true,
                        name: true,
                        code: true,
                        type: true
                      }
                    }
                  }
                },
                DriverLicence: {
                  select: {
                    id: true,
                    countryId: true,
                    Country: {
                      select: {
                        id: true,
                        name_es: true,
                        cod_iso2: true
                      }
                    },
                    LicenceType: {
                      select: {
                        id: true,
                        name: true,
                        code: true,
                        type: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        Offer: {
          select: {
            id: true,
            title: true,
            endDate: true,
            Location: {
              select: {
                state: true,
                city: true
              }
            },
            OfferPreferences: {
              select: {
                EncoderType: {
                  select: {
                    name: true,
                    code: true,
                    type: true
                  }
                },
                type: true
              }
            },
            User: {
              include: {
                Company: {
                  select: {
                    name: true,
                    Asset: {
                      select: {
                        url: true
                      }
                    }
                  }
                }
              }
            }
          },
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
    });
    console.log(applications);
    return applications;
  } catch (error: any) {
    throw new Error('Error getting applications ' + error.message);
  }
}


export async function getApplicationOffersPageableByFilter(filter: Partial<ApplicationOfferFilter>, page?: number, limit?: number) : Promise<ApplicationOfferDTO[]> {
  try {
    if (!page ) page = 1;
    if (!limit) limit = 10;
    const where: Record<string, any> = {};
    if (filter.personId) where.personId = filter.personId;
    if (filter.status) where.status = filter.status;
    if (filter.offerId) where.offerId = filter.offerId;

    const applications = await prisma.applicationOffer.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: where,
      select: {
        id: true,
        status: true,
        updatedAt: true,
        Offer: {
          select: {
            id: true,
            title: true,
            endDate: true,
            Location: {
              select: {
                state: true,
                city: true
              }
            },
            OfferPreferences: {
              select: {
                EncoderType: {
                  select: {
                    name: true,
                    code: true
                  }
                },
                type: true
              }
            },
            User: {
              select: {
                Company: {
                  select: {
                    name: true,
                    Asset: {
                      select: {
                        url: true
                      }
                    }
                  }
                }
              }
            }
          },
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
    });
    return applications;
  } catch (error: any) {
    throw new Error('Error getting applications ' + error.message);
  }
}

export async function createApplicationOffer(data: ApplicationOffer) : Promise<ApplicationOffer> {
  try {
    const application = {
      offerId: data.offerId,
      personId: data.personId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.status
    }
    const newApplication = await prisma.applicationOffer.create({
      data: application
    });
    return newApplication;
  } catch (error: any) {
    throw new Error('Error creating application ' + error.message);
  }
}

export async function handleApplicationOfferStatus(id: number, status: ApplicationOfferStatusEnum): Promise<boolean> {
  try {
    const application = await prisma.applicationOffer.update({
      where: {
        id: id
      },
      data: {
        status: status
      }
    });

    return true;
  } catch (error: any) {
    throw new Error('Error updating application ' + error.message);
  }

}

export async function existsApplicationOfferByPerson(personId: number, offerId: number) : Promise<boolean> {
  try {
    const application = await prisma.applicationOffer.findFirst({
      where: {
        personId: personId,
        offerId: offerId
      },
      select: {
        id: true
      }
    });
    return application !== null;
  } catch (error: any) {
    throw new Error('Error getting application ' + error.message);
  }
}