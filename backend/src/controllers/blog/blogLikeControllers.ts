import { Request, Response } from "express";
import ApiError from "../../errors/apiError.ts";
import { NotFoundError } from "../../errors/notFoundError.ts";
import { fetchAnySingleBlog } from "../../db/blog/BlogGetQueries.ts";
import {
    fetchBlogLikeRecord,
    addLikeToBlog,
    deleteLikeFromBlog,
} from "../../db/blog/blogLikeQueries.ts";
import { AuthorizationError } from "../../errors/AuthorizationError.ts";

async function likeBlog(req: Request, res: Response) {
    const { id: blogId } = req.params;
    const userId = req.user?.id as number;

    const blogExists = await fetchAnySingleBlog(blogId);
    if (!blogExists) throw new NotFoundError(404, {}, ["blog not found"]);

    const likeRecord = await fetchBlogLikeRecord(userId, blogExists.id);
    if (likeRecord)
        throw new ApiError(400, {}, ["You have already liked this record"]);

    await addLikeToBlog(userId, blogExists.id);

    res.sendStatus(204);
}

async function unlikeBlog(req: Request, res: Response) {
    const { id: blogId } = req.params;
    const userId = req.user?.id as number;

    const blogExists = await fetchAnySingleBlog(blogId);
    if (!blogExists) throw new NotFoundError(404, {}, ["blog not found"]);

    const likeRecord = await fetchBlogLikeRecord(userId, blogExists.id);
    if (!likeRecord)
        throw new ApiError(404, {}, ["You have not liked this blog"]);

    if (likeRecord.user_id !== userId)
        throw new AuthorizationError({}, [
            "you are not authorized to delete this like record",
        ]);

    await deleteLikeFromBlog(userId, blogExists.id);

    res.sendStatus(204);
}

export { likeBlog, unlikeBlog };
