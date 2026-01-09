import prisma from "../db/prisma.ts";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS, SECRET_PASSWORD } from "../envConfig.ts";
import blogJson from "./dummyBlogs.json" with { type: "json" };
import commentJson from "./dummyComments.json" with { type: "json" };

const commentCount = commentJson.length;

const dummyExistingUsers = [
    { name: "martin", password: "stall$3000", passwordConfirm: "stall$3000" },
    { name: "fuwante", password: "drift&3ace", passwordConfirm: "drift&3ace" },
];

const fuwanteUserDetails = { name: "martin", password: "stall$3000", passwordConfirm: "stall$3000" };
const martinUserDetails = { name: "fuwante", password: "drift&3ace", passwordConfirm: "drift&3ace" };

const dummyNewUser = {
    name: "ganesh",
    password: "ihatetheworldandmartin",
    passwordConfirm: "ihatetheworldandmartin",
};

async function blogPostSetup() {
    await prisma.users.deleteMany();
    await prisma.blogs.deleteMany();
    const users = dummyExistingUsers.map((user) => {
        return {
            name: user.name,
            passwordHash: bcrypt.hashSync(user.password, SALT_ROUNDS),
        };
    });
    await prisma.users.createMany({ data: users });
}

async function seedBlogs() {
    await prisma.users.deleteMany();
    await prisma.blogs.deleteMany();
    const users = dummyExistingUsers.map((user) => {
        return {
            name: user.name,
            passwordHash: bcrypt.hashSync(user.password, SALT_ROUNDS),
        };
    });
    await prisma.users.createMany({ data: users });
    const dbUsers = await prisma.users.findMany();
    const userMartin = dbUsers.find((user) => user.name === "martin");
    const userFuwante = dbUsers.find((user) => user.name === "fuwante");

    const dummyBlogs = blogJson.map((blog) => ({
        ...blog,
        author_id: userMartin!.id,
    }));
    //change the first blog to have a different user id and remove it from array
    const fuwnateBlogContent = dummyBlogs.shift()!;
    fuwnateBlogContent.author_id = userFuwante!.id;

    const fuwanteBlogCommentsContent = commentJson.map((comment) => ({
        ...comment,
        author_id: userFuwante!.id,
    }));

    await prisma.blogs.createMany({ data: dummyBlogs });
    await prisma.blogs.create({
        data: {
            ...fuwnateBlogContent,
            comments: { createMany: { data: fuwanteBlogCommentsContent } },
        },
    });
}

export { dummyExistingUsers, dummyNewUser, seedBlogs, blogPostSetup, commentCount, fuwanteUserDetails, martinUserDetails };
