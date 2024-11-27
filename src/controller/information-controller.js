import informationService from "../service/information-service.js";

const getBanner = async (req, res, next) => {
    try {
        const result = await informationService.getBanner();
        res.status(200).json({
            status: 0,
            message: "Sukses",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const getServices = async (req, res, next) => {
    try {
        const result = await informationService.getServices();
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
    getBanner,
    getServices
}