import { Router } from "express";
import userExtractor from "../util/userExtractor.ts";
import {
    postSingleComment,
    postSingleReply,
} from "../controllers/comment/commentCreateController.ts";
import { getCommentsOnPublishedBlog } from "../controllers/comment/commentGetControllers.ts";

const commentRouter = Router();

commentRouter.post("/comment", userExtractor, postSingleComment);
commentRouter.post("/comment/:id", userExtractor, postSingleReply);

commentRouter.get("/comments", getCommentsOnPublishedBlog);

export { commentRouter };
