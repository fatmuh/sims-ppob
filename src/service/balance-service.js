import userRepository from "../repository/user-repository.js";
import {ResponseError} from "../error/response-error.js";
import balanceRepository from "../repository/balance-repository.js";

const get = async (email) => {

    let user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new ResponseError(404, 404, "Akun tidak ditemukan");
    }

    return balanceRepository.findBalanceByUserId(user.id);
}

export default {
    get
}