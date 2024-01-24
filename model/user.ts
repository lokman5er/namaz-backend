import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
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
    },
    { collection: 'users' }
);

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;

export default model;
