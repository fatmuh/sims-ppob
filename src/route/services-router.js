import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import servicesController from "../controller/services-controller.js";


const servicesRouter = new express.Router();
servicesRouter.use(authMiddleware)

servicesRouter.get('/services', servicesController.get);

export {
    servicesRouter
}