import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS, SECRET_PASSWORD } from "../envConfig.ts";
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

    test("signs up admin user if correct secret password is provided", async () => {
        const user = { ...dummyNewUser, secretPassword: SECRET_PASSWORD };
        const res = await request(app)
            .post("/auth/signup")
            .send(user)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(res.body.data.message).toBe("admin user successfully created");
    });

    test("returns 400 if the user already exists with appropriete error message", async () => {
        const user = dummyExistingUsers[0];
        const res = await request(app)
            .post("/auth/signup")
            .send(user)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(res.body.validationErrors.name).toBe(
            "this username already exists"
        );
    });

    test("returns 400 with error message if name or password length is short", async () => {
        const user = {
            name: "gan",
            password: "babwde",
            passwordConfirm: "babwde",
        };
        const res = await request(app)
            .post("/auth/signup")
            .send(user)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(res.body.validationErrors.name).toBe(
            "name must be at least 4 characters long"
        );
        expect(res.body.validationErrors.password).toBe(
            "password must be at least 8 characters long"
        );
    });

    test("returns 400 if passwords don't match", async () => {
        const user = dummyNewUser;
        dummyNewUser.passwordConfirm = "hello";

        const res = await request(app)
            .post("/auth/signup")
            .send(user)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(res.body.validationErrors.passwordConfirm).toBe(
            "password doesn't match"
        );
    });
});

describe("logging in a user", () => {
    test("successfully logs in", async () => {
        const user = dummyExistingUsers[0];
        const res = await request(app)
            .post("/auth/login")
            .send({ name: user.name, password: user.password })
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(res.body.data.message).toBe("successfully logged in");
    });

    test("login fails if user doesn't exist", async () => {
        const user = dummyNewUser;
        const res = await request(app)
            .post("/auth/login")
            .send({ name: user.name, password: user.password })
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(res.body.validationErrors.name).toBe("user doesn't exist");
    });

    test("login fails if password is incorrect", async () => {
        const user = dummyExistingUsers[0];
        const res = await request(app)
            .post("/auth/login")
            .send({ name: user.name, password: "aaaaaaaaaaaaaa" })
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(res.body.validationErrors.password).toBe(
            "password is incorrect"
        );
    });
});
