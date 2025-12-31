import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

import { dummyNewUser, blogGetSetup } from "./integrationTestUtils.ts";

beforeEach(async () => {
    await blogGetSetup();
});

describe("deleting a blog", () => {
    test("sucessfully deletes a blog", async () => {
        const api = request(app);

        await api.post("/auth/signup").send(dummyNewUser).expect(201);

        const loginRes = await api
            .post("/auth/login")
            .send({ name: dummyNewUser.name, password: dummyNewUser.password })
            .expect(200);

        const token = loginRes.body.token;

        const blogCreatRes = await api
            .post("/blog")
            .set({ authorization: `Bearer ${token}` })
            .send({ title: "heelo", content: "hi baby", published: true })
            .expect(201);

        const blogId = blogCreatRes.body.data.remote_id;

        await api
            .delete(`/blog/${blogId}`)
            .set({ authorization: `Bearer ${token}` })
            .expect(204);
        await api.get(`/blog/${blogId}`).expect(404);
    });

    test("returns 404 if the blog doesn't exist", async () => {
        const api = request(app);

        await api.post("/auth/signup").send(dummyNewUser).expect(201);

        const loginRes = await api
            .post("/auth/login")
            .send({ name: dummyNewUser.name, password: dummyNewUser.password })
            .expect(200);

        const token = loginRes.body.token;

        const blogId = crypto.randomUUID();

        await api
            .delete(`/blog/${blogId}`)
            .set({ authorization: `Bearer ${token}` })
            .expect(404);
    });

    test("returns 403 unauthorized if user is not author of blog", async () => {
        const api = request(app);

        await api.post("/auth/signup").send(dummyNewUser).expect(201);

        const loginRes = await api
            .post("/auth/login")
            .send({ name: dummyNewUser.name, password: dummyNewUser.password })
            .expect(200);

        const token = loginRes.body.token;

        const getBlogsRes = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, name: "fuwante" })
            .expect(200);

        const fuwanteBlogId = getBlogsRes.body.data.blogs[0].remote_id;

        await api
            .delete(`/blog/${fuwanteBlogId}`)
            .set({ authorization: `Bearer ${token}` })
            .expect(403);
    });
});
