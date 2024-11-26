export class ResponseError extends Error {
    constructor(status, statusHeader, message, details = null) {
        super(message);
        this.status = status;
        this.statusHeader = statusHeader;
        this.details = details;
    }
}