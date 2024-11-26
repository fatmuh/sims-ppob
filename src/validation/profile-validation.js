import Joi from "joi";

const getProfileValidation = Joi.string().email().required();

const updateProfileValidation = Joi.object({
    first_name: Joi.string().max(20).required().messages({
        'any.required': 'Nama pertama wajib diisi.',
        'string.max': 'Nama pertama tidak boleh lebih dari 20 karakter.'
    }),
    last_name: Joi.string().max(20).required().messages({
        'any.required': 'Nama terakhir wajib diisi.',
        'string.max': 'Nama terakhir tidak boleh lebih dari 20 karakter.'
    }),
});

export {
    getProfileValidation,
    updateProfileValidation
}