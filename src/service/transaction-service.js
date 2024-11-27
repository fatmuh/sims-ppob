import userRepository from "../repository/user-repository.js";
import {ResponseError} from "../error/response-error.js";
import balanceRepository from "../repository/balance-repository.js";
import {validate} from "../validation/validation.js";
import transactionRepository from "../repository/transaction-repository.js";
import {updateTransactionValidation} from "../validation/transaction-validation.js";
import servicesRepository from "../repository/services-repository.js";

const post = async (email, request) => {
    const transaction = validate(updateTransactionValidation, request);
    const dateNow = new Date();

    const existingUser = await userRepository.findUserByEmail(email);
    const existingBalance = await balanceRepository.findBalanceByUserId(existingUser.id);

    if (!existingUser) {
        throw new ResponseError(404, 404, "Akun tidak ditemukan.");
    }

    const existingServices = await servicesRepository.findServiceByServiceCode(transaction.service_code);

    if (!existingServices) {
        throw new ResponseError(102, 400, "Service status Layanan tidak ditemukan");
    }

    if (existingServices.service_tariff > existingBalance.balance) {
        throw new ResponseError(108, 400, "Saldo tidak mencukupi");
    } else {
        const updateData = {};
        if (existingServices.service_tariff !== undefined) updateData.amount = existingServices.service_tariff;

        await balanceRepository.updateBalanceMinus(existingUser.id, updateData);
    }

    const day = String(dateNow.getDate()).padStart(2, '0');
    const month = String(dateNow.getMonth() + 1).padStart(2, '0');
    const year = dateNow.getFullYear();
    const formattedDate = `${day}${month}${year}`;
    const formattedDateDb = `${year}-${month}-${day}`;

    const transactionCount = await transactionRepository.countTransactionsByDate(formattedDateDb);

    const invoiceNumber = `INV${formattedDate}-${String(transactionCount + 1).padStart(3, '0')}`;

    return transactionRepository.createTransaction({
        user_id: existingUser.id,
        service_id: existingServices.id,
        invoice_number: invoiceNumber,
        transaction_type: "PAYMENT",
        total_amount: existingServices.service_tariff,
        description: existingServices.service_name,
        created_on: dateNow,
    });
}

const get = async (limit, offset) => {
    const records = await transactionRepository.getTransactionHistory(limit, offset);

    offset = offset || 0;

    const limitValue = limit || records.length;

    return {
        offset,
        limit: limitValue,
        records
    };
};

export default {
    post,
    get
}