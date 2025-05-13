const db = require('../database');

const guestModel = {
    async getAllGuests() {
        const result = await db.query('SELECT * FROM guests');
        return result.rows;
    },

    async getGuestById(id) {
        const result = await db.query('SELECT * FROM guests WHERE id = $1', [id]);
        return result.rows[0];
    },

    async createGuest(fullName, contactInfo) {
        const result = await db.query(
            'INSERT INTO guests (full_name, contact_info, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *',
            [fullName, contactInfo]
        );
        return result.rows[0];
    },
    
    async updateGuest(id, fullName, contactInfo) {
        const result = await db.query(
            'UPDATE guests SET full_name = $2, contact_info = $3, updated_at = NOW() WHERE id = $1 RETURNING *',
            [id, fullName, contactInfo]
        );
        return result.rows[0];
    },

    async deleteGuest(id) {
        const result = await db.query('DELETE FROM guests WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },
}


module.exports = guestModel;