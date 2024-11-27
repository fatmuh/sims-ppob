import supertest from "supertest";
import {web} from "../src/application/web.js";
import balanceRepository from "../src/repository/balance-repository.js";
import jwt from "jsonwebtoken";
import userRepository from "../src/repository/user-repository.js";
import * as bcrypt from "bcrypt";
import servicesRepository from "../src/repository/services-repository.js";
import transactionRepository from "../src/repository/transaction-repository.js";

jest.mock('../src/repository/user-repository.js');
jest.mock('../src/repository/balance-repository.js');
jest.mock('../src/repository/services-repository.js');
jest.mock('../src/repository/transaction-repository.js');
jest.mock('jsonwebtoken');
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

describe('GET /balance', function () {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should can get balance', async () => {
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

        balanceRepository.findBalanceByUserId.mockResolvedValue({
            "balance": 40000,
        });

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {email: "test@example.com"});
        });

        const token = 'valid-token';

        const result = await supertest(web)
            .get('/balance')
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
            .get('/balance')
            .set('Authorization', 'Bearer invalid-token');

        expect(result.status).toBe(401);
        expect(result.body.status).toBe(108);
        expect(result.body.message).toBe("Token tidak tidak valid atau kadaluwarsa");
    });
});

describe('GET /topup', function () {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should can get balance', async () => {
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

        balanceRepository.findBalanceByUserId.mockResolvedValue({
            "balance": 40000,
        });

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {email: "test@example.com"});
        });

        const token = 'valid-token';

        const result = await supertest(web)
            .get('/balance')
            .set('Authorization', 'Bearer ' + token)
            .send({
                amount: 100000,
            });

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(0);
        expect(result.body.message).toBe("Sukses");
    });

    it('should reject if token is invalid', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        const result = await supertest(web)
            .get('/topup')
            .set('Authorization', 'Bearer invalid-token');

        expect(result.status).toBe(401);
        expect(result.body.status).toBe(108);
        expect(result.body.message).toBe("Token tidak tidak valid atau kadaluwarsa");
    });
});

describe('GET /transactions', function () {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should can post transaction', async () => {
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

        balanceRepository.findBalanceByUserId.mockResolvedValue({
            "balance": 40000,
        });

        servicesRepository.findServiceByServiceCode.mockResolvedValue(
            {
                "id": 1,
                "service_code": "PULSA",
                "service_name": "Pulsa",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 40000
            }
        );

        transactionRepository.createTransaction.mockResolvedValue(
            {
                "user_id": 1,
                "service_id": 1,
                "invoice_number": "JDWIAJDWADWA",
                "transaction_type": "PAYMENT",
                "total_amount": 40000,
                "created_on": "2024-11-27T00:00:00"
            }
        );

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {email: "test@example.com"});
        });

        const token = 'valid-token';

        const result = await supertest(web)
            .post('/transaction')
            .set('Authorization', 'Bearer ' + token)
            .send({
                service_code: "PULSA",
            });

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(0);
        expect(result.body.message).toBe("Transaksi berhasil");
    });

    it('should reject if token is invalid', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        const result = await supertest(web)
            .get('/topup')
            .set('Authorization', 'Bearer invalid-token');

        expect(result.status).toBe(401);
        expect(result.body.status).toBe(108);
        expect(result.body.message).toBe("Token tidak tidak valid atau kadaluwarsa");
    });
});