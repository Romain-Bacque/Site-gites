class ExpressError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ExpressError.prototype); // this used to add custom error class with the new features to the built-in Error class
    }
}

export default ExpressError;