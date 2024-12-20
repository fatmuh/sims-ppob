import {prismaClient} from "../application/database.js";
import * as dotenv from "dotenv";

dotenv.config();

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
    const { first_name, last_name } = updateData;

    await prismaClient.$executeRaw`
        UPDATE users 
        SET first_name = ${first_name}, last_name = ${last_name}
        WHERE email = ${email}`;

    const updatedUser = await prismaClient.$queryRaw`
        SELECT email, first_name, last_name, profile_image 
        FROM users 
        WHERE email = ${email} LIMIT 1`;

    return {
        email: updatedUser[0].email,
        first_name: updatedUser[0].first_name,
        last_name: updatedUser[0].last_name,
        profile_image: process.env.ROOT_URL + updatedUser[0].profile_image
    };
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

    return {
        email: updatedUser[0].email,
        first_name: updatedUser[0].first_name,
        last_name: updatedUser[0].last_name,
        profile_image: process.env.ROOT_URL + profileImagePath
    };
};

export default {
    countUser,
    createUser,
    findUserByEmail,
    updateUser,
    updateProfileImage
};
