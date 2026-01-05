import { Request, Response } from "express";
import { createBlog } from "../../db/blog/blogCreateQueries.ts";
import { BlogPostSchema } from "../../validation/blogSchema.ts";
import { flattenError } from "../../validation/validationUtils.ts";
import ApiError from "../../errors/apiError.ts";

async function postBlog(req: Request, res: Response) {
    const user = req.user;

    if (user) {
        const author_id = user?.id;
        const { title, content, published } = req.body;
        const validationResult = BlogPostSchema.safeParse({
            author_id,
            published,
            title,
            content,
        });
        if (validationResult.success === false) {
            const validationErrors = flattenError(validationResult.error);
            throw new ApiError(400, [], null, validationErrors);
        }

        const createdBlog = await createBlog(validationResult.data);

        res.status(201).json({ data: createdBlog });
    }
}

export { postBlog };
