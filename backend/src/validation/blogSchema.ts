import { z } from "zod/v4";
import { escapeHtml } from "./validationUtils.ts";

const errors = {
    titleEmpty: "title cannot be empty",
    titleTooLong: "title cannot be longer than 100 characters",
    contentEmpty: "content cannot be empty",
};

const BlogPostSchema = z
    .object({
        title: z
            .string()
            .trim()
            .nonempty(errors.titleEmpty)
            .max(100, errors.titleTooLong),
        content: z.string().trim().nonempty(errors.contentEmpty),
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

export { BlogPostSchema };
