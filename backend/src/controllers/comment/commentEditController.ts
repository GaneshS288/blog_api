import { Request, Response } from "express";
import { CommentEditSchema } from "../../validation/commentSchema.ts";
import { flattenError } from "../../validation/validationUtils.ts";
import ApiError from "../../errors/apiError.ts";
import { fetchAnySingleComment } from "../../db/comment/commentGetQueries.ts";
import { NotFoundError } from "../../errors/notFoundError.ts";
import { AuthorizationError } from "../../errors/AuthorizationError.ts";
import { updateSingleComment } from "../../db/comment/commentEditQueries.ts";

async function editComment(req: Request, res: Response) {
    const userId = req.user?.id as number;

    const { content } = req.body;
    const { id: commentId } = req.params;

    const validationResult = CommentEditSchema.safeParse({
        content,
        commentId,
    });
    if (validationResult.success === false) {
        const validationErrors = flattenError(validationResult.error);
        throw new ApiError(400, {}, [], validationErrors);
    }

    const comment = await fetchAnySingleComment(
        validationResult.data.commentId
    );
    if (!comment) throw new NotFoundError(404, {}, ["comment not found"]);

    if (comment.author_id !== userId)
        throw new AuthorizationError({}, [
            "you are not authorized to perform this action",
        ]);

    const updatedComment = await updateSingleComment({
        commentId: comment.id,
        content: validationResult.data.content,
    });

    res.status(200).json({ data: updatedComment });
}

export { editComment };
