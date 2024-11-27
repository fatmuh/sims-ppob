import balanceService from "../service/balance-service.js";
import transactionService from "../service/transaction-service.js";

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

const updateBalance = async (req, res, next) => {
    try {
        const email = req.email;
        const request = req.body;

        const result = await balanceService.update(email, request);

        res.status(200).json({
            status: 0,
            message: "Top Up Balance berhasil",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const postTransaction = async (req, res, next) => {
    try {
        const email = req.email;
        const request = req.body;

        const result = await transactionService.post(email, request);

        res.status(200).json({
            status: 0,
            message: "Transaksi berhasil",
            data: result
        })
    } catch (e) {
        next(e);
    }
}


export default {
    getBalance,
    updateBalance,
    postTransaction
}