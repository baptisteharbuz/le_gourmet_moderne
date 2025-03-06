const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const database = mongoose.connect(process.env.URL_MONGO)
    .then(() => console.log('Conected to MongoDB'))
    .catch(err => console.log(err));

    module.exports = database;