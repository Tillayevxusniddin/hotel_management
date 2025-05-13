const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.index);
router.get('/create', roomController.create);
router.post('/', roomController.store);
router.get('/:id', roomController.show);
router.get('/:id/edit', roomController.edit);
router.post('/:id/update', roomController.update);
router.post('/:id/delete', roomController.delete);

module.exports = router;