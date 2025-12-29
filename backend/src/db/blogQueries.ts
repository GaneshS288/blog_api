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
};

async function fetchPublishedBlogs({
    order = "desc",
    author_id = undefined,
    size,
    page,
}: blogQueryParams) {
    const filterOptions = {
        where: {
            author: {
                remote_id: author_id,
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
    });

    return blog;
}

export { createBlog, fetchPublishedBlogs };
