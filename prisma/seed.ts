
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      username: "demo_user",
      email: "demo@example.com",
      name: "Demo User",
      bio: "My first Instagram clone account",
    },
  });

  console.log("Created or found user:", user.username);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
