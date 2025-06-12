import { expect, test, describe, vi } from "vitest";
import { createRequest, createResponse } from "node-mocks-http";
import { signupUser, loginUser } from "../controllers/auth.ts";
import { createUser, findUserByName } from "../db/userQueries.ts";
import ApiError from "../errors/apiError.ts";

// mock the function that calls database to create user
vi.mock("../db/userQueries.ts", () => {
    return {
        createUser: vi.fn(),
        findUserByName: vi.fn((name) => {
            const users = [
                { name: "martin", password: "stall$3000" },
                { name: "fuwante", password: "drift&3ace" },
            ];

            const user = users.find((user) => user.name === name);
            return user;
        }),
    };
});

//mock bcrypt password compare method for login
vi.mock("bcryptjs", async () => {
    const actual = await vi.importActual("bcryptjs");

    return {
        default: {
            ...actual,
            compare: vi.fn((password) => {
                const users = [
                    { name: "martin", password: "stall$3000" },
                    { name: "fuwante", password: "drift&3ace" },
                ];

                const user = users.find((user) => user.password === password);
                return user;
            }),
        },
    };
});

describe("signup a new user", () => {
    test("succesfully signs up a user and return 201 status", async () => {
        const user = {
            name: "ganesh",
            password: "blabbityy@345",
            passwordConfirm: "blabbityy@345",
        };
        const req = createRequest({ method: "POST", body: user });
        const res = createResponse();
        vi.spyOn(res, "status");
        vi.spyOn(res, "json");

        await signupUser(req, res);

        expect(createUser).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 201,
            data: { message: "user successfully created" },
        });
    });

    test("sends 400 error when a user with same name exist in database", async () => {
        const user = {
            name: "martin",
            password: "stall$3000",
            passwordConfirm: "stall$3000",
        };
        const req = createRequest({ method: "POST", body: user });
        const res = createResponse();
        vi.spyOn(res, "status");
        vi.spyOn(res, "json");

        try {
            await signupUser(req, res);
        } catch (error) {
            expect(error instanceof ApiError).toBeTruthy();
        }
    });
});

describe("logging in a user", () => {
    test("succesfully logs in", async () => {
        const user = { name: "martin", password: "stall$3000" };
        const req = createRequest({ method: "POST", body: user });
        const res = createResponse();
        vi.spyOn(res, "status");
        const mockedJson = vi.spyOn(res, "json");

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockedJson.mock.lastCall?.[0].data.message).toBe(
            "successfully logged in"
        );
    });
});
