import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

import { commentCount, seedBlogs } from "./integrationTestUtils.ts";

beforeEach(async () => {
    await seedBlogs();
});

describe("fetching comments for a blog", () => {
    test("successfully returns comments from a blog", async () => {
        const api = request(app);

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;

        const getCommentsRes = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 10 });

        expect(getCommentsRes.body.data.comments.length).toBe(10);
        expect(getCommentsRes.body.data.count).toBe(commentCount);
    });

    test("pagination works for comments", async () => {
        const api = request(app);

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;

        const getCommentsRes = await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 2, size: 10 })
            .expect(200);

        expect(getCommentsRes.body.data.comments.length).toBe(
            commentCount - 10
        );
        expect(getCommentsRes.body.data.count).toBe(commentCount);
    });

    test("returns 404 if the blog id is bad", async () => {
        const api = request(app);

        const fuwanteBlogId = crypto.randomUUID();

        await api
            .get("/comments")
            .query({ blogId: fuwanteBlogId, order: "desc", page: 1, size: 10 })
            .expect(404);
    });
});
