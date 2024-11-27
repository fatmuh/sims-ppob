import bannerService from "../service/banner-service.js";

const get = async (req, res, next) => {
    try {
        const result = await bannerService.get();
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
    get
}