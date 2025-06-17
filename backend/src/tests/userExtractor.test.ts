import { describe, test, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { createRequest, createResponse } from "node-mocks-http";
import { JWT_SECRET } from "../envConfig.ts";
import userExtractor from "../util/userExtractor.ts";

vi.mock("../db/userQueries.ts", () => {
    return {
        findUserById: vi.fn((id) => {
            const users = [
                { name: "martin", id: 2 },
                { name: "fuwante", id: 1 },
            ];

            const user = users.find((user) => user.id === id);
            return user;
        }),
    };
});

describe("Extracting user from token", () => {
    test("extracts the user and attaches it to reqest", async () => {
        const user = { id: 1, name: "fuwante" };
        const token = jwt.sign(user, JWT_SECRET);
        const req = createRequest({ headers: { authorization: `Bearer ${token}` } });
        const res = createResponse();
        const next = vi.fn();

        await userExtractor(req, res, next);

        expect(req.user.name).toBe(user.name);
    });
});
