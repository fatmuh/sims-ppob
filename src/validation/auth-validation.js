import Joi from "joi";

const registerUserValidation = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).max(50).required().messages({
        'any.required': 'Email wajib diisi.',
        'string.email': 'Parameter email tidak sesuai format.',
        'string.max': 'Email tidak boleh lebih dari 50 karakter.'
    }),
    password: Joi.string().min(8).max(50).required().messages({
        'any.required': 'Kata sandi wajib diisi.',
        'string.min': 'Kata sandi harus memiliki minimal 8 karakter.',
        'string.max': 'Kata sandi tidak boleh lebih dari 50 karakter.'
    }),
    first_name: Joi.string().max(20).required().messages({
        'any.required': 'Nama pertama wajib diisi.',
        'string.max': 'Nama pertama tidak boleh lebih dari 20 karakter.'
    }),
    last_name: Joi.string().max(20).required().messages({
        'any.required': 'Nama terakhir wajib diisi.',
        'string.max': 'Nama terakhir tidak boleh lebih dari 20 karakter.'
    }),
})

export {
    registerUserValidation,
}