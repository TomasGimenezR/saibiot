const mongoose = require('mongoose')

const pirSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
})

const PIR = mongoose.model('pirs', pirSchema)

module.exports = PIR