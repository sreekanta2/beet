import { Prisma } from "@prisma/client";

export type ClubWithBonus = Prisma.ClubGetPayload<{
  include: { clubsBonus: true };
}>;
