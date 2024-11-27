import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import profileController from "../controller/profile-controller.js";
import upload from "../application/multer.js";


const profileRouter = new express.Router();
profileRouter.use(authMiddleware)

profileRouter.get('/profile', profileController.get);
profileRouter.put('/profile/update', profileController.update);
profileRouter.put(
    '/profile/image',
    upload.single('profile_image'),
    profileController.uploadProfileImage
);

export {
    profileRouter
}