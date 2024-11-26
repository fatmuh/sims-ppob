import userRepository from "../src/repository/user-repository.js";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import {web} from "../src/application/web.js";
import * as bcrypt from "bcrypt";

jest.mock('jsonwebtoken');
jest.mock('../src/repository/user-repository.js');
jest.mock('../src/middleware/auth-middleware.js', () => {
    const jwt = require('jsonwebtoken');
    return {
        authMiddleware: jest.fn((req, res, next) => {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    status: 108,
                    message: "Token tidak tidak valid atau kadaluwarsa",
                    data: null
                });
            }

            jwt.verify(token, "secret", (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        status: 108,
                        message: "Token tidak tidak valid atau kadaluwarsa",
                        data: null
                    });
                }
                req.email = decoded.email;
                next();
            });
        }),
    };
});

describe('GET /profile', function () {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should can get profile user', async () => {
        userRepository.countUser.mockResolvedValue(0);
        userRepository.createUser.mockResolvedValue({
            id: 1,
            email: "test@example.com",
            first_name: "Test",
            last_name: "Akun",
        });

        userRepository.findUserByEmail.mockResolvedValue({
            id: 1,
            email: "test@example.com",
            password: await bcrypt.hash("12345678", 10),
            first_name: "Test",
            last_name: "Akun",
            profile_image: "https://yoururlapi.com/profile.jpeg"
        });

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, { email: "test@example.com" });
        });

        const token = 'valid-token';

        const result = await supertest(web)
            .get('/profile')
            .set('Authorization', 'Bearer ' + token);

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(0);
        expect(result.body.message).toBe("Sukses");
    });

    it('should reject if token is invalid', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        const result = await supertest(web)
            .get('/profile')
            .set('Authorization', 'Bearer invalid-token');

        expect(result.status).toBe(401);
        expect(result.body.status).toBe(108);
        expect(result.body.message).toBe("Token tidak tidak valid atau kadaluwarsa");
    });
});