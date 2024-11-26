import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import profileController from "../controller/profile-controller.js";


const profileRouter = new express.Router();
profileRouter.use(authMiddleware)

profileRouter.get('/profile', profileController.get);

export {
    profileRouter
}