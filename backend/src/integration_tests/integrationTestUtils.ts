import prisma from "../db/prisma.ts";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS, SECRET_PASSWORD } from "../envConfig.ts";
import blogJson from "./dummyBlogs.json" with { type: "json" };

const dummyExistingUsers = [
    { name: "martin", password: "stall$3000", passwordConfirm: "stall$3000" },
    { name: "fuwante", password: "drift&3ace", passwordConfirm: "drift&3ace" },
];

const dummyNewUser = {
    name: "ganesh",
    password: "ihatetheworldandmartin",
    passwordConfirm: "ihatetheworldandmartin",
};

async function testSetup() {
    await prisma.users.deleteMany();
    await prisma.blogs.deleteMany();
    const users = dummyExistingUsers.map((user) => {
        return {
            name: user.name,
            passwordHash: bcrypt.hashSync(user.password, SALT_ROUNDS),
        };
    });
    await prisma.users.createMany({ data: users });
    const user = await prisma.users.findFirstOrThrow({
        where: {
            name: dummyExistingUsers[0].name,
        },
    });

    const dummyBlogs = blogJson.map((blog) => ({...blog, author_id: user.id}));

    await prisma.blogs.createMany({data: dummyBlogs})
}

export { dummyExistingUsers, dummyNewUser, testSetup };
