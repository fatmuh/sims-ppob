import {prismaClient} from "../application/database.js";

const getBanners = async () => {
    return prismaClient.$queryRaw`SELECT banner_name, banner_image, description FROM banners`;
};

export default {
    getBanners
};