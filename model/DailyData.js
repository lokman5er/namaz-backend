"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DailyDataSchema = new mongoose_1.default.Schema({
    urlPara: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    gregorianDateShort: {
        type: String,
        required: true
    },
    fajr: {
        type: String,
        required: true
    },
    sunrise: {
        type: String,
        required: true
    },
    dhuhr: {
        type: String,
        required: true
    },
    asr: {
        type: String,
        required: true
    },
    maghrib: {
        type: String,
        required: true
    },
    isha: {
        type: String,
        required: true
    },
    shapeMoon: {
        type: String,
        required: true
    },
    hijriDate: {
        type: String,
        required: true
    }
}, { collection: 'DailyData' });
const model = mongoose_1.default.model('DailyDataSchema', DailyDataSchema);
module.exports = model;
exports.default = model;
