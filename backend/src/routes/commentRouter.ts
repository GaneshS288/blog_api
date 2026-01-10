import { Router } from "express";
import userExtractor from "../util/userExtractor.ts";
import {
    postSingleComment,
    postSingleReply,
} from "../controllers/comment/commentCreateController.ts";
import { getCommentsOnPublishedBlog } from "../controllers/comment/commentGetControllers.ts";
import { editComment } from "../controllers/comment/commentEditController.ts";
import { deleteSingleComment } from "../controllers/comment/commentDeleteController.ts";
import {
    addLike,
    deleteLike,
} from "../controllers/comment/commentLikeController.ts";

const commentRouter = Router();

commentRouter.post("/comment", userExtractor, postSingleComment);
commentRouter.post("/comment/:id", userExtractor, postSingleReply);
commentRouter.put("/comment/:id", userExtractor, editComment);
commentRouter.delete("/comment/:id", userExtractor, deleteSingleComment);
commentRouter.post("/comment/:id/like", userExtractor, addLike);
commentRouter.delete("/comment/:id/like", userExtractor, deleteLike);

commentRouter.get("/comments", getCommentsOnPublishedBlog);

export { commentRouter };
