import mongoose, {Schema} from 'mongoose';
import {IUserContent} from "../interfaces";

const UserContentSchema = new Schema<IUserContent>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['verse', 'announcement'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
}, {discriminatorKey: 'type', collection: 'userContents'});

const UserContent=
    mongoose.model<IUserContent>('UserContent', UserContentSchema);

const VerseContentSchema = new Schema({
    content: {
        sura: {type: Number, required: true},
        startVerse: {type: Number, required: true},
        endVerse: {type: Number,required: true}
    },
});

const AnnouncementContentSchema = new Schema({
    content: {
        text: {
            tr: { type: String, required: true },
            ar: { type: String, required: true },
            de: { type: String, required: true },
        }
    },
});

const VerseContent = UserContent.discriminator('verse', VerseContentSchema);
const AnnouncementContent = UserContent.discriminator('announcement', AnnouncementContentSchema);

export { UserContent, VerseContent, AnnouncementContent };
