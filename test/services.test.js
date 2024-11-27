import supertest from "supertest";
import {web} from "../src/application/web.js";
import servicesRepository from "../src/repository/services-repository.js";
import jwt from "jsonwebtoken";
import userRepository from "../src/repository/user-repository.js";
import * as bcrypt from "bcrypt";

jest.mock('../src/repository/user-repository.js');
jest.mock('../src/repository/services-repository.js');
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

describe('GET /services', function () {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should can get services', async () => {
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

        servicesRepository.getServices.mockResolvedValue({
                "service_code": "PAJAK",
                "service_name": "Pajak PBB",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 40000
            },
            {
                "service_code": "PLN",
                "service_name": "Listrik",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 10000
            },
            {
                "service_code": "PDAM",
                "service_name": "PDAM Berlangganan",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 40000
            },
            {
                "service_code": "PULSA",
                "service_name": "Pulsa",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 40000
            },
            {
                "service_code": "PGN",
                "service_name": "PGN Berlangganan",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 50000
            },
            {
                "service_code": "MUSIK",
                "service_name": "Musik Berlangganan",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 50000
            },
            {
                "service_code": "TV",
                "service_name": "TV Berlangganan",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 50000
            },
            {
                "service_code": "PAKET_DATA",
                "service_name": "Paket data",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 50000
            },
            {
                "service_code": "VOUCHER_GAME",
                "service_name": "Voucher Game",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 100000
            },
            {
                "service_code": "VOUCHER_MAKANAN",
                "service_name": "Voucher Makanan",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 100000
            },
            {
                "service_code": "QURBAN",
                "service_name": "Qurban",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 200000
            },
            {
                "service_code": "ZAKAT",
                "service_name": "Zakat",
                "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                "service_tariff": 300000
            });

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, { email: "test@example.com" });
        });

        const token = 'valid-token';

        const result = await supertest(web)
            .get('/services')
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
            .get('/services')
            .set('Authorization', 'Bearer invalid-token');

        expect(result.status).toBe(401);
        expect(result.body.status).toBe(108);
        expect(result.body.message).toBe("Token tidak tidak valid atau kadaluwarsa");
    });
});