import { Router } from "express";
import userExtractor from "../util/userExtractor.ts";
import {
    deleteSingleBlog,
    getPublishedBlogs,
    getSinglePublishedBlog,
    postBlog,
    updateSingleBlog,
} from "../controllers/blog.ts";

const blogRouter = Router();

blogRouter.get("/blog/:id", getSinglePublishedBlog);
blogRouter.put("/blog/:id", userExtractor, updateSingleBlog);
blogRouter.post("/blog", userExtractor, postBlog);
blogRouter.delete("/blog/:id", userExtractor, deleteSingleBlog);

blogRouter.get("/blogs", getPublishedBlogs);

export default blogRouter;
