import {Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import {Context, Telegraf} from 'telegraf';
import axios from 'axios';
import {TranslationResult} from "./interfaces";

export function handleError(res: Response, error: unknown, serverLogMessage: string): void {
    console.error(serverLogMessage, error);

    if (error instanceof Error) {
        res.status(500).json({status: 'error', error: error.message});
    } else {
        res.status(500).json({status: 'error', error: 'Unknown error'});
    }
}

export function checkTokenExpiration(token: string, res: Response): boolean {
    const decodedToken = jwt.decode(token) as JwtPayload | null;

    if (decodedToken && decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
        res.status(401).send("Token is expired");
        return true;
    }

    return false;
}

export function createMongooseDate(input: string): Date {
    const dateComponents = input.split(".");
    const day = parseInt(dateComponents[0]);
    const month = parseInt(dateComponents[1]) - 1;
    const year = parseInt(dateComponents[2]);
    var date = new Date(Date.UTC(year, month, day));
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
}

export async function sendMessageToTelegramGroup(message: string): Promise<void> {
    const bot: Telegraf<Context> = new Telegraf(process.env.TELEGRAM_CREDENTIALS as string);
    await bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID as string, message);
}

export async function translateText(text: string, targetLanguage: string): Promise<TranslationResult> {
    const endpoint = 'https://api-free.deepl.com/v2/translate';
    const authKey = process.env.DEEPL_API_KEY;

    try {
        const response = await axios.post(endpoint, {
            text: [text],
            target_lang: targetLanguage,
        }, {
            headers: {
                'Authorization': `DeepL-Auth-Key ${authKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

export function isFriday(date: Date): boolean {
    return date.getDay() === 5;
}

export function validateTextFields(text: any, limit: number): boolean {
    return Object.values(text).every(
        (value) => typeof value === 'string' && value.trim() !== "" && value.trim().length <= limit
    );
}

export function validateEmail(mail: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(mail).toLowerCase());
}

export function validateLanguage(language: string): boolean {
    return language === "en" || language === "tr" || language === "de";
}
