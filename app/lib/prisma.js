import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

// Declare the 'prisma' variable
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  prisma = globalForPrisma.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
}

export default prisma;
