import prisma from "@/app/lib/prisma/prisma";
import { TransactionStatusEnum } from "../enums";


export async function getTotalIncome() {
  try {
    const totalIncome = await prisma.transaction.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: 'PAID'
      }
    });

    if (!totalIncome) {
      return undefined;
    }
    return totalIncome._sum.amount;
  } catch (err) {
    console.log("Error getting total income", err);
    return undefined;
  }
}

export async function getTransactionsPaid(): Promise<number | undefined> {
  try {
    const counted = await prisma.transaction.count({
      where: {
        status: TransactionStatusEnum.PAID
      }
    });

    if (!counted) {
      return undefined;
    }
    return counted;
  } catch (err) {
    console.log("Error getting transactions paid", err);
    return undefined;
  }
}

export async function getActiveOffers(): Promise<number | undefined> {
  try {
    const counted = await prisma.offer.count({
      where: {
        endDate: {
          gte: new Date()
        }
      }
    });

    if (!counted) {
      return undefined;
    }
    return counted;
  } catch (err) {
    console.log("Error getting active offers", err);
    return undefined;
  }
}

export async function getActiveSubscriptions(): Promise<number | undefined> {
  try {
    const counted = await prisma.subscription.count({
      where: {
        status: 'ACTIVE'
      }
    });

    if (!counted) {
      return undefined;
    }
    return counted;
  } catch (err) {
    console.log("Error getting active subscriptions", err);
    return undefined;
  }
}

export async function getCompanies(): Promise<number | undefined> {
  try {
    const counted = await prisma.company.count();

    if (!counted) {
      return undefined;
    }
    return counted;
  } catch (err) {
    console.log("Error getting companies", err);
    return undefined;
  }
}

export async function getDrivers(): Promise<number | undefined> {
  try {
    const counted = await prisma.user.count(
      {
        where: {
          Role: {
            code: { equals: 'USER' }
          }
        }
      }
    );

    if (!counted) {
      return undefined;
    }
    return counted;
  } catch (err) {
    console.log("Error getting drivers", err);
    return undefined;
  }
}