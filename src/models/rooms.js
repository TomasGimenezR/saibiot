const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type: String
    },
    temp: {
        type: String
    },
    hum: {
        type: String
    },
})

const Room = mongoose.model('rooms', roomSchema)

module.exports = Room