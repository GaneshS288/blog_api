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

async function findUserById(id: number): Promise<Users | null> {
    const user = await prisma.users.findUnique({
        where: { id },
        include: {
            blogs: true,
        },
    });

    return user;
}

async function findUserByName(name: string): Promise<Users | null> {
    const user = await prisma.users.findUnique({
        where: { name },
        include: {
            blogs: true,
        },
    });

    return user;
}

export { createUser, findUserById, findUserByName };
