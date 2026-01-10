import prisma from "../prisma.ts";

async function fetchCommentLikeRecord(userId: number, commentId: number) {
    const likeRecord = await prisma.comment_likes.findUnique({
        where: {
            id: {
                user_id: userId,
                comment_id: commentId,
            },
        },
    });

    return likeRecord;
}

async function addLikeToComment(userId: number, commentId: number) {
    await prisma.$transaction([
        prisma.comment_likes.create({
            data: {
                user_id: userId,
                comment_id: commentId,
            },
        }),
        prisma.comments.update({
            where: {
                id: commentId,
            },
            data: {
                likes: {
                    increment: 1,
                },
            },
        }),
    ]);
}

async function removeLikeFromComment(userId: number, commentId: number) {
    await prisma.$transaction([
        prisma.comment_likes.delete({
            where: {
                id: {
                    user_id: userId,
                    comment_id: commentId,
                },
            },
        }),
        prisma.comments.update({
            data: {
                likes: { decrement: 1 },
            },
            where: {
                id: commentId,
            },
        }),
    ]);
}

export { addLikeToComment, removeLikeFromComment, fetchCommentLikeRecord };
