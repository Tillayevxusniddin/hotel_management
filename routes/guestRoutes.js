const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

router.get('/', guestController.index);
router.get('/create', guestController.create);
router.post('/', guestController.store);
router.get('/:id', guestController.show);
router.get('/:id/edit', guestController.edit);
router.post('/:id/update', guestController.update);
router.post('/:id/delete', guestController.delete);

module.exports = router;