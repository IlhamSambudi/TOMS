import GroupModel from '../models/groupModel.js';

const GroupService = {
    getAllGroups: async () => {
        return await GroupModel.findAll();
    },
    getGroupById: async (id) => {
        return await GroupModel.findById(id);
    },
    createGroup: async (data) => {
        return await GroupModel.create(data);
    },
    updateGroup: async (id, data) => {
        return await GroupModel.update(id, data);
    },
    deleteGroup: async (id) => {
        return await GroupModel.delete(id);
    }
};

export default GroupService;
