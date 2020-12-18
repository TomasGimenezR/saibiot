const mongoose = require('mongoose')

const keySchema = new mongoose.Schema({
    name: {
        type: String
    },
    key_id: {
        type: String,
        required: true,
    }
})

const Key = mongoose.model('keys', keySchema)

module.exports = Key