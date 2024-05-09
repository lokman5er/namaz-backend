import mongoose, { Schema } from 'mongoose';
import {IFridayPreach} from "../interfaces";

const FridayPreachSchema = new Schema<IFridayPreach>({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            tr: { type: String, required: true },
            ar: { type: String, required: true },
            de: { type: String, required: true },
        },
        date: {
            type: Date,
            required: true,
            //unique for users stack
        },
    },
    {
        timestamps: true,
    }
);

const FridayPreachModel = mongoose.model<IFridayPreach>('FridayPreach', FridayPreachSchema);

export default FridayPreachModel;
