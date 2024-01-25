"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MoonSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        unique: true,
        required: true,
    },
    value: {
        type: Number,
        required: true
    }
}, { collection: 'moonFractions' });
const model = mongoose_1.default.model('MoonSchema', MoonSchema);
module.exports = model;
exports.default = model;
