import userRepository from "../src/repository/user-repository.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";
import balanceRepository from "../src/repository/balance-repository.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock('jsonwebtoken');
jest.mock('../src/repository/user-repository.js');
jest.mock('../src/repository/balance-repository.js');

describe('POST /registration', function () {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should can register new user', async () => {
        userRepository.countUser.mockResolvedValue(0);
        userRepository.createUser.mockResolvedValue({
            id: 1,
            email: "test@example.com",
            first_name: "Test",
            last_name: "Akun",
        });

        balanceRepository.createBalance.mockResolvedValue({});

        const result = await supertest(web)
            .post('/registration')
            .send({
                email: "test@example.com",
                password: "12345678",
                first_name: "Test",
                last_name: "Akun",
            });


        expect(result.status).toBe(200);
        expect(result.body.status).toBe(0);
        expect(result.body.message).toBe("Registrasi berhasil, silahkan login");
        expect(result.body.data).toBe(null);
    });

    it('should reject if request invalid', async () => {
        const result = await supertest(web)
            .post('/registration')
            .send({
                email: "",
                password: "",
                first_name: "",
                last_name: ""
            });

        expect(result.status).toBe(400);
        expect(result.body.status).toBe(102);
    });

    it('should reject if user already registered', async () => {
        userRepository.countUser.mockResolvedValue(1);

        const result = await supertest(web)
            .post('/registration')
            .send({
                email: "test@example.com",
                password: "12345678",
                first_name: "Test",
                last_name: "Akun",
            });

        expect(result.status).toBe(400);
        expect(result.body.message).toBe("Akun sudah terdaftar!");
    });

    it('should reject if email not valid', async () => {

        const result = await supertest(web)
            .post('/registration')
            .send({
                email: "test",
                password: "12345678",
                first_name: "Test",
                last_name: "Akun",
            });

        expect(result.status).toBe(400);
        expect(result.body.status).toBe(102);
        expect(result.body.message).toBe("Parameter email tidak sesuai format.");
        expect(result.body.data).toBe(null);
    });
});

describe('POST /login', function () {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should can login', async () => {
        userRepository.findUserByEmail.mockResolvedValue({
            id: 1,
            email: "test@example.com",
            password: await bcrypt.hash("12345678", 10),
        });

        jwt.sign.mockReturnValue('valid-token');

        const result = await supertest(web)
            .post('/login')
            .send({
                email: "test@example.com",
                password: "12345678",
            });

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Login Sukses");
    });

    it('should reject login if request is invalid', async () => {
        const result = await supertest(web)
            .post('/login')
            .send({
                email: "",
                password: "",
            });

        expect(result.status).toBe(400);
        expect(result.body.status).toBe(102);
    });

    it('should reject login if password is wrong', async () => {
        userRepository.findUserByEmail.mockResolvedValue({
            id: 1,
            email: "test@example.com",
            password: await bcrypt.hash("12345678", 10),
        });

        const result = await supertest(web)
            .post('/login')
            .send({
                email: "test@example.com",
                password: "wrongpassword",
            });

        expect(result.status).toBe(401);
        expect(result.body.status).toBe(103);
        expect(result.body.message).toBe("Username atau password salah");
    });

    it('should reject login if email is wrong', async () => {
        userRepository.findUserByEmail.mockResolvedValue(null);

        const result = await supertest(web)
            .post('/login')
            .send({
                email: "wrong@example.com",
                password: "12345678",
            });

        expect(result.status).toBe(401);
        expect(result.body.status).toBe(103);
        expect(result.body.message).toBe("Username atau password salah");
    });
});