import profileService from "../service/profile-service.js";

const get = async (req, res, next) => {
    try {
        const email = req.email;
        const result = await profileService.get(email);
        res.status(200).json({
            status: 0,
            message: "Sukses",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const email = req.email;
        const request = req.body;

        const result = await profileService.update(email, request);

        res.status(200).json({
            status: 0,
            message: "User Edited",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

export const uploadProfileImage = async (req, res, next) => {
    try {
        const email = req.email;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                status: 102,
                message: "Gambar profil wajib diunggah",
                data: null
            });
        }

        const result = await profileService.uploadProfileImage(email, file);

        res.status(200).json({
            status: 0,
            message: "Update Profile Image berhasil",
            data: result
        });
    } catch (e) {
        next(e);
    }
};

export default {
    get,
    update,
    uploadProfileImage
}