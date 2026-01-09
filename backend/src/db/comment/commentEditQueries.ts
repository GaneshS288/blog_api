import prisma from "../prisma.ts";

async function updateSingleComment({
    commentId,
    content,
}: {
    commentId: number;
    content: string;
}) {
    const updatedComment = await prisma.comments.update({
        omit: {
            id: true,
            author_id: true,
            blog_id: true,
            parent_comment_id: true,
        },
        where: {
            id: commentId,
        },
        data: {
            content: content,
            updated_at: new Date(),
        },
    });

    return updatedComment;
}

export { updateSingleComment };
