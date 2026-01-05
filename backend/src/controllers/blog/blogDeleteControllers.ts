import { Request, Response } from "express";
import { NotFoundError } from "../../errors/notFoundError.ts";
import { AuthorizationError } from "../../errors/AuthorizationError.ts";
import { fetchAnySingleBlog } from "../../db/blog/BlogGetQueries.ts";
import { removeBlog } from "../../db/blog/blogDeleteQueries.ts";



async function deleteSingleBlog(req: Request, res: Response) {
    const { id } = req.params;

    const blogExists = await fetchAnySingleBlog(id);
    if (!blogExists) throw new NotFoundError(404, {}, ["blog not found"]);
    if (blogExists.author_id !== req.user?.id) throw new AuthorizationError();

    await removeBlog(id);

    res.sendStatus(204);
}

export { deleteSingleBlog }