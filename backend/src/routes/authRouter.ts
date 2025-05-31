import { Router } from "express";
import { signupUser } from "../controllers/auth.ts";

const authRouter = Router();

authRouter.post("/signup", signupUser);

export default authRouter;
