import {validate} from "../validation/validation.js";
import {registerUserValidation} from "../validation/auth-validation.js";
import {ResponseError} from "../error/response-error.js";
import * as bcrypt from "bcrypt";
import userRepository from "../repository/user-repository.js";
import balanceRepository from "../repository/balance-repository.js";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await userRepository.countUser(user.email);

    if (countUser > 0) {
        throw new ResponseError(400, "Akun sudah terdaftar!");
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

export default {
    register
};