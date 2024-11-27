import bannerRepository from "../repository/banner-repository.js";

const get = async () => {
    return await bannerRepository.getBanners();
}

export default {
    get,
}