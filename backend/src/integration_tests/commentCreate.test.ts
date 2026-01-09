import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

import { dummyExistingUsers, seedBlogs } from "./integrationTestUtils.ts";

beforeEach(async () => {
    await seedBlogs();
});

describe("posting comments on blog", () => {
    test("sucessfully posts a comment on blog", async () => {
        const userDetails = {
            name: dummyExistingUsers[0].name,
            password: dummyExistingUsers[0].password,
        };
        const api = request(app);

        const loginRes = await api
            .post("/auth/login")
            .send(userDetails)
            .expect(200);

        const token = loginRes.body.token;

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;
        const comment = "this is a comment";

        const commentRes = await api
            .post("/comment")
            .set({ authorization: `Bearer ${token}` })
            .query({ blogId: fuwanteBlogId })
            .send({ content: comment })
            .expect(201);

        expect(commentRes.body.data.content).toBe(comment);
        expect(commentRes.body.data.blog.remote_id).toBe(fuwanteBlogId);
        expect(commentRes.body.data.author.name).toBe(userDetails.name);
    });

    test("successfully creates a reply on existing comment", async () => {
        const userDetails = {
            name: dummyExistingUsers[0].name,
            password: dummyExistingUsers[0].password,
        };
        const api = request(app);

        const loginRes = await api
            .post("/auth/login")
            .send(userDetails)
            .expect(200);

        const token = loginRes.body.token;

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;
        const comment = "this is a comment";

        const commentRes = await api
            .post("/comment")
            .set({ authorization: `Bearer ${token}` })
            .query({ blogId: fuwanteBlogId })
            .send({ content: comment })
            .expect(201);

        const commentId = commentRes.body.data.remote_id;
        const reply = "this is a reply to a comment";

        const replyRes = await api
            .post(`/comment/${commentId}`)
            .set({ authorization: `Bearer ${token}` })
            .query({ blogId: fuwanteBlogId })
            .send({ content: reply })
            .expect(201);

        expect(replyRes.body.data.content).toBe(reply);
        expect(replyRes.body.data.parent_comment.remote_id).toBe(commentId);
        expect(replyRes.body.data.author.name).toBe(userDetails.name);
    });

    test("fails if blog doesn't exist", async () => {
        const userDetails = {
            name: dummyExistingUsers[0].name,
            password: dummyExistingUsers[0].password,
        };
        const api = request(app);

        const loginRes = await api
            .post("/auth/login")
            .send(userDetails)
            .expect(200);

        const token = loginRes.body.token;

        const randomBlogId = crypto.randomUUID();

        await api
            .post("/comment")
            .set({ authorization: `Bearer ${token}` })
            .query({ blogId: randomBlogId })
            .send({ content: "bla bla" })
            .expect(404);
    });

    test("returns 404 if parent comment isn't found when posting a reply", async () => {
        const userDetails = {
            name: dummyExistingUsers[0].name,
            password: dummyExistingUsers[0].password,
        };
        const api = request(app);

        const loginRes = await api
            .post("/auth/login")
            .send(userDetails)
            .expect(200);

        const token = loginRes.body.token;

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;

        const commentId = crypto.randomUUID();
        const reply = "this is a reply to a comment";

        await api
            .post(`/comment/${commentId}`)
            .set({ authorization: `Bearer ${token}` })
            .query({ blogId: fuwanteBlogId })
            .send({ content: reply })
            .expect(404);
    });

    test("returns 400 if content is empty", async () => {
        const userDetails = {
            name: dummyExistingUsers[0].name,
            password: dummyExistingUsers[0].password,
        };
        const api = request(app);

        const loginRes = await api
            .post("/auth/login")
            .send(userDetails)
            .expect(200);

        const token = loginRes.body.token;

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;
        const comment = "       ";

        await api
            .post("/comment")
            .set({ authorization: `Bearer ${token}` })
            .query({ blogId: fuwanteBlogId })
            .send({ content: comment })
            .expect(400);
    });
});
