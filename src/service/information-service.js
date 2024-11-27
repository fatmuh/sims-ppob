import bannerRepository from "../repository/banner-repository.js";
import servicesRepository from "../repository/services-repository.js";

const getBanner = async () => {
    return bannerRepository.getBanners();
}

const getServices = async () => {
    return servicesRepository.getServices();
}

export default {
    getBanner,
    getServices
}