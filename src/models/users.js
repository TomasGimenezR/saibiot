const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    codigo: {
        type: String,
        unique: true,
        required: true
    },
    admin: {
        type: Boolean
    },
    name: {
        type: String,
        required: true
    },
    adicional: {
        type: String
    }
})

const User = mongoose.model('user', userSchema)

module.exports = User