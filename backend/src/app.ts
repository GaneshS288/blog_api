import express from "express"
import authRouter from "./routes/authRouter.ts"
import errorHandler from "./errors/errorHandler.ts";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
