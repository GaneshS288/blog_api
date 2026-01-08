import prisma from "../prisma.ts";

/**only use internally this returns actual primary key of resource*/
async function fetchAnySingleComment(id: string) {
    const comment = await prisma.comments.findUnique({
        where: {
            remote_id: id,
        },
    });

    return comment;
}

export { fetchAnySingleComment };
