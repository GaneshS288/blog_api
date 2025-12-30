class AuthorizationError extends Error {
    data: object;
    errors: string[];
    status = 403;

    constructor(
        data = {},
        errors = ["you're not authorized to perform this action"]
    ) {
        super();
        this.data = data;
        this.errors = errors;
    }
}

export { AuthorizationError };
