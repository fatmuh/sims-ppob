import {validate} from "../validation/validation.js";
import {loginAccountValidation, registerUserValidation} from "../validation/auth-validation.js";
import {ResponseError} from "../error/response-error.js";
import * as bcrypt from "bcrypt";
import userRepository from "../repository/user-repository.js";
import balanceRepository from "../repository/balance-repository.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await userRepository.countUser(user.email);

    if (countUser > 0) {
        throw new ResponseError(400,400, "Akun sudah terdaftar!");
    }

    user.password = await bcrypt.hash(user.password, 10);

    const userRegister = await userRepository.createUser(user);

    if (userRegister) {
        await balanceRepository.createBalance({
            user_id: userRegister.id,
            balance: 0,
        });
    }

    return userRegister
};

const login = async (request) => {
    const loginRequest = validate(loginAccountValidation, request);

    const user = await userRepository.findUserByEmail(loginRequest.email);

    if (!user) {
        throw new ResponseError(103, 401, "Username atau password salah");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordValid) {
        throw new ResponseError(103, 401, "Username atau password salah");
    }

    const token = jwt.sign(
        {
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "12h",
        }
    );

    return {
        token,
    };
};

export default {
    register,
    login
};