import mongoose, {Schema} from 'mongoose';
import {IDailyData} from "../interfaces";

const DailyDataSchema = new Schema<IDailyData>(
    {
        urlPara: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        gregorianDateShort: {
            type: String,
            required: true,
        },
        fajr: {
            type: String,
            required: true,
        },
        sunrise: {
            type: String,
            required: true,
        },
        dhuhr: {
            type: String,
            required: true,
        },
        asr: {
            type: String,
            required: true,
        },
        maghrib: {
            type: String,
            required: true,
        },
        isha: {
            type: String,
            required: true,
        },
        shapeMoon: {
            type: String,
            required: true,
        },
        hijriDate: {
            type: String,
            required: true,
        },
    },
    { collection: 'DailyData' }
);

const DailyDataModel = mongoose.model<IDailyData>('DailyData', DailyDataSchema);

export default DailyDataModel;
