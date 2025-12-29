class NotFoundError extends Error {
    status: number;
    data: object;
    errors: Array<string>;

    constructor(
        status: number,
        data: object,
        errors: string[] = ["resource not found"]
    ) {
        super();
        this.status = status;
        this.data = data;
        this.errors = errors;
    }
}

export { NotFoundError };
