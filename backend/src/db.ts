import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

// Init
await prisma.about.upsert({
    where: { id: "title" },
    update: {},
    create: {
        id: "title",
        data: "website"
    }
})
await prisma.about.upsert({
    where: { id: "about" },
    update: {},
    create: {
        id: "about",
        data: "Hello this is my website!"
    }
})
await prisma.about.upsert({
    where: { id: "email" },
    update: {},
    create: {
        id: "email",
        data: "john.does@example.com"
    }
})

await prisma.about.upsert({
    where: { id: "pfpUrl" },
    update: {},
    create: {
        id: "pfpUrl",
        data: "/favicon.ico"
    }
})

export { prisma };