import bannerRepository from "../src/repository/banner-repository.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";

jest.mock('../src/repository/banner-repository.js');

describe('GET /banner', function () {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should can register new user', async () => {
        bannerRepository.getBanners.mockResolvedValue({
                "banner_name": "Banner 1",
                "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                "description": "Lerem Ipsum Dolor sit amet"
            },
            {
                "banner_name": "Banner 2",
                "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                "description": "Lerem Ipsum Dolor sit amet"
            },
            {
                "banner_name": "Banner 3",
                "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                "description": "Lerem Ipsum Dolor sit amet"
            },
            {
                "banner_name": "Banner 4",
                "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                "description": "Lerem Ipsum Dolor sit amet"
            },
            {
                "banner_name": "Banner 5",
                "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                "description": "Lerem Ipsum Dolor sit amet"
            },
            {
                "banner_name": "Banner 6",
                "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                "description": "Lerem Ipsum Dolor sit amet"
            });

        const result = await supertest(web)
            .get('/banner');

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(0);
        expect(result.body.message).toBe("Sukses");
    });
});