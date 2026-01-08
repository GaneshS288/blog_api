import prisma from "../prisma.ts";

/**posts a comment on a blog */
async function createSingleComment({
    userId,
    blogId,
    content,
}: {
    userId: number;
    blogId: number;
    content: string;
}) {
    const createdComment = await prisma.comments.create({
        omit: {
            author_id: true,
            blog_id: true,
            id: true,
            parent_comment_id: true,
        },
        include: {
            author: {
                select: {
                    remote_id: true,
                    name: true,
                },
            },
            blog: {
                select: {
                    remote_id: true,
                    title: true,
                },
            },
        },
        data: {
            author_id: userId,
            blog_id: blogId,
            content: content,
        },
    });

    return createdComment;
}

async function createSingleReply({
    userId,
    blogId,
    content,
    parentCommentId,
}: {
    userId: number;
    blogId: number;
    content: string;
    parentCommentId: number;
}) {
    const createdComment = await prisma.comments.create({
        omit: {
            author_id: true,
            blog_id: true,
            id: true,
            parent_comment_id: true,
        },
        include: {
            author: {
                select: {
                    remote_id: true,
                    name: true,
                },
            },
            blog: {
                select: {
                    remote_id: true,
                    title: true,
                },
            },
            parent_comment: {
                select: {
                    remote_id: true,
                },
            },
        },
        data: {
            author_id: userId,
            blog_id: blogId,
            content: content,
            parent_comment_id: parentCommentId,
        },
    });

    return createdComment;
}

export { createSingleComment, createSingleReply };
