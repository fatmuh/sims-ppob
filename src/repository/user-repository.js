import {prismaClient} from "../application/database.js";

const countUser = async (email, phone) => {
    return prismaClient.user.count({
        where: {
            email,
        },
    });
};

const createUser = async (user) => {
    return prismaClient.user.create({
        data: user,
        select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
        },
    });
};

export default {
    countUser,
    createUser
};
