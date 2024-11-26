import { ResponseError } from "../error/response-error.js";

export const validate = (schema, data) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        const emailError = error.details.find(detail => detail.path[0] === 'email');
        if (emailError) {
            throw new ResponseError(102, 400, emailError.message);
        }

        const errors = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
        }));
        throw new ResponseError(400, 400,  "Terjadi kesalahan", JSON.stringify({ errors }));
    }

    return value;
};
