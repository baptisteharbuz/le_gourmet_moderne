const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const database = require('./config.js');
const userRoutes = require('./route/user.route');
const reservationRoutes = require('./route/reservation.route');

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

database.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});

app.use('/user', userRoutes);
app.use('/reservation', reservationRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});