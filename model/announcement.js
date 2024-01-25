"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AnnouncementSchema = new mongoose_1.default.Schema({
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
}, { collection: 'announcements' });
const model = mongoose_1.default.model('AnnouncementSchema', AnnouncementSchema);
module.exports = model;
exports.default = model;
