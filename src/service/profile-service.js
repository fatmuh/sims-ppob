import {validate} from "../validation/validation.js";
import {getProfileValidation, updateProfileValidation} from "../validation/profile-validation.js";
import userRepository from "../repository/user-repository.js";
import {ResponseError} from "../error/response-error.js";
import * as fs from "node:fs";
import path from "path";

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

const uploadProfileImage = async (email, file) => {
    email = validate(getProfileValidation, email);

    const existingUser = await userRepository.findUserByEmail(email);
    if (!existingUser) {
        if (file) {
            fs.unlinkSync(file.path);
        }
        throw new ResponseError(404, 404, "Akun tidak ditemukan.");
    }

    const profileImagePath = `/profile-images/${file.filename}`;

    if (existingUser.profile_image) {
        const oldImagePath = path.join('public', existingUser.profile_image);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    }

    return userRepository.updateProfileImage(email, profileImagePath);
}

export default {
    get,
    update,
    uploadProfileImage
}