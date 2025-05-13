const guestService = require('../services/guestService');

const guestController = {
    async index(req, res) {
        try {
            const guests = await guestService.getAllGuests();
            console.log('Guests data:', guests); // Ma'lumotlarni log qilamiz
            res.render('guests/index', { guests });
        } catch (error) {
            console.error('Mehmonlarni olishda xatolik:', error);
            res.status(500).send('Serverda xatolik yuz berdi');
        }
    },

    async create(req, res) {
        res.render('guests/create', {error: null});
    },

    async store(req, res) {
        const { full_name, phone, email, address } = req.body;
        const contactInfo = { phone, email, address };
        try {
            await guestService.createGuest(full_name, contactInfo);
            res.redirect('/guests');
        } catch (error) {
            res.render('guests/create', { error: error.message });
        }
    },

    async show(req, res) {
        const guestId = req.params.id;
        try {
            const guest = await guestService.getGuestById(guestId);
            res.render('guests/show', { guest });
        } catch (error) {
            if (error.message === 'Mehmon topilmadi') {
                res.status(404).send('Mehmon topilmadi');
            } else {
                res.status(500).send('Serverda xatolik yuz berdi');
            }
        }
    },

    async edit(req, res) {
        const guestId = req.params.id;
        try {
            const guest = await guestService.getGuestById(guestId);
            res.render('guests/edit', { guest });
        } catch (error) {
            if (error.message === 'Mehmon topilmadi') {
                res.status(404).send('Mehmon topilmadi');
            } else {
                res.status(500).send('Serverda xatolik yuz berdi');
            }
        }
    },

    async update(req, res) {
        const guestId = req.params.id;
        const { full_name, phone, email, address } = req.body;
        const contactInfo = { phone, email, address };
        try {
            await guestService.updateGuest(guestId, full_name, contactInfo);
            res.redirect('/guests/' + guestId);
        } catch (error) {
            if (error.message === 'Mehmon topilmadi') {
                res.status(404).send('Mehmon topilmadi');
            } else {
                res.render('guests/edit', { guest: { id: guestId }, error: error.message });
            }
        }
    },

    async delete(req, res) {
        const guestId = req.params.id;
        try {
            await guestService.deleteGuest(guestId);
            res.redirect('/guests');
        } catch (error) {
            if (error.message === 'Mehmon topilmadi') {
                res.status(404).send('Mehmon topilmadi');
            } else {
                res.status(500).send('Serverda xatolik yuz berdi');
            }
        }
    },
};

module.exports = guestController;