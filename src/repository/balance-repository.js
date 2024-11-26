import {prismaClient} from "../application/database.js";

const createBalance = async (data) => {
    return prismaClient.balance.create({
        data,
        select: {
            id: true,
        },
    });
};

export default {
    createBalance
};