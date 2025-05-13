const { v4: uuidv4 } = require('uuid');
const db = require('../database');

const reservationModel = {
    async getAllReservations() {
        const result = await db.query(`
            SELECT r.*, g.full_name, rm.room_number
            FROM reservations r
            JOIN guests g ON r.guest_id = g.id
            JOIN rooms rm ON r.room_id = rm.id
        `);
        return result.rows;
    },

    async getReservationById(id) {
        const result = await db.query('SELECT * FROM reservations WHERE id = $1', [id]);
        return result.rows[0];
    },

    async createReservation(guestId, roomId, checkInDate, checkOutDate, status) {
        const id = uuidv4();
        const result = await db.query(
            'INSERT INTO reservations (id, guest_id, room_id, check_in_date, check_out_date, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
            [id, guestId, roomId, checkInDate, checkOutDate, status]
        );
        return result.rows[0];
    },

    async updateReservation(id, guestId, roomId, checkInDate, checkOutDate, status) {
        const result = await db.query(
            'UPDATE reservations SET guest_id = $2, room_id = $3, check_in_date = $4, check_out_date = $5, status = $6, updated_at = NOW() WHERE id = $1 RETURNING *',
            [id, guestId, roomId, checkInDate, checkOutDate, status]
        );
        return result.rows[0];
    },

    async deleteReservation(id) {
        const result = await db.query('DELETE FROM reservations WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },

    async getReservationsByDateRange(startDate, endDate) {
        const result = await db.query(
            'SELECT r.*, g.full_name, rm.room_number FROM reservations r JOIN guests g ON r.guest_id = g.id JOIN rooms rm ON r.room_id = rm.id WHERE check_in_date >= $1 AND check_out_date <= $2',
            [startDate, endDate]
        );
        return result.rows;
    },

    async getAvailableRooms(startDate, endDate) {
        const result = await db.query(
            `SELECT rm.* FROM rooms rm
             WHERE id NOT IN (
                 SELECT room_id
                 FROM reservations
                 WHERE check_in_date < $2 AND check_out_date > $1
             )`,
            [startDate, endDate]
        );
        return result.rows;
    },

    async getGuestsByRoomAndDateRange(roomId, startDate, endDate) {
        const result = await db.query(
            `SELECT g.*
             FROM guests g
             JOIN reservations r ON g.id = r.guest_id
             WHERE r.room_id = $1
               AND r.check_in_date <= $2
               AND r.check_out_date >= $3`,
            [roomId, endDate, startDate]
        );
        return result.rows;
    },

    async getConfirmedNotCheckedInReservations() {
        const result = await db.query(
            'SELECT r.*, g.full_name, rm.room_number FROM reservations r JOIN guests g ON r.guest_id = g.id JOIN rooms rm ON r.room_id = rm.id WHERE status = $1 AND check_in_date > CURRENT_DATE',
            ['confirmed']
        );
        return result.rows;
    },
};

module.exports = reservationModel;