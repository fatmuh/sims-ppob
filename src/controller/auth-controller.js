import authService from "../service/auth-service.js";
import {ResponseError} from "../error/response-error.js";

const register = async (req, res, next) => {
    try {
        const register = await authService.register(req.body);

        if (!register) {
            return res.status(401).send({});
        } else {
            res.status(200).json({
                status: 0,
                message: "Registrasi berhasil, silahkan login",
                data: null
            });
        }
    } catch (e) {
        if (e instanceof ResponseError) {
            if (e.status === 102) {
                return res.status(400).json({
                    status: 102,
                    message: e.message,
                    data: null
                });
            }
        }
        next(e);
    }
};

export { register };


export default {
    register
}