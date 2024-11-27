import userRepository from "../repository/user-repository.js";
import {ResponseError} from "../error/response-error.js";
import balanceRepository from "../repository/balance-repository.js";
import {validate} from "../validation/validation.js";
import {updateBalanceValidation} from "../validation/balance-validation.js";
import transactionRepository from "../repository/transaction-repository.js";

const get = async (email) => {

    let user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new ResponseError(404, 404, "Akun tidak ditemukan");
    }

    return balanceRepository.findBalanceByUserId(user.id);
}

const update = async (email, request) => {
    const user = validate(updateBalanceValidation, request);
    const dateNow = new Date();

    const existingUser = await userRepository.findUserByEmail(email);

    if (!existingUser) {
        throw new ResponseError(404, 404, "Akun tidak ditemukan.");
    }

    const updateData = {};
    if (user.amount !== undefined) updateData.amount = user.amount;

    const updateBalance = balanceRepository.updateBalance(existingUser.id, updateData);

    if (updateBalance) {
        const day = String(dateNow.getDate()).padStart(2, '0');
        const month = String(dateNow.getMonth() + 1).padStart(2, '0');
        const year = dateNow.getFullYear();
        const formattedDate = `${day}${month}${year}`;
        const formattedDateDb = `${year}-${month}-${day}`;

        const transactionCount = await transactionRepository.countTransactionsByDate(formattedDateDb);

        const invoiceNumber = `INV${formattedDate}-${String(transactionCount + 1).padStart(3, '0')}`;

        await transactionRepository.createTransaction({
            user_id: existingUser.id,
            service_id: null,
            invoice_number: invoiceNumber,
            transaction_type: "TOPUP",
            total_amount: user.amount,
            created_on: dateNow,
        });
    }

    return updateBalance;
}

export default {
    get,
    update
}