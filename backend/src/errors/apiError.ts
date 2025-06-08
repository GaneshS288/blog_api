class ApiError extends Error {
    status: number;
    data: object;
    errors?: Array<string>;
    validationErrors?: Record<string, string>;

    constructor(
        status: number,
        data: object,
        errors?: string[] | null,
        validationErrors?: Record<string, string>
    ) {
        super();
        this.status = status;
        this.data = data;
        if (errors) this.errors = errors;
        if (validationErrors) this.validationErrors = validationErrors;
    }
}

export default ApiError;
