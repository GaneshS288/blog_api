import { Router } from "express";
import userExtractor from "../util/userExtractor.ts";

import {
    getPublishedBlogs,
    getSinglePublishedBlog,
} from "../controllers/blog/blogGetControllers.ts";
import { postBlog } from "../controllers/blog/blogPostControllers.ts";
import { updateSingleBlog } from "../controllers/blog/blogEditControllers.ts";
import { deleteSingleBlog } from "../controllers/blog/blogDeleteControllers.ts";
import {
    likeBlog,
    unlikeBlog,
} from "../controllers/blog/blogLikeControllers.ts";

const blogRouter = Router();

blogRouter.get("/blog/:id", getSinglePublishedBlog);
blogRouter.put("/blog/:id", userExtractor, updateSingleBlog);
blogRouter.post("/blog", userExtractor, postBlog);
blogRouter.delete("/blog/:id", userExtractor, deleteSingleBlog);
blogRouter.post("/blog/:id/like", userExtractor, likeBlog);
blogRouter.delete("/blog/:id/like", userExtractor, unlikeBlog);

blogRouter.get("/blogs", getPublishedBlogs);

export default blogRouter;
