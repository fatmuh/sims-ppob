import userRepository from "../src/repository/user-repository.js";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import {web} from "../src/application/web.js";
import * as bcrypt from "bcrypt";

jest.mock('jsonwebtoken');
jest.mock('../src/repository/user-repository.js');
jest.mock('../src/application/multer.js', () => {
    const mockMulter = () => ({
        single: jest.fn(() => (req, res, next) => {
            if (!req.file) {
                return res.status(400).json({
                    status: 1,
                    message: "No file uploaded",
                });
            }
            req.file = {
                filename: 'mocked-file-name.jpg',
                originalname: 'original-file-name.jpg',
                mimetype: "image/jpeg",
                size: 1024,
            };
            next();
        }),
    });
    return mockMulter();
});

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

describe('PUT /profile/update', function () {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should can update profile user', async () => {
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
            .put('/profile/update')
            .set('Authorization', 'Bearer ' + token)
            .send({
                first_name: "Test",
                last_name: "Akun",
            });

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(0);
        expect(result.body.message).toBe("User Edited");
    });

    it('should reject update if request is invalid', async () => {
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
            .put('/profile/update')
            .set('Authorization', 'Bearer ' + token)
            .send({
                first_name: "",
                last_name: "",
            });

        expect(result.status).toBe(400);
    });

    it('should reject if token is invalid', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        const result = await supertest(web)
            .put('/profile/update')
            .set('Authorization', 'Bearer invalid-token')
            .send({
                first_name: "Test",
                last_name: "Akun",
            });

        expect(result.status).toBe(401);
        expect(result.body.status).toBe(108);
        expect(result.body.message).toBe("Token tidak tidak valid atau kadaluwarsa");
    });
});

describe('PUT /profile/image', function () {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should can update profile image user', async () => {
        let imagePath = null;

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
            .put('/profile/image')
            .set('Authorization', 'Bearer ' + token)
            .attach('profile_image', imagePath);

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(0);
        expect(result.body.message).toBe("Update Profile Image berhasil");
    });

    it('should reject update if request is invalid', async () => {
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
            .put('/profile/image')
            .set('Authorization', 'Bearer ' + token)
            .attach('profile_image', null);

        expect(result.status).toBe(400);
    });

    it('should reject if token is invalid', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        const result = await supertest(web)
            .put('/profile/update')
            .set('Authorization', 'Bearer invalid-token')
            .attach('profile_image', null);

        expect(result.status).toBe(401);
        expect(result.body.status).toBe(108);
        expect(result.body.message).toBe("Token tidak tidak valid atau kadaluwarsa");
    });
});