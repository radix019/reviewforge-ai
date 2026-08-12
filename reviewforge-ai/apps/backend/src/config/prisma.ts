import { PrismaPg } from "@prisma/adapter-pg";
// Don't use import { PrismaClient } from "@prisma/client"; since we have generated our own Prisma Client using the pnpm prisma generate using /schema.prisma that will contains our models like User & Repository
import { PrismaClient } from "../generated/prisma/client";
import { env } from "./env";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });
