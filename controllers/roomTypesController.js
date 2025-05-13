const { validate: uuidValidate } = require('uuid');
const roomTypesService = require('../services/roomTypesService');

exports.getAllRoomTypes = async (req, res) => {
    try {
        const roomTypes = await roomTypesService.getAllRoomTypes();
        res.render('roomTypes/index', { roomTypes, error: null });
    } catch (error) {
        res.status(500).send('Xona turlarini olishda xatolik: ' + error.message);
    }
};

exports.getRoomTypeById = async (req, res) => {
    const id = req.params.id;
    if (!uuidValidate(id)) {
        return res.status(400).send('Noto‘g‘ri UUID formati');
    }
    try {
        const roomType = await roomTypesService.getRoomTypeById(id);
        if (!roomType) {
            return res.status(404).send('Xona turi topilmadi');
        }
        res.render('roomTypes/show', { roomType, error: null });
    } catch (error) {
        res.status(404).send('Xona turi topilmadi: ' + error.message);
    }
};

exports.createRoomTypeForm = async (req, res) => {
    try {
        res.render('roomTypes/create', { error: null });
    } catch (error) {
        res.status(500).send('Yangi xona turi formasini ko‘rsatishda xatolik: ' + error.message);
    }
};

exports.createRoomType = async (req, res) => {
    try {
        const { type_name, description } = req.body;
        if (!type_name) {
            return res.status(400).render('roomTypes/create', { error: 'Xona turi nomi majburiy' });
        }
        await roomTypesService.createRoomType(type_name, description);
        res.redirect('/room-types');
    } catch (error) {
        res.status(400).render('roomTypes/create', { error: 'Xona turi qo‘shishda xatolik: ' + error.message });
    }
};

exports.editRoomTypeForm = async (req, res) => {
    const id = req.params.id;
    if (!uuidValidate(id)) {
        return res.status(400).send('Noto‘g‘ri UUID formati');
    }
    try {
        const roomType = await roomTypesService.getRoomTypeById(id);
        if (!roomType) {
            return res.status(404).send('Xona turi topilmadi');
        }
        res.render('roomTypes/edit', { roomType, error: null });
    } catch (error) {
        res.status(404).send('Xona turi topilmadi: ' + error.message);
    }
};

exports.updateRoomType = async (req, res) => {
    const id = req.params.id;
    if (!uuidValidate(id)) {
        return res.status(400).send('Noto‘g‘ri UUID formati');
    }
    try {
        const { type_name, description } = req.body;
        if (!type_name) {
            return res.status(400).render('roomTypes/edit', { roomType: { id }, error: 'Xona turi nomi majburiy' });
        }
        await roomTypesService.updateRoomType(id, type_name, description);
        res.redirect(`/room-types/${id}`);
    } catch (error) {
        res.status(400).render('roomTypes/edit', { roomType: { id }, error: 'Xona turi yangilashda xatolik: ' + error.message });
    }
};

exports.deleteRoomType = async (req, res) => {
    const id = req.params.id;
    if (!uuidValidate(id)) {
        return res.status(400).send('Noto‘g‘ri UUID formati');
    }
    try {
        await roomTypesService.deleteRoomType(id);
        res.redirect('/room-types');
    } catch (error) {
        res.status(400).send('Xona turi o‘chirishda xatolik: ' + error.message);
    }
};