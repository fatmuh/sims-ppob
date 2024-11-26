export class ResponseError extends Error {
    constructor(status, message, details = null) {
        super(message);
        this.status = status;
        this.details = details;
    }
}