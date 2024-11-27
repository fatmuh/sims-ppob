import {prismaClient} from "../application/database.js";

const countUser = async (email) => {
    const result = await prismaClient.$queryRaw`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE email = ${email}`;

    return Number(result[0].count);
};

const createUser = async (user) => {
    const { email, password, first_name, last_name, profile_image } = user;

    await prismaClient.$executeRaw`
        INSERT INTO users (email, password, first_name, last_name, profile_image)
        VALUES (${email}, ${password}, ${first_name}, ${last_name}, ${profile_image})`;

    const createdUser = await prismaClient.$queryRaw`
        SELECT id, email, first_name, last_name 
        FROM users 
        WHERE email = ${email} LIMIT 1`;

    return createdUser.length > 0 ? createdUser[0] : null;
};

const findUserByEmail = async (email) => {
    const user = await prismaClient.$queryRaw`
        SELECT id, email, password, first_name, last_name, profile_image
        FROM users
        WHERE email = ${email}
        LIMIT 1`;

    return user.length > 0 ? user[0] : null;
};

const updateUser = async (email, updateData) => {
    const { first_name, last_name, profile_image } = updateData;

    await prismaClient.$executeRaw`
        UPDATE users 
        SET first_name = ${first_name}, last_name = ${last_name}, profile_image = ${profile_image} 
        WHERE email = ${email}`;

    const updatedUser = await prismaClient.$queryRaw`
        SELECT email, first_name, last_name, profile_image 
        FROM users 
        WHERE email = ${email} LIMIT 1`;

    return updatedUser.length > 0 ? updatedUser[0] : null;
};

const updateProfileImage = async (email, profileImagePath) => {
    await prismaClient.$executeRaw`
        UPDATE users 
        SET profile_image = ${profileImagePath} 
        WHERE email = ${email}`;

    const updatedUser = await prismaClient.$queryRaw`
        SELECT email, first_name, last_name, profile_image
        FROM users 
        WHERE email = ${email} LIMIT 1`;

    return updatedUser.length > 0 ? updatedUser[0] : null;
};

export default {
    countUser,
    createUser,
    findUserByEmail,
    updateUser,
    updateProfileImage
};
