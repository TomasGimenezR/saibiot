const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
    name: {
        duracion_permiso: Number
    }
})

const Settings = mongoose.model('settings', settingsSchema)

module.exports = Settings