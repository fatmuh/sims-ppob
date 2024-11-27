import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import informationController from "../controller/information-controller.js";

const informationRouter = new express.Router();

informationRouter.get("/banner", informationController.getBanner)
informationRouter.get('/services', authMiddleware, informationController.getServices);

export {
    informationRouter
}