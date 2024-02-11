import {Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import {Context, Telegraf} from 'telegraf';

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
    const bot: Telegraf<Context> = new Telegraf(process.env.TELEGRAM_CREDENTIALS);
    await bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, message);
}