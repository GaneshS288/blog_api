import prisma from "../prisma.ts";

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

export { editBlog };
