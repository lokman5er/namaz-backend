const mongoose = require('mongoose')

const MoonSchema = new mongoose.Schema({
    date: {
        type: Date,
        unique: true,
        required: true,
    },
    value: {
        type: Number,
        required: true
    }
}, { collection: 'moonFractions' })

const model = mongoose.model('MoonSchema', MoonSchema)

module.exports = model