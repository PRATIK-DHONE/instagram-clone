
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const passwordHash = await hash(
  process.env.SEED_USER_PASSWORD ??
    "LocalTestPassword123!",
  12
);
async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      username: "demo_user",
      email: "demo@example.com",
      name: "Demo User",
      bio: "My first Instagram clone account",
      passwordHash,
    },
  });

  console.log("Created or found user:", user.username);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
