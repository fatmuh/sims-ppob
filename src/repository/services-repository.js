import {prismaClient} from "../application/database.js";

const getServices = async () => {
    return prismaClient.$queryRaw`SELECT service_code, service_name, service_icon, service_tariff FROM services`;
};

export default {
    getServices
};