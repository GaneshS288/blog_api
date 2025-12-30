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

async function findUserById(id: string): Promise<Users | null> {
    const user = await prisma.users.findUnique({
        where: { remote_id: id },
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

async function fetchSingleUserBlog({
    author_id,
    blog_id,
}: {
    author_id: number;
    blog_id: string;
}) {
    const blog = await prisma.blogs.findUniqueOrThrow({
        where: {
            author_id: author_id,
            remote_id: blog_id,
        },
    });

    return blog;
}

export { createUser, findUserById, findUserByName, fetchSingleUserBlog };
