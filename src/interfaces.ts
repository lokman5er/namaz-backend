import {Document, Schema} from "mongoose";
import {JwtPayload} from "jsonwebtoken";

export interface IUser extends Document {
    username: string;
    password: string;
    urlPara: string;
    token?: string;
}

type TimeSetting = {
    active: boolean;
    time: string; // Format: "hh:mm"
};

type TimeRangeSetting = {
    active: boolean;
    startTime: string; // Format: "hh:mm"
    endTime: string; // Format: "hh:mm"
};

export interface IUserSettings extends Document {
    userId: Schema.Types.ObjectId;
    preach: TimeRangeSetting;
    cumaPrayingTime: TimeSetting;
    fajrPrayingTime: TimeSetting;
    standBy: TimeRangeSetting;
}

export interface IFridayPreach extends Document {
    userId: Schema.Types.ObjectId;
    text: {
        tr: string;
        ar: string;
        de: string;
    }
    date: Date;
}


//das wird aus userSettings rausgezogen und mitgesendet später, also hier raus
//for Quran translations
type translationKeys = [
    {
        key: allowedLanguageKeys; //hier die erlaubten sprachen auflisten
        value: allowedTranslationValues;
    }
]

type allowedLanguageKeys = "de" | "tr" | "ar" | "en";
type allowedTranslationValues = "bubenheim" | "noch andere";

export interface IVerseContent extends Document {
    sura: number;
    startVerse: number;
    endVerse: number;
}

export interface IAnnouncementContent extends Document {
    text: LocalizedTextSchema
}

export interface IUserContent extends Document {
    userId: Schema.Types.ObjectId;
    type: "verse" | "announcement";
    content: IVerseContent | IAnnouncementContent;
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

export interface LocalizedTextSchema {
    tr: string;
    ar: string;
    de: string;
}
