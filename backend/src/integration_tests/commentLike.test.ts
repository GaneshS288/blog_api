import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

import {
    fuwanteUserDetails,
    seedBlogs,
} from "./integrationTestUtils.ts";

beforeEach(async () => {
    await seedBlogs();
});

describe("liking comments", () => {
    test("successfully likes a comment", async () => {
        const api = request(app);

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;

        const fuwanteBlogCommentsRes = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 10 });

        const commentToLike = fuwanteBlogCommentsRes.body.data.comments[0];

        const fuwanteLoginRes = await api
            .post("/auth/login")
            .send({
                name: fuwanteUserDetails.name,
                password: fuwanteUserDetails.password,
            })
            .expect(200);

        const fuwanteToken = fuwanteLoginRes.body.token;

        await api
            .post(`/comment/${commentToLike.remote_id}/like`)
            .set({ authorization: `Bearer ${fuwanteToken}` })
            .expect(204);

        const fuwanteBlogCommentsResAfterLike = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 20 });

        const commentAfterLike =
            fuwanteBlogCommentsResAfterLike.body.data.comments.find(
                //@ts-expect-error no need to type the comment here
                (comment) => comment.remote_id === commentToLike.remote_id
            );

        expect(commentAfterLike.likes).toBe(1);
    });

    test("successfully remove a like from comment", async () => {
        const api = request(app);

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;

        const fuwanteBlogCommentsRes = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 10 });

        const commentToLike = fuwanteBlogCommentsRes.body.data.comments[0];

        const fuwanteLoginRes = await api
            .post("/auth/login")
            .send({
                name: fuwanteUserDetails.name,
                password: fuwanteUserDetails.password,
            })
            .expect(200);

        const fuwanteToken = fuwanteLoginRes.body.token;

        await api
            .post(`/comment/${commentToLike.remote_id}/like`)
            .set({ authorization: `Bearer ${fuwanteToken}` })
            .expect(204);

        const fuwanteBlogCommentsResAfterLike = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 20 });

        const commentAfterLike =
            fuwanteBlogCommentsResAfterLike.body.data.comments.find(
                //@ts-expect-error no need to type the comment here
                (comment) => comment.remote_id === commentToLike.remote_id
            );

        expect(commentAfterLike.likes).toBe(1);

        await api
            .delete(`/comment/${commentToLike.remote_id}/like`)
            .set({ authorization: `Bearer ${fuwanteToken}` })
            .expect(204);

        const fuwanteBlogCommentsResAfterRemovingLike = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 20 });

        const commentAfterRemovingLike =
            fuwanteBlogCommentsResAfterRemovingLike.body.data.comments.find(
                //@ts-expect-error no need to type the comment here
                (comment) => comment.remote_id === commentToLike.remote_id
            );

        expect(commentAfterRemovingLike.likes).toBe(0);
    });

    test("returns 400 if there is already a like from user on comment", async () => {
        const api = request(app);

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;

        const fuwanteBlogCommentsRes = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 10 });

        const commentToLike = fuwanteBlogCommentsRes.body.data.comments[0];

        const fuwanteLoginRes = await api
            .post("/auth/login")
            .send({
                name: fuwanteUserDetails.name,
                password: fuwanteUserDetails.password,
            })
            .expect(200);

        const fuwanteToken = fuwanteLoginRes.body.token;

        await api
            .post(`/comment/${commentToLike.remote_id}/like`)
            .set({ authorization: `Bearer ${fuwanteToken}` })
            .expect(204);

        await api
            .post(`/comment/${commentToLike.remote_id}/like`)
            .set({ authorization: `Bearer ${fuwanteToken}` })
            .expect(400);
    })

    test("returns 404 if users tries to delete like from a commment they haven't liked", async () => {
        const api = request(app);

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;

        const fuwanteBlogCommentsRes = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 10 });

        const commentToLike = fuwanteBlogCommentsRes.body.data.comments[0];

        const fuwanteLoginRes = await api
            .post("/auth/login")
            .send({
                name: fuwanteUserDetails.name,
                password: fuwanteUserDetails.password,
            })
            .expect(200);

        const fuwanteToken = fuwanteLoginRes.body.token;

        await api
            .delete(`/comment/${commentToLike.remote_id}/like`)
            .set({ authorization: `Bearer ${fuwanteToken}` })
            .expect(404);
    })
});
