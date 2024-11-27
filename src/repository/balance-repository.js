import {prismaClient} from "../application/database.js";

const createBalance = async (data) => {
    const { user_id, balance } = data;

    await prismaClient.$executeRaw`
        INSERT INTO balances (user_id, balance)
        VALUES (${user_id}, ${balance})`;

    const createdBalance = await prismaClient.$queryRaw`
        SELECT id, balance 
        FROM balances 
        WHERE user_id = ${user_id} LIMIT 1`;

    return createdBalance.length > 0 ? createdBalance[0] : null;
};

const findBalanceByUserId = async (user_id) => {
    const balance = await prismaClient.$queryRaw`
        SELECT balance
        FROM balances
        WHERE user_id = ${user_id}
        LIMIT 1`;

    if (balance.length > 0) {
        return {
            balance: Number(balance[0].balance)
        };
    }

    return null;
};

const updateBalance = async (user_id, updateData) => {
    const { amount } = updateData;

    await prismaClient.$executeRaw`
        UPDATE balances 
        SET balance = balance + ${amount} 
        WHERE user_id = ${user_id}`;

    return {
        balance: amount
    };
};

const updateBalanceMinus = async (user_id, updateData) => {
    const { amount } = updateData;

    await prismaClient.$executeRaw`
        UPDATE balances 
        SET balance = balance - ${amount} 
        WHERE user_id = ${user_id}`;

    return {
        balance: amount
    };
};

export default {
    createBalance,
    findBalanceByUserId,
    updateBalance,
    updateBalanceMinus
};