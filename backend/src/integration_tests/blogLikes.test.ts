import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

import { dummyNewUser, seedBlogs } from "./integrationTestUtils.ts";

beforeEach(async () => {
    await seedBlogs();
});

describe("blog likes test", () => {
    test("successfully likes a blog", async () => {
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
            .post(`/blog/${fuwanteBlogId}/like`)
            .set({ authorization: `Bearer ${token}` })
            .expect(204);

        const likedBlogRes = await api
            .get(`/blog/${fuwanteBlogId}`)
            .expect(200);

        expect(likedBlogRes.body.data.likes).toBe(1);
    });

    test("successfully removes a like from blog", async () => {
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
            .post(`/blog/${fuwanteBlogId}/like`)
            .set({ authorization: `Bearer ${token}` })
            .expect(204);

        await api
            .delete(`/blog/${fuwanteBlogId}/like`)
            .set({ authorization: `Bearer ${token}` })
            .expect(204);

        const likedBlogRes = await api
            .get(`/blog/${fuwanteBlogId}`)
            .expect(200);

        expect(likedBlogRes.body.data.likes).toBe(0);
    });

    test("returns 400 if user tries to like a blog they already liked", async () => {
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
            .post(`/blog/${fuwanteBlogId}/like`)
            .set({ authorization: `Bearer ${token}` })
            .expect(204);

        await api
            .post(`/blog/${fuwanteBlogId}/like`)
            .set({ authorization: `Bearer ${token}` })
            .expect(400);
    });

    test("returns 400 if the user tries to remove like from a blog they haven't liked", async () => {
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
            .delete(`/blog/${fuwanteBlogId}/like`)
            .set({ authorization: `Bearer ${token}` })
            .expect(400);
    });
});
