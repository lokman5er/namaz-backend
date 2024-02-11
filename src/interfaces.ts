import {Document} from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    urlPara: string;
    token?: string;
}

export interface IAnnouncement extends Document {
    urlPara: string;
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

export interface DatabaseError extends Error {
    code: number;
}