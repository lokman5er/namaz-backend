import request from "request";
import {IDailyData} from "../interfaces";
import mongoose from "mongoose";
import {createMongooseDate} from "../utils";
import DailyData from "../model/dailyData";
import util from "util";

const DIYANET_MAIL: string = process.env.DIYANET_MAIL || "";
const DIYANET_PW: string = process.env.DIYANET_PW || "";

const requestPromise = util.promisify(request);

let diyanetAuthentication = {
    accessToken: "",
    refreshToken: "",
    creationTime: new Date()
}

export async function fetchMonthlyData(urlPara: number): Promise<void> {

    const highestDate = await getHighestDateByUrlPara(urlPara);
    //

    if (highestDate && isDateAtLeast20DaysAhead(highestDate)) {
        return;
    }

    if (diyanetAuthentication.accessToken === "") {
        await loginWithDiyanet();
    } else if (isCreationTimeMoreThan15MinutesAgo(diyanetAuthentication.creationTime)){
        //get new token with refreshToken
    }

    const monthlyDataOptions: request.Options = {
        method: "GET",
        url: `https://awqatsalah.diyanet.gov.tr/api/PrayerTime/Monthly/${urlPara}`,
        headers: {
            accept: "text/plain",
            Authorization: `Bearer ${diyanetAuthentication.accessToken}`,
        },
    };

    const monthlyDataResponse: request.Response = await requestPromise(monthlyDataOptions);
    const monthlyBody = JSON.parse(monthlyDataResponse.body);

    let monthlyData: IDailyData[] = [];
    const DailyDataModel: mongoose.Model<IDailyData> = mongoose.model<IDailyData>('DailyData');

    if (!monthlyBody.data) {
        console.error(monthlyBody);
        return;
    }

    monthlyBody.data.forEach((element: any): void => {
        const newDailyData: IDailyData = new DailyDataModel({
            urlPara: Number(urlPara),
            date: createMongooseDate(element.gregorianDateShort),
            gregorianDateShort: element.gregorianDateShort,
            fajr: element.fajr,
            sunrise: element.sunrise,
            dhuhr: element.dhuhr,
            asr: element.asr,
            maghrib: element.maghrib,
            isha: element.isha,
            shapeMoon: getMoon(element.shapeMoonUrl),
            hijriDate: element.hijriDateShort,
        });

        monthlyData.push(newDailyData);
    });

    if (highestDate === null) {
        await saveData(monthlyData)
    } else {
        //filter data to only include dates greater than highestDate
        const filteredData: IDailyData[] = monthlyData
            .map((datum: any) => {
                if (datum.date > highestDate) {
                    return datum;
                }
            })
            .filter((datum: any) => datum !== undefined);

        await saveData(filteredData);
    }
}

async function saveData(data: IDailyData[]): Promise<void> {
    try {
        await DailyData.create(data);
        console.log("Data saved successfully for urlPara: " + data[0].urlPara);
    } catch (error) {
        console.error("Error occurred during attempt to save diyanet data in database " + error);
    }
}

function getMoon(url: string): string {
    var regex = /https:\/\/awqatsalah\.diyanet\.gov\.tr\/images\/(.*?)\.gif/;
    var match = url.match(regex);
    if (match) {
        return match[1];
    }
    console.error(url);
    return "";
}

async function getHighestDateByUrlPara(urlPara: number): Promise<Date | null> {
    const today: string = new Date().toISOString().slice(0, 10);

    const result: IDailyData[] = await DailyData.find({
        urlPara,
        date: {$gte: today},
    });

    if (result === null) {
        return null;
    }

    let maxDate = null;
    for (const entry of result) {
        if (maxDate === null || entry.date > maxDate) {
            maxDate = entry.date;
        }
    }

    return maxDate;
}


async function loginWithDiyanet(): Promise<void> {
    const loginOptions: request.Options = {
        method: "POST",
        url: "https://awqatsalah.diyanet.gov.tr/Auth/Login",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: DIYANET_MAIL,
            password: DIYANET_PW,
        }),
    };

    try {
        const loginResponse: request.Response = await requestPromise(loginOptions);
        const loginBody = JSON.parse(loginResponse.body);

        diyanetAuthentication.accessToken = loginBody.data.accessToken;
        diyanetAuthentication.refreshToken = loginBody.data.refreshToken;
    } catch (error) {
        console.error("Login failed with error: ", error);
        throw error;
    }

    return;
}

function isDateAtLeast20DaysAhead(highestDate: Date): boolean {
    const today = new Date();
    const dateIn20Days = new Date();
    dateIn20Days.setDate(today.getDate() + 20);

    return highestDate >= dateIn20Days;
}

function isCreationTimeMoreThan15MinutesAgo(creationTime: Date): boolean {
    const currentTime = new Date(); // Aktuelle Zeit
    const fifteenMinutes = 15 * 60 * 1000; // 15 Minuten in Millisekunden
    const timeDifference = currentTime.getTime() - creationTime.getTime(); // Differenz in Millisekunden

    return timeDifference >= fifteenMinutes;
}
