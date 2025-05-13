const guestModel = require('../models/guestModel');


const guestService = {
    async getAllGuests() {
        try {
            return await guestModel.getAllGuests();
        } catch (error) {
            console.error("Xatolik: Mehmonlarni olishda xatolik:", error);
            throw new Error("Mehmonlarni olishda xatolik");
        }
    },

    async getGuestById(id) {
        try {
            const guest = await guestModel.getGuestById(id);
            if (!guest) {
                throw new Error('Mehmon topilmadi');
            }
            return guest;
        } catch (error) {
            console.error(`ID bo'yicha mehmonni olishda xatolik (${id}):`, error);
            throw error;
        }
    },

    async createGuest(fullName, contactInfo) {
        try {
            if (!fullName || !contactInfo) {
                throw new Error('To‘liq ism va kontakt ma‘lumotlari majburiy');
            }
            return await guestModel.createGuest(fullName, contactInfo);
        } catch (error) {
            console.error("Mehmonni yaratishda xatolik:", error);
            throw error;
        }
    },

    async updateGuest(id, fullName, contactInfo) {
        try {
            if (!fullName || !contactInfo) {
                throw new Error('To‘liq ism va kontakt ma‘lumotlari majburiy');
            }
            const updatedGuest = await guestModel.updateGuest(id, fullName, contactInfo);
            if (!updatedGuest) {
                throw new Error('Mehmon topilmadi');
            }
            return updatedGuest;
        } catch (error) {
            console.error(`Mehmonni yangilashda xatolik (${id}):`, error);
            throw error;
        }
    },

    async deleteGuest(id) {
        try {
            const deletedGuest = await guestModel.deleteGuest(id);
            if (!deletedGuest) {
                throw new Error('Mehmon topilmadi');
            }
            return true;
        } catch (error) {
            console.error(`Mehmonni o'chirishda xatolik (${id}):`, error);
            throw error;
        }
    },
}

module.exports = guestService;