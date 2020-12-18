const mongoose = require('mongoose')

const movementSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }
})

const Movement = mongoose.model('movements', movementSchema)

module.exports = Movement