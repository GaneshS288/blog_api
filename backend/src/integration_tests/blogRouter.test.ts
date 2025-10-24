import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS, SECRET_PASSWORD } from "../envConfig.ts";
import app from "../app.ts";
import prisma from "../db/prisma.ts";
import { dummyExistingUsers, dummyNewUser } from "./integrationTestUtils.ts";

beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.blogs.deleteMany();
    const users = dummyExistingUsers.map((user) => {
        return {
            name: user.name,
            passwordHash: bcrypt.hashSync(user.password, SALT_ROUNDS),
        };
    });
    await prisma.users.createMany({ data: users });
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
            .post("/blogs")
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
            .post("/blogs")
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
            .post("/blogs")
            .set({ authorization: `Bearer wdwd2313dadaz41131` })
            .send({ title: "heelo", content: "hi baby", published: true })
            .expect(401);     
    })
});
