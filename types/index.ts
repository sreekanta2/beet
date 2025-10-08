export interface DoctorPageProps {
  params: { doctorId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

import { Prisma } from "@prisma/client";

export type OrderWithPackage = Prisma.OrderGetPayload<{
  include: { package: true };
}>;

// or with user too
export type OrderWithPackageAndUser = Prisma.OrderGetPayload<{
  include: { package: true; user: true };
}>;

export type UserWithEverything = Prisma.UserGetPayload<{
  include: {
    orders: {
      include: { package: true };
    };
    paymentRequests: true;
    accounts: true;
    sessions: true;
    adView: true;
    transaction: true;
    referralsMade: true;
    referralsGot: true;
  };
}>;
export type TransactionWithUser = Prisma.TransactionGetPayload<{
  include: { user: true; mobileNumber: true };
}>;
