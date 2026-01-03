import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

import { dummyNewUser, blogGetSetup } from "./integrationTestUtils.ts";

beforeEach(async () => {
    await blogGetSetup();
});

describe("Editing a blog", () => {
    test("edits a blog to change the title and content", async () => {
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
            .put(`/blog/${blogId}`)
            .set({ authorization: `Bearer ${token}` })
            .send({ title: "namaste everyone", content: "hi dude", published: true })
            .expect(200);

        const getBlogRes = await api.get(`/blog/${blogId}`).expect(200);

        expect(getBlogRes.body.data.title).toBe("namaste everyone");
        expect(getBlogRes.body.data.content).toBe("hi dude");
    });

    test("edits fails if title or content is missing", async () => {
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
            .put(`/blog/${blogId}`)
            .set({ authorization: `Bearer ${token}` })
            .send({ title: "", content: "" , published: "bbad"})
            .expect(400);
    });

    test("edit is rejected if the user is not the author of blog", async () => {
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
            .put(`/blog/${fuwanteBlogId}`)
            .set({ authorization: `Bearer ${token}` })
            .send({ title: "This is my blog", content: "my content", published: true })
            .expect(403);
    });

    test("can change publish status", async () => {
        
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
            .put(`/blog/${blogId}`)
            .set({ authorization: `Bearer ${token}` })
            .send({ title: "namaste everyone", content: "hi dude", published: false })
            .expect(200);

        await api.get(`/blog/${blogId}`).expect(404);
    })

    test("return 404 if blog is not found", async () => {
        const api = request(app);

        await api.post("/auth/signup").send(dummyNewUser).expect(201);

        const loginRes = await api
            .post("/auth/login")
            .send({ name: dummyNewUser.name, password: dummyNewUser.password })
            .expect(200);

        const token = loginRes.body.token;

        await api
            .put(`/blog/wd234a$dw`)
            .set({ authorization: `Bearer ${token}` })
            .send({ title: "This is my blog", content: "my content" })
            .expect(404);
    });
});
