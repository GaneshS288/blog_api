import prisma, { Users } from "./prisma.ts";

async function createUser(
    name: string,
    passwordHash: string,
    admin: boolean = false
): Promise<Users> {
    const user = await prisma.users.create({
        data: {
            name,
            passwordHash,
            admin,
        },
    });

    return user;
}

async function findUser(id: string): Promise<Users | null> {
    const user = await prisma.users.findFirst({
        where: { id },
        include: {
            blogs: true,
        },
    });

    return user;
}

export { createUser, findUser };
