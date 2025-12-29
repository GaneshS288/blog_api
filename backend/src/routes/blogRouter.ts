import { Router } from "express";
import userExtractor from "../util/userExtractor.ts";
import {
    getPublishedBlogs,
    getSinglePublishedBlog,
    postBlog,
} from "../controllers/blog.ts";

const blogRouter = Router();

blogRouter.get("/blog/:id", getSinglePublishedBlog);
blogRouter.post("/blog", userExtractor, postBlog);

blogRouter.get("/blogs", getPublishedBlogs);

export default blogRouter;
