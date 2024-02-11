import mongoose, {Schema} from 'mongoose';
import {IAnnouncement} from "../interfaces";

const AnnouncementSchema = new Schema<IAnnouncement>(
    {
        urlPara: {
            type: String,
            required: true,
        },
        text: {
            tr: { type: String, required: true },
            ar: { type: String, required: true },
            de: { type: String, required: true },
        },
        startDate: {
            type: Date,
            required: true,
            //unique for users stack
        },
        endDate: {
            type: Date,
            required: false,
        },
    },
    { collection: 'announcements' }
);

const AnnouncementModel =
    mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

export default AnnouncementModel;
