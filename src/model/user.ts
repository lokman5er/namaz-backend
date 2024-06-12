import mongoose, { Schema } from 'mongoose';
import {IUser} from "../interfaces";

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
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
            unique: false
        },
        token: {
            type: String,
            required: false,
        },
    },
    { collection: 'users' }
);

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
