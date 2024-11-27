import express from "express";
import {errorMiddleware} from "../middleware/error-middleware.js";
import {authRouter} from "../route/auth-router.js";
import {profileRouter} from "../route/profile-router.js";
import {transactionRouter} from "../route/transaction-router.js";
import {informationRouter} from "../route/information-router.js";

export const web = express()

web.use('/profile-images', express.static('public/profile-images'));

web.use(express.json());

web.use(authRouter);
web.use(informationRouter);
web.use(profileRouter);
web.use(transactionRouter);
web.use(errorMiddleware);