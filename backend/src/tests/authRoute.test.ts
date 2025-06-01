import { expect, test, describe, vi } from "vitest";
import { createRequest, createResponse } from "node-mocks-http";
import { signupUser } from "../controllers/auth.ts";
import { createUser } from "../db/userQueries.ts";

// mock the function that calls database to create user
vi.mock("../db/userQueries.ts", () => {
    return {
        createUser: vi.fn(), 
    }
})


describe("signup a new user", () => {
    test("succesfully sign up a user and return 201 status", async () => {
        const user = { name: "ganesh", password: "blabbityy@345" };
        const req = createRequest({ method: "POST", body: user });
        const res = createResponse();
        vi.spyOn(res, "status");
        vi.spyOn(res, "json");

        await signupUser(req, res);

        expect(createUser).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({status: 201, data: { message: "user successfully created"}})
    });
    
});
