const roomService = require('../services/roomService');
const roomTypes = require('../models/roomTypeModel'); // room_types jadvali uchun model (agar mavjud bo'lsa)

const roomController = {
    async index(req, res) {
        try {
            const rooms = await roomService.getAllRooms();
            res.render('rooms/index', { rooms });
        } catch (error) {
            res.status(500).send('Serverda xatolik yuz berdi');
        }
    },

    async create(req, res) {
        try {
            const roomTypesList = await roomTypes.getAll(); // room_types ro'yxatini olish
            res.render('rooms/create', { roomTypes: roomTypesList });
        } catch (error) {
            res.status(500).send('Serverda xatolik yuz berdi');
        }
    },

    async store(req, res) {
        const { room_number, room_type_id, price_per_night } = req.body;
        try {
            await roomService.createRoom(room_number, room_type_id, price_per_night);
            res.redirect('/rooms');
        } catch (error) {
            res.render('rooms/create', { error: error.message });
        }
    },

    async show(req, res) {
        const roomId = req.params.id;
        try {
            const room = await roomService.getRoomById(roomId);
            res.render('rooms/show', { room });
        } catch (error) {
            if (error.message === 'Xona topilmadi') {
                res.status(404).send('Xona topilmadi');
            } else {
                res.status(500).send('Serverda xatolik yuz berdi');
            }
        }
    },

    async edit(req, res) {
        const roomId = req.params.id;
        try {
            const room = await roomService.getRoomById(roomId);
            const roomTypesList = await roomTypes.getAll(); // room_types ro'yxatini olish
            res.render('rooms/edit', { room, roomTypes: roomTypesList });
        } catch (error) {
            if (error.message === 'Xona topilmadi') {
                res.status(404).send('Xona topilmadi');
            } else {
                res.status(500).send('Serverda xatolik yuz berdi');
            }
        }
    },

    async update(req, res) {
        const roomId = req.params.id;
        const { room_number, room_type_id, price_per_night } = req.body;
        try {
            await roomService.updateRoom(roomId, room_number, room_type_id, price_per_night);
            res.redirect('/rooms/' + roomId);
        } catch (error) {
            if (error.message === 'Xona topilmadi') {
                res.status(404).send('Xona topilmadi');
            } else {
                res.render('rooms/edit', { room: { id: roomId }, error: error.message });
            }
        }
    },

    async delete(req, res) {
        const roomId = req.params.id;
        try {
            await roomService.deleteRoom(roomId);
            res.redirect('/rooms');
        } catch (error) {
            if (error.message === 'Xona topilmadi') {
                res.status(404).send('Xona topilmadi');
            } else {
                res.status(500).send('Serverda xatolik yuz berdi');
            }
        }
    },
};

module.exports = roomController;