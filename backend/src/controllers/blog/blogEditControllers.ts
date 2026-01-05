import { Request, Response } from "express";
import { BlogPUTSchema } from "../../validation/blogSchema.ts";
import { flattenError } from "../../validation/validationUtils.ts";
import ApiError from "../../errors/apiError.ts";
import { NotFoundError } from "../../errors/notFoundError.ts";
import { AuthorizationError } from "../../errors/AuthorizationError.ts";
import { fetchAnySingleBlog } from "../../db/blog/BlogGetQueries.ts";
import { editBlog } from "../../db/blog/blogEditQueries.ts";

async function updateSingleBlog(req: Request, res: Response) {
    const { title, content, published } = req.body;
    const { id } = req.params;
    const validationResult = BlogPUTSchema.safeParse({
        title,
        content,
        published,
    });

    const blogExists = await fetchAnySingleBlog(id);

    if (!blogExists) throw new NotFoundError(404, {}, ["blog not found"]);
    if (validationResult.success === false) {
        const validationErrors = flattenError(validationResult.error);
        throw new ApiError(400, [], null, validationErrors);
    }
    if (blogExists.author_id !== req.user?.id) throw new AuthorizationError();

    const updatedBlog = await editBlog({ id, ...validationResult.data });

    res.status(200).json({ data: updatedBlog });
}

export { updateSingleBlog };
