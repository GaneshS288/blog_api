import { expect, test, describe, vi } from "vitest";
import request from "supertest";
import express from "express";
import authRouter from "../routes/authRouter.ts";
import { createUser } from "../db/userQueries.ts";

// mock the function that calls database to create user
vi.fn(createUser);

describe("signup a new user", () => {
    test("succesfully sign up a user and return 204 status", async () => {
        const app = express();
        app.use(express.json());
        app.use("/auth", authRouter);
        const user = { name: "ganesh", password: "blabbityy" };

        await request(app).post("/auth/signup").send(user).expect(204);
    });
});
