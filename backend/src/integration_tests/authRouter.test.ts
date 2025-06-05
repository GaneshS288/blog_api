import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "../envConfig.ts";
import app from "../app.ts";
import prisma from "../db/prisma.ts";
import { dummyExistingUsers, dummyNewUser } from "./integrationTestUtils.ts";


beforeEach(async () => {
    await prisma.users.deleteMany();
    const users = dummyExistingUsers.map((user) => {
        return {
            name: user.name,
            passwordHash: bcrypt.hashSync(user.password, SALT_ROUNDS),
        };
    });
    await prisma.users.createMany({ data: users });
});

describe("Signup a user", () => {
    test("successfully signs up a user", async () => {
        const res = await request(app)
            .post("/auth/signup")
            .send(dummyNewUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(res.body.data.message).toBe("user successfully created");
    });

    test("returns 400 if the user already exists with appropriete error message", async () => {
        const res = await request(app)
            .post("/auth/signup")
            .send(dummyExistingUsers[0])
            .expect(400)
            .expect("Content-Type", /application\/json/);
    });
});
