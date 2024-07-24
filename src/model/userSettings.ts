import mongoose, { Schema } from 'mongoose';
import {IUserSettings} from "../interfaces";

const UserSettingsSchema = new Schema<IUserSettings>({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        cumaPrayingTime: {
            active: { type: Boolean, required: true },
            time: { type: String, required: true }, // Format: "hh:mm"
        },
        fajrPrayingTime: {
            active: { type: Boolean, required: true },
            time: { type: String, required: true }, // Format: "hh:mm"
        },
        standBy: {
            active: { type: Boolean, required: true },
            startTime: { type: String, required: true }, // Format: "hh:mm"
            endTime: { type: String, required: true }, // Format: "hh:mm"
        },
    },
    {
        timestamps: true
    }
);

const UserSettingsModel = mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);

export default UserSettingsModel;
