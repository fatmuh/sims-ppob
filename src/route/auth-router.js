import express from "express";
import authController from "../controller/auth-controller.js";

const authRouter = new express.Router();

authRouter.post("/registration", authController.register)

export {
    authRouter
}