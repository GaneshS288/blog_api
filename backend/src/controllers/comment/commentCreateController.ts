import { Request, Response } from "express";
import {
    createSingleComment,
    createSingleReply,
} from "../../db/comment/commentCreateQeueries.ts";
import {
    commentCreateSchmea,
    ReplyCreateSchema,
} from "../../validation/commentSchema.ts";
import { flattenError } from "../../validation/validationUtils.ts";
import ApiError from "../../errors/apiError.ts";
import { fetchAnySingleBlog } from "../../db/blog/BlogGetQueries.ts";
import { NotFoundError } from "../../errors/notFoundError.ts";
import { fetchAnySingleComment } from "../../db/comment/commentGetQueries.ts";

async function postSingleComment(req: Request, res: Response) {
    const userId = req.user?.id as number;
    const { blogId } = req.query;
    const { content } = req.body;

    const validationResult = commentCreateSchmea.safeParse({ content, blogId });
    if (validationResult.success === false) {
        const validationErrors = flattenError(validationResult.error);
        throw new ApiError(400, {}, [], validationErrors);
    }

    const blog = await fetchAnySingleBlog(validationResult.data.blogId);
    if (!blog) throw new NotFoundError(404, {}, ["blog not found"]);

    const createdComment = await createSingleComment({
        userId,
        blogId: blog.id,
        content: validationResult.data.content,
    });

    res.status(201).json({ data: createdComment });
}

async function postSingleReply(req: Request, res: Response) {
    const userId = req.user?.id as number;
    const { blogId } = req.query;
    const { id: parentCommentId } = req.params;
    const { content } = req.body;

    const validationResult = ReplyCreateSchema.safeParse({
        parentCommentId,
        content,
        blogId,
    });
    if (validationResult.success === false) {
        const validationErrors = flattenError(validationResult.error);
        throw new ApiError(400, {}, [], validationErrors);
    }

    const blog = await fetchAnySingleBlog(validationResult.data.blogId);
    if (!blog) throw new NotFoundError(404, {}, ["blog not found"]);

    const parentComment = await fetchAnySingleComment(parentCommentId);
    if (!parentComment)
        throw new NotFoundError(404, {}, ["parent comment not found"]);

    const createdReply = await createSingleReply({
        userId,
        blogId: blog.id,
        content: validationResult.data.content,
        parentCommentId: parentComment.id,
    });

    res.status(201).json({ data: createdReply });
}

export { postSingleComment, postSingleReply };
