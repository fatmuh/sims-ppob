import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {prismaClient} from "../application/database.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({
            message: "Unauthorized",
        }).end();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prismaClient.user.findFirst({
            where: {
                email: decoded.email
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            }).end();
        } else {
            req.user = user;
            next();
        }
    } catch (err) {

        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "Sesi anda telah habis!",
            }).end();
        } else {
            return res.status(401).json({
                message: "Unauthorized",
            }).end();
        }
    }
}