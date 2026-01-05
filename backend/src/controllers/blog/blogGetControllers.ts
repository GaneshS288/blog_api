import { Request, Response } from "express";
import { BlogGetQueryParamsSchema } from "../../validation/blogSchema.ts";
import { flattenError } from "../../validation/validationUtils.ts";
import ApiError from "../../errors/apiError.ts";
import { NotFoundError } from "../../errors/notFoundError.ts";
import {
    fetchPublishedBlogs,
    fetchPublishedSingleBlog,
} from "../../db/blog/BlogGetQueries.ts";

async function getPublishedBlogs(req: Request, res: Response) {
    const { author_id, order, page, size, name, title } = req.query;
    const validationResult = BlogGetQueryParamsSchema.safeParse({
        author_id,
        order,
        page,
        size,
        name,
        title,
    });

    if (validationResult.success === false) {
        const validationErrors = flattenError(validationResult.error);
        throw new ApiError(400, [], null, validationErrors);
    }

    const blogs = await fetchPublishedBlogs({ ...validationResult.data });

    res.status(200).json({ data: blogs });
}

async function getSinglePublishedBlog(req: Request, res: Response) {
    //this is blog id from path
    const { id } = req.params;

    if (!id || id.trim() === "")
        throw new ApiError(400, {}, [], { id: "invalid blog id" });

    const blog = await fetchPublishedSingleBlog(id);

    if (blog === null) throw new NotFoundError(404, {}, ["blog not found"]);

    res.status(200).json({ data: blog });
}

export { getPublishedBlogs, getSinglePublishedBlog };
