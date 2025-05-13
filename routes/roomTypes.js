const express = require('express');
const router = express.Router();
const roomTypesController = require('../controllers/roomTypesController');

// Statik yo‘nalishlar birinchi keladi
router.get('/room-types/create', roomTypesController.createRoomTypeForm);
router.get('/room-types/:id/edit', roomTypesController.editRoomTypeForm);

// Dinamik va boshqa yo‘nalishlar keyin keladi
router.get('/room-types', roomTypesController.getAllRoomTypes);
router.get('/room-types/:id', roomTypesController.getRoomTypeById);
router.post('/room-types', roomTypesController.createRoomType);
router.put('/room-types/:id', roomTypesController.updateRoomType);
router.delete('/room-types/:id', roomTypesController.deleteRoomType);

module.exports = router;