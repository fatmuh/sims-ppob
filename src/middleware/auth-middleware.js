import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {prismaClient} from "../application/database.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak tidak valid atau kadaluwarsa",
            data: null
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
                status: 108,
                message: "Token tidak tidak valid atau kadaluwarsa",
                data: null
            }).end();
        } else {
            req.user = user;
            req.email = user.email;
            next();
        }
    } catch (err) {

        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak tidak valid atau kadaluwarsa",
                data: null
            }).end();
        } else {
            return res.status(401).json({
                status: 108,
                message: "Token tidak tidak valid atau kadaluwarsa",
                data: null
            }).end();
        }
    }
}