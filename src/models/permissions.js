const mongoose = require('mongoose')

const permissionSchema = new mongoose.Schema({
    starting_time: {
        type: Date
    },
    key: {
        type: String 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
})

const Permission = mongoose.model('permission', permissionSchema)

module.exports = Permission