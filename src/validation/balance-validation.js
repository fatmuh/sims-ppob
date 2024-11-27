import Joi from "joi";

const updateBalanceValidation = Joi.object({
    amount: Joi.number().greater(0).required().messages({
        'any.required': 'Jumlah harus diisi.',
        'number.greater': 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
        'number.base': 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
    })
});

export {
    updateBalanceValidation
}