import { Router } from "express";
import userExtractor from "../util/userExtractor.ts";
import { postBlog } from "../controllers/blog.ts";

const blogRouter = Router();

blogRouter.use(userExtractor);
blogRouter.post("/", postBlog);

export default blogRouter;