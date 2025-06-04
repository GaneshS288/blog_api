import { z } from "zod/v4";
import { escapeHtml } from "./validationUtils.ts";

const errorMessages = {
    nameEmpty: "name cannot be empty",
    nameTooShort: "name must be at least 4 characters long",
    passwordEmpty: "password can't be empty",
    passwordTooShort: "password must be at least 8 characters long",
    passwordMatchFail: "password doesn't match",
};

const UserSignupSchema = z
    .object({
        name: z
            .string()
            .nonempty(errorMessages.nameEmpty)
            .trim()
            .min(4, errorMessages.nameTooShort),
        password: z
            .string()
            .trim()
            .nonempty(errorMessages.passwordEmpty)
            .min(8, errorMessages.passwordTooShort),
        passwordConfirm: z.string().nonempty().min(8),
        secretPassword: z.string().optional(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: errorMessages.passwordMatchFail,
        path: ["passwordConfirm"],
    })
    .transform((data) => {
        return {
            name: escapeHtml(data.name),
            password: data.password,
            secretPassword: data.secretPassword,
        };
    });

const UserLoginSchema = z
    .object({
        name: z
            .string()
            .nonempty(errorMessages.nameEmpty)
            .trim()
            .min(4, errorMessages.nameTooShort),
        password: z
            .string()
            .trim()
            .nonempty(errorMessages.passwordEmpty)
            .min(8, errorMessages.passwordTooShort),
    })
    .transform((data) => {
        return {
            name: escapeHtml(data.name),
            password: data.password,
        };
    });

export { UserLoginSchema, UserSignupSchema };
