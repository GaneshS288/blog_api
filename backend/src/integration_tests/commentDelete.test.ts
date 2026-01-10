import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

import {
    fuwanteUserDetails,
    seedBlogs,
    martinUserDetails,
} from "./integrationTestUtils.ts";

beforeEach(async () => {
    await seedBlogs();
});

describe("delete comments from blog", () => {
    test("successfully deletes a comment from blog", async () => {
        const api = request(app);

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;

        const fuwanteBlogCommentsRes = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 10 });

        const commentToDelete = fuwanteBlogCommentsRes.body.data.comments[0];

        const fuwanteLoginRes = await api
            .post("/auth/login")
            .send({
                name: fuwanteUserDetails.name,
                password: fuwanteUserDetails.password,
            })
            .expect(200);

        const fuwanteToken = fuwanteLoginRes.body.token;

        await api
            .delete(`/comment/${commentToDelete.remote_id}`)
            .set({ authorization: `Bearer ${fuwanteToken}` })
            .expect(204);

        const fuwanteBlogCommentsResAfterDelete = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 10 });

        expect(fuwanteBlogCommentsRes.body.data.count - 1).toBe(
            fuwanteBlogCommentsResAfterDelete.body.data.count
        );
    });

    test("returns 403 unauthorized if the user deleting the comment is not author of comment", async () => {
        const api = request(app);

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;

        const fuwanteBlogCommentsRes = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 10 });

        const commentToDelete = fuwanteBlogCommentsRes.body.data.comments[0];

        const martinLoginRes = await api
            .post("/auth/login")
            .send({
                name: martinUserDetails.name,
                password: martinUserDetails.password,
            })
            .expect(200);

        const martinToken = martinLoginRes.body.token;

        await api
            .delete(`/comment/${commentToDelete.remote_id}`)
            .set({ authorization: `Bearer ${martinToken}` })
            .expect(403);
    });

    test("returns 404 if the comment doesn't exist", async () => {
        const api = request(app);

        const fuwanteLoginRes = await api
            .post("/auth/login")
            .send({
                name: fuwanteUserDetails.name,
                password: fuwanteUserDetails.password,
            })
            .expect(200);

        const fuwanteToken = fuwanteLoginRes.body.token;
        const commentId = crypto.randomUUID();

        await api
            .delete(`/comment/${commentId}`)
            .set({ authorization: `Bearer ${fuwanteToken}` })
            .expect(404);
    });
});
