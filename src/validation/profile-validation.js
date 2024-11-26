import Joi from "joi";

const getProfileValidation = Joi.string().email().required();

export {
    getProfileValidation
}