import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

import { dummyExistingUsers, blogPostSetup } from "./integrationTestUtils.ts";

beforeEach(async () => {
    await blogPostSetup();
});

describe("creating a new blog", () => {
    test("successfully creates a new blog", async () => {
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

        const postRes = await api
            .post("/blog")
            .set({ authorization: `Bearer ${token}` })
            .send({ title: "heelo", content: "hi baby", published: true })
            .expect(201);
        
        expect(postRes.body.data.title).toBe("heelo");
        expect(postRes.body.data.content).toBe("hi baby");
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
