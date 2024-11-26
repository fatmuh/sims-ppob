import {ResponseError} from "../error/response-error.js";

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ResponseError) {
        res.status(err.status).json({
            message: err.message,
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
