import { Request, Response } from "express";
import ApiError from "../../errors/apiError.ts";
import { fetchAnySingleComment } from "../../db/comment/commentGetQueries.ts";
import { NotFoundError } from "../../errors/notFoundError.ts";
import { AuthorizationError } from "../../errors/AuthorizationError.ts";
import {
    addLikeToComment,
    fetchCommentLikeRecord,
    removeLikeFromComment,
} from "../../db/comment/commentLikeQueries.ts";

async function addLike(req: Request, res: Response) {
    const userId = req.user?.id as number;
    const { id: commentId } = req.params;

    if (commentId.trim() === "" || !commentId)
        throw new ApiError(400, {}, [], { id: "invalid comment id" });

    const comment = await fetchAnySingleComment(commentId);
    if (!comment) throw new NotFoundError(404, {}, ["comment not found"]);

    const commentLikeRecord = await fetchCommentLikeRecord(userId, comment.id);
    if (commentLikeRecord)
        throw new ApiError(400, {}, ["you have already liked this comment"]);

    await addLikeToComment(userId, comment.id);

    res.sendStatus(204);
}

async function deleteLike(req: Request, res: Response) {
    const userId = req.user?.id as number;
    const { id: commentId } = req.params;

    if (commentId.trim() === "" || !commentId)
        throw new ApiError(400, {}, [], { id: "invalid comment id" });

    const comment = await fetchAnySingleComment(commentId);
    if (!comment) throw new NotFoundError(404, {}, ["comment not found"]);

    const commentLikeRecord = await fetchCommentLikeRecord(userId, comment.id);
    if (!commentLikeRecord)
        throw new ApiError(404, {}, ["you haven't liked this comment"]);

    if (commentLikeRecord.user_id !== userId)
        throw new AuthorizationError({}, [
            "you are not authorized to delete this like record",
        ]);

    await removeLikeFromComment(userId, comment.id);

    res.sendStatus(204);
}

export { addLike, deleteLike };
