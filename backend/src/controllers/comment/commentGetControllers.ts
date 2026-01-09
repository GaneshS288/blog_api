import { Request, Response } from "express";
import { CommentQueryParamsSchema } from "../../validation/commentSchema.ts";
import { flattenError } from "../../validation/validationUtils.ts";
import ApiError from "../../errors/apiError.ts";
import { fetchPublishedSingleBlog } from "../../db/blog/BlogGetQueries.ts";
import { NotFoundError } from "../../errors/notFoundError.ts";
import { fetchComments } from "../../db/comment/commentGetQueries.ts";

async function getCommentsOnPublishedBlog(req: Request, res: Response) {
    const { blogId, order, page, size } = req.query;

    const validationResult = CommentQueryParamsSchema.safeParse({
        blogId,
        order,
        page,
        size,
    });
    if (validationResult.success === false) {
        const validationErrors = flattenError(validationResult.error);
        throw new ApiError(400, {}, [], validationErrors);
    }

    const blog = await fetchPublishedSingleBlog(validationResult.data.blogId);
    if (!blog || blog.published === false)
        throw new NotFoundError(404, {}, ["blog not found"]);

    const comments = await fetchComments(validationResult.data);

    res.status(200).json({ data: comments });
}

export { getCommentsOnPublishedBlog };
