const roomModel = require('../models/roomModel');

const roomService = {
    async getAllRooms() {
        try {
            return await roomModel.getAllRooms();
        } catch (error) {
            console.error("Barcha xonalarni olishda xatolik:", error);
            throw new Error('Xonalarni olishda xatolik yuz berdi');
        }
    },

    async getRoomById(id) {
        try {
            const room = await roomModel.getRoomById(id);
            if (!room) {
                throw new Error('Xona topilmadi');
            }
            return room;
        } catch (error) {
            console.error(`ID bo'yicha xonani olishda xatolik (${id}):`, error);
            throw error;
        }
    },

    async createRoom(roomNumber, roomTypeId, pricePerNight) {
        try {
            if (!roomNumber || !roomTypeId || !pricePerNight) {
                throw new Error('Xona raqami, turi va narxi majburiy');
            }
            return await roomModel.createRoom(roomNumber, roomTypeId, pricePerNight);
        } catch (error) {
            console.error("Xonani yaratishda xatolik:", error);
            throw error;
        }
    },

    async updateRoom(id, roomNumber, roomTypeId, pricePerNight) {
        try {
            if (!roomNumber || !roomTypeId || !pricePerNight) {
                throw new Error('Xona raqami, turi va narxi majburiy');
            }
            const updatedRoom = await roomModel.updateRoom(id, roomNumber, roomTypeId, pricePerNight);
            if (!updatedRoom) {
                throw new Error('Xona topilmadi');
            }
            return updatedRoom;
        } catch (error) {
            console.error(`Xonani yangilashda xatolik (${id}):`, error);
            throw error;
        }
    },

    async deleteRoom(id) {
        try {
            const deletedRoom = await roomModel.deleteRoom(id);
            if (!deletedRoom) {
                throw new Error('Xona topilmadi');
            }
            return true;
        } catch (error) {
            console.error(`Xonani o'chirishda xatolik (${id}):`, error);
            throw error;
        }
    },
};

module.exports = roomService;