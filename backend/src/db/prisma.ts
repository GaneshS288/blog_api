import { PrismaClient } from "../../generated/prisma/index.js";
import { DATABASE_URL } from "../envConfig.ts";
export * from "../../generated/prisma/index.js";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: DATABASE_URL,
        },
    },
});

export default prisma;
