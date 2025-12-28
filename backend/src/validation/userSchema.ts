import { z } from "zod/v4";

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
            .nonempty(errorMessages.passwordEmpty)
            .min(8, errorMessages.passwordTooShort),
        passwordConfirm: z.string().nonempty(),
        secretPassword: z.string().optional(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: errorMessages.passwordMatchFail,
        path: ["passwordConfirm"],
    });

const UserLoginSchema = z.object({
    name: z
        .string()
        .nonempty(errorMessages.nameEmpty)
        .trim()
        .min(4, errorMessages.nameTooShort),
    password: z
        .string()
        .nonempty(errorMessages.passwordEmpty)
        .min(8, errorMessages.passwordTooShort),
});

export { UserLoginSchema, UserSignupSchema };
