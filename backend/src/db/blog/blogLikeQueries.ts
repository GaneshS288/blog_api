import prisma from "../prisma.ts";


async function addLikeToBlog(user_id: number, blog_id: number) {
    await prisma.$transaction([
        prisma.blog_likes.create({
            data: {
                user_id: user_id,
                blog_id: blog_id,
            },
        }),
        prisma.blogs.update({
            data: { likes: { increment: 1 } },
            where: {
                id: blog_id,
            },
        }),
    ]);
}

async function fetchBlogLikeRecord(user_id: number, blog_id: number) {
    const likeRecord = await prisma.blog_likes.findUnique({
        where: {
            id: {
                user_id: user_id,
                blog_id: blog_id,
            },
        },
    });

    return likeRecord;
}

async function deleteLikeFromBlog(user_id: number, blog_id: number) {
    await prisma.$transaction([
        prisma.blog_likes.delete({
            where: {
                id: {
                    user_id: user_id,
                    blog_id: blog_id,
                },
            },
        }),
        prisma.blogs.update({
            data: { likes: { decrement: 1 } },
            where: {
                id: blog_id,
            },
        }),
    ]);
}

export {
    addLikeToBlog,
    deleteLikeFromBlog,
    fetchBlogLikeRecord,
};
