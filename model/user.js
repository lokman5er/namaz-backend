"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    urlPara: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: false,
    },
}, { collection: 'users' });
const model = mongoose_1.default.model('UserSchema', UserSchema);
module.exports = model;
exports.default = model;
