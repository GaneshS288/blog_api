import prisma from "./prisma.ts";

type blogData = {
    title: string;
    content: string;
    author_id: number;
    published?: boolean;
};

type blogQueryParams = {
    order: "asc" | "desc";
    author_id?: string;
    page: number;
    size: number;
    name?: string;
    title?: string;
};

async function fetchPublishedSingleBlog(blogId: string) {
    const blog = await prisma.blogs.findUnique({
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
        },
        where: {
            remote_id: blogId,
            published: true,
        },
    });

    return blog;
}
/**should only be used internally as it returns primary keys */
async function fetchAnySingleBlog(blogId: string) {
    const blog = await prisma.blogs.findUnique({
        where: {
            remote_id: blogId,
        },
    });

    return blog;
}

async function fetchPublishedBlogs({
    order = "desc",
    author_id = undefined,
    size,
    page,
    name,
    title,
}: blogQueryParams) {
    const filterOptions = {
        where: {
            title: { contains: title },
            author: {
                remote_id: author_id,
                name: name,
            },
            published: true,
        },
        orderBy: {
            created_at: order,
        },
    };

    const blogs = prisma.blogs.findMany({
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
        },
        skip: (page - 1) * size,
        take: size,
        ...filterOptions,
    });

    const totalBlogCount = prisma.blogs.count({
        where: filterOptions.where,
    });

    const [returnedBlogs, count] = await Promise.all([blogs, totalBlogCount]);

    return { blogs: returnedBlogs, count };
}

async function createBlog({
    title,
    content,
    author_id,
    published = false,
}: blogData) {
    const blog = await prisma.blogs.create({
        data: {
            title: title,
            content: content,
            author_id: author_id,
            published: published,
        },
        omit: {
            id: true,
            author_id: true,
        },
    });

    return blog;
}

async function editBlog({
    id,
    title,
    content,
    published,
}: {
    id: string;
    title: string;
    content: string;
    published: boolean;
}) {
    const res = await prisma.blogs.update({
        omit: {
            id: true,
            published: true,
        },
        data: {
            title: title,
            content: content,
            published: published,
        },
        where: {
            remote_id: id,
        },
    });

    return res;
}

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
    createBlog,
    fetchPublishedBlogs,
    fetchPublishedSingleBlog,
    editBlog,
    removeBlog,
    fetchAnySingleBlog,
    addLikeToBlog,
    deleteLikeFromBlog,
    fetchBlogLikeRecord,
};
