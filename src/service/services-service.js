import servicesRepository from "../repository/services-repository.js";

const get = async () => {
    return servicesRepository.getServices();
}

export default {
    get,
}