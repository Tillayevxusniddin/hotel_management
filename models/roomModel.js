const db = require('../database');

const roomModel = {
    // async getAllRooms() {
    //     console.log('Executing query for rooms');
    //     const result = await db.query(`
    //         SELECT r.*, rt.type_name 
    //         FROM rooms r
    //         JOIN room_types rt ON r.room_type_id = rt.id
    //     `);
    //     console.log('Query result:', result.rows);
    //     return result.rows;
    // },
    async getAllRooms() {
        const result = await db.query('SELECT * FROM rooms');
        return result.rows;
    },

    // async getRoomById(id) {
    //     const result = await db.query(`
    //         SELECT r.*, rt.type_name 
    //         FROM rooms r
    //         JOIN room_types rt ON r.room_type_id = rt.id
    //         WHERE r.id = $1
    //     `, [id]);
    //     return result.rows[0];
    // },
    async getRoomById(id) {
        const result = await db.query('SELECT * FROM rooms WHERE id = $1', [id]);
        return result.rows[0];
    },

    async createRoom(roomNumber, roomTypeId, pricePerNight) {
        const result = await db.query(
            'INSERT INTO rooms (room_number, room_type_id, price_per_night) VALUES ($1, $2, $3) RETURNING *',
            [roomNumber, roomTypeId, pricePerNight]
        );
        return result.rows[0];
    },

    async updateRoom(id, roomNumber, roomTypeId, pricePerNight) {
        const result = await db.query(
            'UPDATE rooms SET room_number = $2, room_type_id = $3, price_per_night = $4, updated_at = NOW() WHERE id = $1 RETURNING *',
            [id, roomNumber, roomTypeId, pricePerNight]
        );
        return result.rows[0];
    },

    async deleteRoom(id) {
        const result = await db.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },
}

module.exports = roomModel;