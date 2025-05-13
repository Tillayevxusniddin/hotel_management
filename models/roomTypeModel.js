const db = require('../database');

const roomTypeModel = {
    // Barcha xona turlarini olish
    async getAll() {
        try {
            const result = await db.query('SELECT * FROM room_types ORDER BY id ASC');
            return result.rows;
        } catch (error) {
            console.error('Xona turlarini olishda xato:', error);
            throw error;
        }
    },

    // Xona turini ID bo‘yicha olish
    async getById(id) {
        try {
            const result = await db.query('SELECT * FROM room_types WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Xona turini ID bo‘yicha olishda xato:', error);
            throw error;
        }
    },

    // Yangi xona turi qo‘shish
    async create(type_name, description) {
        try {
            const result = await db.query(
                'INSERT INTO room_types (type_name, description) VALUES ($1, $2) RETURNING *',
                [type_name, description]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Xona turi qo‘shishda xato:', error);
            throw error;
        }
    },

    // Xona turini yangilash
    async update(id, type_name, description) {
        try {
            const result = await db.query(
                'UPDATE room_types SET type_name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
                [type_name, description, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Xona turini yangilashda xato:', error);
            throw error;
        }
    },

    // Xona turini o‘chirish
    async delete(id) {
        try {
            const result = await db.query('DELETE FROM room_types WHERE id = $1 RETURNING *', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Xona turini o‘chirishda xato:', error);
            throw error;
        }
    }
};

module.exports = roomTypeModel;