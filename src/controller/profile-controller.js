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

export default {
    get,
}