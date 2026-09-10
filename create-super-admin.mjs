import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  console.log("--- Create Super Admin ---");

  rl.question("Enter username: ", async (username) => {
    rl.question("Enter password: ", async (password) => {
      try {
        const existingUser = await prisma.adminUser.findUnique({
          where: { username },
        });

        if (existingUser) {
          console.log(`User ${username} already exists.`);
        } else {
          const passwordHash = await bcrypt.hash(password, 10);

          const user = await prisma.adminUser.create({
            data: {
              username,
              passwordHash,
              role: "SUPERADMIN",
            },
          });
          console.log(`Super Admin '${user.username}' created successfully!`);
        }
      } catch (error) {
        console.error("Error creating super admin:", error);
      } finally {
        await prisma.$disconnect();
        rl.close();
      }
    });
  });
}

main();
