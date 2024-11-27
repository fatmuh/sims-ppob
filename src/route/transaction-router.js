import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import transactionController from "../controller/transaction-controller.js";

const transactionRouter = new express.Router();
transactionRouter.use(authMiddleware)

transactionRouter.get('/balance', transactionController.getBalance);
transactionRouter.post('/topup', transactionController.updateBalance);
transactionRouter.post('/transaction', transactionController.postTransaction);
transactionRouter.get('/transaction/history', transactionController.getHistory);

export {
    transactionRouter
}