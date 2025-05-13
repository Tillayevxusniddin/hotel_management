const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/', reservationController.index);
router.get('/create', reservationController.create);
router.post('/', reservationController.store);
router.get('/:id', reservationController.show);
router.get('/:id/edit', reservationController.edit);
router.post('/:id/update', reservationController.update);
router.post('/:id/delete', reservationController.delete);

router.get('/filter/by-date-range', reservationController.filterByDateRange);
router.get('/filter/available-rooms', reservationController.filterAvailableRooms);
router.get('/filter/guests-in-room', reservationController.filterGuestsInRoom);
router.get('/filter/confirmed-not-checked-in', reservationController.filterConfirmedNotCheckedIn);

module.exports = router;