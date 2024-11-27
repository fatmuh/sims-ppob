import Joi from "joi";

const updateTransactionValidation = Joi.object({
    service_code: Joi.string().required().messages({
        'any.required': 'Service code wajib diisi.',
    }),
});

export {
    updateTransactionValidation
}