import {validate} from "../validation/validation.js";
import {getProfileValidation, updateProfileValidation} from "../validation/profile-validation.js";
import userRepository from "../repository/user-repository.js";
import {ResponseError} from "../error/response-error.js";

const get = async (email) => {
    email = validate(getProfileValidation, email);

    let profile = await userRepository.findUserByEmail(email);

    if (!profile) {
        throw new ResponseError(404, 404, "Akun tidak ditemukan");
    }

    const response = {
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        profile_image: profile.profile_image ?? "",
    };

    return response;
}

const update = async (email, request) => {
    const user = validate(updateProfileValidation, request);

    const existingUser = await userRepository.findUserByEmail(email);

    if (!existingUser) {
        throw new ResponseError(404, 404, "Akun tidak ditemukan.");
    }

    const updateData = {};
    if (user.first_name !== undefined) updateData.first_name = user.first_name;
    if (user.last_name !== undefined) updateData.last_name = user.last_name;

    return userRepository.updateUser(email, updateData);
}

export default {
    get,
    update
}