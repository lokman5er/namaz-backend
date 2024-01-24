import mongoose from "mongoose"

const AnnouncementSchema = new mongoose.Schema({
    urlPara: {
        type: String,
        required: true
    },
    text: {
        tr: { type: String, required: true },
        ar: { type: String, required: true },
        de: { type: String, required: true }
    },
    startDate: {
        type: Date,
        required: true
        //unique for users stack
    },
    endDate: {
        type: Date,
        required: false
    },
}, { collection: 'announcements' })

const model = mongoose.model('AnnouncementSchema', AnnouncementSchema)

module.exports = model

export default model