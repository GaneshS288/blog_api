import prisma from "../prisma.ts";

type blogData = {
    title: string;
    content: string;
    author_id: number;
    published?: boolean;
};

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

export { createBlog };
