import { z } from "zod/v4";
import { escapeHtml } from "./validationUtils.ts";

const postErrors = {
    titleEmpty: "title cannot be empty",
    titleTooLong: "title cannot be longer than 100 characters",
    contentEmpty: "content cannot be empty",
};


const BlogGetQueryParamsSchema = z.object({
    order: z.enum(["asc", "desc"]),
    author_id: z.uuidv4().optional(),
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(5).max(20).default(10),
});

const BlogPostSchema = z
    .object({
        title: z
            .string()
            .trim()
            .nonempty(postErrors.titleEmpty)
            .max(100, postErrors.titleTooLong),
        content: z.string().trim().nonempty(postErrors.contentEmpty),
        author_id: z.number(),
        published: z.boolean().default(false),
    })
    .transform((data) => {
        return {
            title: escapeHtml(data.title),
            content: data.content,
            author_id: data.author_id,
            published: data.published,
        };
    });

export { BlogPostSchema, BlogGetQueryParamsSchema };
