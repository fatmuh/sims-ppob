import bannerRepository from "../repository/banner-repository.js";

const get = async () => {
    return bannerRepository.getBanners();
}

export default {
    get,
}