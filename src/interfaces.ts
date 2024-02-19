import {Document, Schema} from "mongoose";
import {JwtPayload} from "jsonwebtoken";

export interface IUser extends Document {
    username: string;
    password: string;
    urlPara: string;
    token?: string;
}

export interface IAnnouncement extends Document {
    userId: Schema.Types.ObjectId;
    text: {
        tr: string;
        ar: string;
        de: string;
    }
    startDate: Date;
    endDate: Date;
}

export interface IDailyData extends Document {
    urlPara: number;
    date: Date;
    gregorianDateShort: string;
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    shapeMoon: string;
    hijriDate: string;
}

export interface DeleteResult {
    deletedCount?: number;
}

export interface ITokenPayload extends JwtPayload{
    id: Schema.Types.ObjectId;
    userId: string;
    urlPara: string;
}

export interface TranslationResult {
    translations: Array<{text: string, detected_source_language: string}>;
}

export interface ILocalizedText {
    tr: string;
    ar: string;
    de: string;
}