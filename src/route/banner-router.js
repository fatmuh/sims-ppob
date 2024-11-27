import express from "express";
import bannerController from "../controller/banner-controller.js";

const bannerRouter = new express.Router();

bannerRouter.get("/banner", bannerController.get)

export {
    bannerRouter
}