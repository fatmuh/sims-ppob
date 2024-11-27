import balanceService from "../service/balance-service.js";

const getBalance = async (req, res, next) => {
    try {
        const email = req.email;
        const result = await balanceService.get(email);
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
    getBalance
}