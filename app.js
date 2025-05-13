const express = require('express');
const app = express();
const path = require('path');
const guestRoutes = require('./routes/guestRoutes');
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const roomTypesRoutes = require('./routes/roomTypes');
const methodOverride = require('method-override');

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use('/guests', guestRoutes);
app.use('/rooms', roomRoutes);
app.use('/reservations', reservationRoutes);
app.use('/', roomTypesRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Serverda xatolik yuz berdi!' });
});

app.listen(port, () => {
    console.log(`Server ${port} portda ishlayapti`);
});