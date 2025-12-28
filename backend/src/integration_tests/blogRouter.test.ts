import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

import { dummyExistingUsers, testSetup } from "./integrationTestUtils.ts";

beforeEach(async () => {
    await testSetup();
});

describe("creating a new blog", () => {
    test("successfullt creates a new blog", async () => {
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

        await api
            .post("/blog")
            .set({ authorization: `Bearer ${token}` })
            .send({ title: "heelo", content: "hi baby", published: true })
            .expect(201);
    });

    test("sends error status if title or content is empty with appropriate messages", async () => {
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

        const res = await api
            .post("/blog")
            .set({ authorization: `Bearer ${token}` })
            .send({ title: "  ", content: "   ", published: true })
            .expect(400);

        expect(res.body.validationErrors.title).toBe("title cannot be empty");
        expect(res.body.validationErrors.content).toBe(
            "content cannot be empty"
        );
    });

    test("does not create blog with invalid token", async () => {
        const api = request(app);

        await api
            .post("/blog")
            .set({ authorization: `Bearer wdwd2313dadaz41131` })
            .send({ title: "heelo", content: "hi baby", published: true })
            .expect(401);
    });
});

describe("returning blogs from the api", () => {
    test("returns blogs specified in result_count param", async () => {
        const api = request(app);

        const res = await api
            .get("/blogs")
            .query({ order: "desc", page: 1, result_count: 6 })
            .expect(200);
        expect(res.body.data.blogs.length).toBe(6);
        expect(res.body.data.count).toBe(8);
        console.log(res.body.data.blogs);
    });

    test("pagination works properly", async () => {
        const api = request(app);

        const res = await api
            .get("/blogs")
            .query({ order: "desc", page: 2, result_count: 5 })
            .expect(200);
        expect(res.body.data.blogs.length).toBe(3);
        expect(res.body.data.count).toBe(8);
        console.log(res.body.data.blogs);
    });
});
