import { z } from "zod/v4";

const commentCreateSchmea = z.object({
    blogId: z.uuidv4().nonempty("blog Id missing"),
    content: z.string().trim().nonempty("comment can't be empty"),
});

const ReplyCreateSchema = z.object({
    blogId: z.uuidv4().nonempty("blog Id missing"),
    content: z.string().trim().nonempty("reply can't be empty"),
    parentCommentId: z.uuidv4().optional(),
});

const CommentQueryParamsSchema = z.object({
    order: z.enum(["asc", "desc"]),
    blogId: z.uuidv4(),
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(5).max(20).default(10),
});

export { commentCreateSchmea, ReplyCreateSchema, CommentQueryParamsSchema };
