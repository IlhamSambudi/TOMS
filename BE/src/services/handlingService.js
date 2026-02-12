import HandlingCompanyModel from '../models/handlingModel.js';

const HandlingService = {
    getAll: async () => {
        return await HandlingCompanyModel.findAll();
    },
    create: async (data) => {
        return await HandlingCompanyModel.create(data);
    }
};

export default HandlingService;
