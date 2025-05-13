const roomTypeModel = require('../models/roomTypeModel');

const roomTypesService = {
    async getAllRoomTypes() {
        try {
            return await roomTypeModel.getAll();
        } catch (error) {
            throw error;
        }
    },

    async getRoomTypeById(id) {
        try {
            return await roomTypeModel.getById(id);
        } catch (error) {
            throw error;
        }
    },

    async createRoomType(type_name, description) {
        try {
            return await roomTypeModel.create(type_name, description);
        } catch (error) {
            throw error;
        }
    },

    async updateRoomType(id, type_name, description) {
        try {
            return await roomTypeModel.update(id, type_name, description);
        } catch (error) {
            throw error;
        }
    },

    async deleteRoomType(id) {
        try {
            return await roomTypeModel.delete(id);
        } catch (error) {
            throw error;
        }
    }
};

module.exports = roomTypesService;