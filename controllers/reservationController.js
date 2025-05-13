const reservationService = require('../services/reservationService');
const guestService = require('../services/guestService');
const roomService = require('../services/roomService');

const reservationController = {
    async index(req, res) {
        const filterType = req.query.filter || 'all';
        let data = {};
        let filterMessage = '';

        try {
            if (filterType === 'date-range') {
                const { start_date, end_date } = req.query;
                data.reservations = await reservationService.getReservationsByDateRange(start_date, end_date);
                filterMessage = `Rezervatsiyalar: ${start_date} dan ${end_date} gacha`;
            } else if (filterType === 'available-rooms') {
                const { start_date, end_date } = req.query;
                data.rooms = await reservationService.getAvailableRooms(start_date, end_date);
                filterMessage = `Bo'sh xonalar: ${start_date} dan ${end_date} gacha`;
            } else if (filterType === 'guests-in-room') {
                const { room_id, start_date, end_date } = req.query;
                data.guests = await reservationService.getGuestsByRoomAndDateRange(room_id, start_date, end_date);
                filterMessage = `Xona ${room_id} dagi mehmonlar: ${start_date} dan ${end_date} gacha`;
            } else if (filterType === 'confirmed-not-checked-in') {
                data.reservations = await reservationService.getConfirmedNotCheckedInReservations();
                filterMessage = 'Tasdiqlangan, lekin kelmagan bandlovlar';
            } else {
                data.reservations = await reservationService.getAllReservations();
                filterMessage = 'Barcha bandlovlar';
            }
            res.render('reservations/index', { ...data, filterType, filterMessage });
        } catch (error) {
            res.status(500).render('error', { message: error.message || 'Ma’lumotlarni olishda xatolik yuz berdi' });
        }
    },

    async create(req, res) {
        try {
            const guests = await guestService.getAllGuests();
            const rooms = await roomService.getAllRooms();
            res.render('reservations/create', { guests, rooms, error: null });
        } catch (error) {
            res.status(500).render('error', { message: 'Serverda xatolik yuz berdi' });
        }
    },

    async store(req, res) {
        const { guest_id, room_id, check_in_date, check_out_date, status } = req.body;
        try {
            await reservationService.createReservation(guest_id, room_id, check_in_date, check_out_date, status);
            res.redirect('/reservations');
        } catch (error) {
            const guests = await guestService.getAllGuests();
            const rooms = await roomService.getAllRooms();
            res.render('reservations/create', { guests, rooms, error: error.message });
        }
    },

    async show(req, res) {
        const { id } = req.params;
        try {
            const reservation = await reservationService.getReservationById(id);
            const guest = await guestService.getGuestById(reservation.guest_id);
            const room = await roomService.getRoomById(reservation.room_id);
            res.render('reservations/show', { reservation, guest, room });
        } catch (error) {
            res.status(500).render('error', { message: error.message || 'Ma’lumotlarni olishda xatolik yuz berdi' });
        }
    },

    async edit(req, res) {
        const { id } = req.params;
        try {
            const reservation = await reservationService.getReservationById(id);
            const guests = await guestService.getAllGuests();
            const rooms = await roomService.getAllRooms();
            res.render('reservations/edit', { reservation, guests, rooms, error: null });
        } catch (error) {
            res.status(500).render('error', { message: 'Serverda xatolik yuz berdi' });
        }
    },

    async update(req, res) {
        const { id } = req.params;
        const { guest_id, room_id, check_in_date, check_out_date, status } = req.body;
        try {
            await reservationService.updateReservation(id, guest_id, room_id, check_in_date, check_out_date, status);
            res.redirect('/reservations/' + id);
        } catch (error) {
            const reservation = await reservationService.getReservationById(id);
            const guests = await guestService.getAllGuests();
            const rooms = await roomService.getAllRooms();
            res.render('reservations/edit', { reservation, guests, rooms, error: error.message });
        }
    },

    async delete(req, res) {
        const { id } = req.params;
        try {
            await reservationService.deleteReservation(id);
            res.redirect('/reservations');
        } catch (error) {
            res.status(500).render('error', { message: 'Serverda xatolik yuz berdi' });
        }
    },

    async filterByDateRange(req, res) {
        const { start_date, end_date } = req.query;
        try {
            if (!start_date || !end_date) {
                throw new Error('Sana oralig‘i majburiy');
            }
            const reservations = await reservationService.getReservationsByDateRange(start_date, end_date);
            res.render('reservations/filter_by_date_range', { reservations, start_date, end_date, error: null });
        } catch (error) {
            console.error('filterByDateRange xatolik:', error.message);
            res.status(400).render('reservations/filter_by_date_range', {
                reservations: [],
                start_date: start_date || '',
                end_date: end_date || '',
                error: error.message || 'Ma’lumotlarni olishda xatolik yuz berdi'
            });
        }
    },
    
    async filterAvailableRooms(req, res) {
        const { start_date, end_date } = req.query;
        try {
            if (!start_date || !end_date) {
                throw new Error('Sana oralig‘i majburiy');
            }
            const rooms = await reservationService.getAvailableRooms(start_date, end_date);
            res.render('reservations/filter_available_rooms', { rooms, start_date, end_date, error: null });
        } catch (error) {
            console.error('filterAvailableRooms xatolik:', error.message);
            res.status(400).render('reservations/filter_available_rooms', {
                rooms: [],
                start_date: start_date || '',
                end_date: end_date || '',
                error: error.message || 'Ma’lumotlarni olishda xatolik yuz berdi'
            });
        }
    },

    // async filterGuestsInRoom(req, res) {
    //     const { room_id, start_date, end_date } = req.query;
    //     try {
    //         const rooms = await roomService.getAllRooms();
    //         const guests = await reservationService.getGuestsByRoomAndDateRange(room_id, start_date, end_date);
    //         res.render('reservations/filter_guests_in_room', { guests, rooms, room_id, start_date, end_date, error: null });
    //     } catch (error) {
    //         const rooms = await roomService.getAllRooms();
    //         res.status(500).render('reservations/filter_guests_in_room', {
    //             guests: [],
    //             rooms,
    //             room_id,
    //             start_date,
    //             end_date,
    //             error: error.message || 'Ma’lumotlarni olishda xatolik yuz berdi'
    //         });
    //     }
    // },
    async filterGuestsInRoom(req, res) {
        const { room_id, start_date, end_date } = req.query;
        try {
            if (!room_id || !isUUID(room_id)) {
                throw new Error('Noto‘g‘ri xona ID formati');
            }
            if (!start_date || !end_date) {
                throw new Error('Sana oralig‘i majburiy');
            }
            const rooms = await roomService.getAllRooms();
            const guests = await reservationService.getGuestsByRoomAndDateRange(room_id, start_date, end_date);
            res.render('reservations/filter_guests_in_room', { guests, rooms, room_id, start_date, end_date, error: null });
        } catch (error) {
            const rooms = await roomService.getAllRooms();
            res.status(400).render('reservations/filter_guests_in_room', {
                guests: [],
                rooms,
                room_id,
                start_date,
                end_date,
                error: error.message || 'Ma’lumotlarni olishda xatolik yuz berdi'
            });
        }
    },

    async filterConfirmedNotCheckedIn(req, res) {
        try {
            const reservations = await reservationService.getConfirmedNotCheckedInReservations();
            res.render('reservations/filter_confirmed_not_checked_in', { reservations });
        } catch (error) {
            res.status(500).render('error', { message: error.message || 'Ma’lumotlarni olishda xatolik yuz berdi' });
        }
    }
};

module.exports = reservationController;