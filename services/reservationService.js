const { validate: isUUID } = require('uuid');
const reservationModel = require('../models/reservationModel');

const reservationService = {
    async getAllReservations() {
        try {
            return await reservationModel.getAllReservations();
        } catch (error) {
            console.error("Barcha rezervatsiyalarni olishda xatolik:", error);
            throw new Error('Rezervatsiyalarni olishda xatolik yuz berdi');
        }
    },

    async getReservationById(id) {
        try {
            if (!isUUID(id)) throw new Error('Noto‘g‘ri rezervatsiya ID formati');
            const reservation = await reservationModel.getReservationById(id);
            if (!reservation) throw new Error('Rezervatsiya topilmadi');
            return reservation;
        } catch (error) {
            console.error(`ID bo'yicha rezervatsiyani olishda xatolik (${id}):`, error);
            throw error;
        }
    },

    async createReservation(guestId, roomId, checkInDate, checkOutDate, status) {
        try {
            if (!isUUID(guestId) || !isUUID(roomId)) throw new Error('Noto‘g‘ri ID formati');
            if (!guestId || !roomId || !checkInDate || !checkOutDate || !status) throw new Error('Barcha maydonlar majburiy');
            if (new Date(checkOutDate) <= new Date(checkInDate)) throw new Error('Chiqish sanasi kirish sanasidan keyin bo‘lishi kerak');
            return await reservationModel.createReservation(guestId, roomId, checkInDate, checkOutDate, status);
        } catch (error) {
            console.error("Rezervatsiyani yaratishda xatolik:", error);
            throw error;
        }
    },

    async updateReservation(id, guestId, roomId, checkInDate, checkOutDate, status) {
        try {
            if (!isUUID(id) || !isUUID(guestId) || !isUUID(roomId)) throw new Error('Noto‘g‘ri ID formati');
            if (!guestId || !roomId || !checkInDate || !checkOutDate || !status) throw new Error('Barcha maydonlar majburiy');
            if (new Date(checkOutDate) <= new Date(checkInDate)) throw new Error('Chiqish sanasi kirish sanasidan keyin bo‘lishi kerak');
            const updatedReservation = await reservationModel.updateReservation(id, guestId, roomId, checkInDate, checkOutDate, status);
            if (!updatedReservation) throw new Error('Rezervatsiya topilmadi');
            return updatedReservation;
        } catch (error) {
            console.error(`Rezervatsiyani yangilashda xatolik (${id}):`, error);
            throw error;
        }
    },

    async deleteReservation(id) {
        try {
            if (!isUUID(id)) throw new Error('Noto‘g‘ri ID formati');
            const deletedReservation = await reservationModel.deleteReservation(id);
            if (!deletedReservation) throw new Error('Rezervatsiya topilmadi');
            return deletedReservation;
        } catch (error) {
            console.error(`Rezervatsiyani o'chirishda xatolik (${id}):`, error);
            throw error;
        }
    },

    // async getReservationsByDateRange(startDate, endDate) {
    //     try {
    //         if (!startDate || !endDate) throw new Error('Sana oralig‘i majburiy');
    //         return await reservationModel.getReservationsByDateRange(startDate, endDate);
    //     } catch (error) {
    //         console.error("Sana oralig'i bo'yicha rezervatsiyalarni olishda xatolik:", error);
    //         throw error;
    //     }
    // },

    // async getAvailableRooms(startDate, endDate) {
    //     try {
    //         if (!startDate || !endDate) throw new Error('Sana oralig‘i majburiy');
    //         return await reservationModel.getAvailableRooms(startDate, endDate);
    //     } catch (error) {
    //         console.error("Bo'sh xonalarni olishda xatolik:", error);
    //         throw error;
    //     }
    // },


    async getReservationsByDateRange(startDate, endDate) {
        try {
            if (!startDate || !endDate) throw new Error('Sana oralig‘i majburiy');
            return await reservationModel.getReservationsByDateRange(startDate, endDate);
        } catch (error) {
            console.error(`Sana oralig'i bo'yicha rezervatsiyalarni olishda xatolik (${startDate} - ${endDate}):`, error);
            throw error;
        }
    },
    
    async getAvailableRooms(startDate, endDate) {
        try {
            if (!startDate || !endDate) throw new Error('Sana oralig‘i majburiy');
            return await reservationModel.getAvailableRooms(startDate, endDate);
        } catch (error) {
            console.error(`Bo'sh xonalarni olishda xatolik (${startDate} - ${endDate}):`, error);
            throw error;
        }
    },

    async getGuestsByRoomAndDateRange(roomId, startDate, endDate) {
        try {
            if (!isUUID(roomId)) throw new Error('Noto‘g‘ri xona ID formati');
            if (!startDate || !endDate) throw new Error('Sana oralig‘i majburiy');
            return await reservationModel.getGuestsByRoomAndDateRange(roomId, startDate, endDate);
        } catch (error) {
            console.error("Xona va sana oralig'i bo'yicha mehmonlarni olishda xatolik:", error);
            throw error;
        }
    },

    async getConfirmedNotCheckedInReservations() {
        try {
            return await reservationModel.getConfirmedNotCheckedInReservations();
        } catch (error) {
            console.error("Tasdiqlangan, lekin ro'yxatdan o'tmagan rezervatsiyalarni olishda xatolik:", error);
            throw error;
        }
    },
};

module.exports = reservationService;