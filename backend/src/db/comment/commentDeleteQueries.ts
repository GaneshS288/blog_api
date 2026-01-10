import prisma from "../prisma.ts";

async function removeSingleComment(id: number) {
    const removedComment = await prisma.comments.delete({
        omit: {
            parent_comment_id: true,
            id: true,
            author_id: true,
            blog_id: true,
        },
        where: {
            id: id,
        },
    });

    return removedComment;
}

export { removeSingleComment };
