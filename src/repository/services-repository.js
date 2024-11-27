import {prismaClient} from "../application/database.js";

const getServices = async () => {
    return prismaClient.$queryRaw`SELECT service_code, service_name, service_icon, service_tariff FROM services`;
};

const findServiceByServiceCode = async (service_code) => {
    const user = await prismaClient.$queryRaw`
        SELECT id, service_code, service_name, service_icon, service_tariff
        FROM services
        WHERE service_code = ${service_code}
        LIMIT 1`;

    return user.length > 0 ? user[0] : null;
};

export default {
    getServices,
    findServiceByServiceCode
};