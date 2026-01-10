import { Request, Response } from "express";
import ApiError from "../../errors/apiError.ts";
import { fetchAnySingleComment } from "../../db/comment/commentGetQueries.ts";
import { NotFoundError } from "../../errors/notFoundError.ts";
import { AuthorizationError } from "../../errors/AuthorizationError.ts";
import { removeSingleComment } from "../../db/comment/commentDeleteQueries.ts";

async function deleteSingleComment(req: Request, res: Response) {
    const userId = req.user?.id as number;
    const { id } = req.params;

    if (id.trim() === "" || !id)
        throw new ApiError(400, {}, [], { id: "invalid comment id" });

    const comment = await fetchAnySingleComment(id);
    if (!comment) throw new NotFoundError(404, {}, ["comment not found"]);

    if (comment.author_id !== userId)
        throw new AuthorizationError({}, [
            "you are not authorized to delete this comment",
        ]);

    await removeSingleComment(comment.id);

    res.sendStatus(204);
}

export { deleteSingleComment };
