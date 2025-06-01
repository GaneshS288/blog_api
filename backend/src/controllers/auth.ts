import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { createUser } from "../db/userQueries.ts";

async function signupUser(req: Request, res: Response) {
    const {
        name,
        password,
        secretPassword,
    }: { name: string; password: string; secretPassword: string } = req.body;

    const passwordhash = await bcrypt.hash(password, 12);

    await createUser(name, passwordhash);

    res.status(201).json({
        status: 201,
        data: { message: "user successfully created" },
    });
}

export { signupUser };
