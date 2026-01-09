import prisma from "../prisma.ts";

type blogQueryParams = {
    order: "asc" | "desc";
    author_id?: string;
    page: number;
    size: number;
    name?: string;
    title?: string;
};

/**should only be used internally as it returns primary keys */
async function fetchAnySingleBlog(blogId: string) {
    const blog = await prisma.blogs.findUnique({
        where: {
            remote_id: blogId,
        },
    });

    return blog;
}

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
                name: { contains: name },
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

export { fetchPublishedSingleBlog, fetchAnySingleBlog, fetchPublishedBlogs };
