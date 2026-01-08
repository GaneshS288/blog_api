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

export { commentCreateSchmea, ReplyCreateSchema };
