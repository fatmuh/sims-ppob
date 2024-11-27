import {prismaClient} from "../application/database.js";

const createTransaction = async (data) => {
    const { user_id, service_id, invoice_number, transaction_type, total_amount, created_on } = data;

    await prismaClient.$executeRaw`
        INSERT INTO transactions (user_id, service_id, invoice_number, transaction_type, total_amount, created_on)
        VALUES (${user_id}, ${service_id}, ${invoice_number}, ${transaction_type}, ${total_amount}, ${created_on})`;

    const createdTransaction = await prismaClient.$queryRaw`
        SELECT user_id, service_id, invoice_number, transaction_type, total_amount, created_on 
        FROM transactions 
        WHERE user_id = ${user_id} LIMIT 1`;

    return createdTransaction.length > 0 ? createdTransaction[0] : null;
};

const countTransactionsByDate = async (formattedDateDb) => {
    const startOfDay = new Date(`${formattedDateDb}T00:00:00Z`);
    const endOfDay = new Date(`${formattedDateDb}T23:59:00Z`);

    const result = await prismaClient.$queryRaw`
        SELECT COUNT(*) as count
        FROM transactions 
        WHERE created_on >= ${startOfDay} 
        AND created_on < ${endOfDay}`;

    return Number(result[0].count);
};


export default {
    createTransaction,
    countTransactionsByDate
};