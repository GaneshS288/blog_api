import prisma from "../prisma.ts";

async function removeBlog(id: string) {
    await prisma.blogs.delete({
        omit: {
            id: true,
            author_id: true,
        },
        where: {
            remote_id: id,
        },
    });
}

export { removeBlog };
