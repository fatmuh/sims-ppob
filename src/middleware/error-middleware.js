import {ResponseError} from "../error/response-error.js";

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ResponseError) {
        res.status(err.statusHeader).json({
            status: err.status,
            message: err.message,
            data: null,
            ...(err.details ? JSON.parse(err.details) : {})
        });
    } else {
        console.error(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export { errorMiddleware };
