import {validate} from "../validation/validation.js";
import {getProfileValidation} from "../validation/profile-validation.js";
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

export default {
    get
}