import { Router } from "express";
import userExtractor from "../util/userExtractor.ts";
import {
    deleteSingleBlog,
    getPublishedBlogs,
    getSinglePublishedBlog,
    likeBlog,
    postBlog,
    unlikeBlog,
    updateSingleBlog,
} from "../controllers/blog.ts";

const blogRouter = Router();

blogRouter.get("/blog/:id", getSinglePublishedBlog);
blogRouter.put("/blog/:id", userExtractor, updateSingleBlog);
blogRouter.post("/blog", userExtractor, postBlog);
blogRouter.delete("/blog/:id", userExtractor, deleteSingleBlog);
blogRouter.post("/blog/:id/like", userExtractor, likeBlog);
blogRouter.delete("/blog/:id/like", userExtractor, unlikeBlog);

blogRouter.get("/blogs", getPublishedBlogs);

export default blogRouter;
