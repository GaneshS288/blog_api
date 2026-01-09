import prisma from "../prisma.ts";

type commentQueryParams = {
    order: "asc" | "desc";
    page: number;
    size: number;
    blogId: string;
};

/**only use internally this returns actual primary key of resource*/
async function fetchAnySingleComment(id: string) {
    const comment = await prisma.comments.findUnique({
        where: {
            remote_id: id,
        },
    });

    return comment;
}

async function fetchComments({
    order = "desc",
    blogId,
    page,
    size,
}: commentQueryParams) {
    const filterOptions = {
        where: {
            blog: {
                remote_id: blogId,
            },
            parent_comment_id: null,
        },
        orderBy: {
            created_at: order,
        },
    };
    const comments = await prisma.comments.findMany({
        omit: {
            id: true,
            author_id: true,
        },
        include: {
            author: {
                select: {
                    remote_id: true,
                    name: true,
                },
            },
            comments: {
                select: {
                    remote_id: true,
                    content: true,
                    created_at: true,
                    updated_at: true,
                    likes: true,
                    author: {
                        select: {
                            remote_id: true,
                            name: true,
                        },
                    },
                },
            },
        },
        ...filterOptions,
        skip: (page - 1) * size,
        take: size,
    });

    const count = await prisma.comments.count({
        where: { blog: { remote_id: blogId } },
    });

    return { comments, count };
}

export { fetchAnySingleComment, fetchComments };
