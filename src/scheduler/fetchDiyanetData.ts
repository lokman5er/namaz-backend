import DailyData from "../model/dailyData";
import util from "util";
import request from "request";
import {createMongooseDate} from "../utils";
import {IDailyData, IUser} from "../interfaces";
import mongoose from "mongoose";
import User from "../model/user";

const DIYANET_MAIL: string = process.env.DIYANET_MAIL || "";
const DIYANET_PW: string = process.env.DIYANET_PW || "";

const requestPromise = util.promisify(request);

export async function schedulerJob(): Promise<void> {
    const dayOfMonth: number = new Date().getDate();

    // needed since the Heroku Scheduler can be configured to run at least once a day
    // if (!(dayOfMonth === 1 || dayOfMonth === 15)) {
    //     console.log("No need to fetch new DiyanetData today, as it's not the 1st or 15th day of the month");
    //     return;
    // }

    const allUsers: IUser[] = await User.find();

    let uniqueUrlParas: string[] = [];

    for (const user of allUsers) {
        if (uniqueUrlParas.indexOf(user.urlPara) === -1) {
            uniqueUrlParas.push(user.urlPara);
        }
    }

    let accessToken: string = await getAccessTokenByDiyanet();

    for (const urlPara of uniqueUrlParas) {
        //TODO osman: check here if accesstoken expired
        // https://awqatsalah.diyanet.gov.tr/files/56d83ac4-f7f5-4f6e-9b9e-b1ffeebf1b6a.pdf
        // if(accesstoken is expired) {accessToken = refreshAccessToken() or something like that}
        await fetchMonthlyData(Number(urlPara), accessToken);
    }

    console.log("Successfully saved monthly data for following urlParas: " + uniqueUrlParas);
}

async function fetchMonthlyData(urlPara: number, accessToken: string): Promise<void> {

    const highestDate: Promise<Date | null> = getHighestDateByUrlPara(urlPara);

    const monthlyDataOptions: request.Options = {
        method: "GET",
        url: `https://awqatsalah.diyanet.gov.tr/api/PrayerTime/Monthly/${urlPara}`,
        headers: {
            accept: "text/plain",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const monthlyDataResponse: request.Response = await requestPromise(monthlyDataOptions);
    const monthlyBody = JSON.parse(monthlyDataResponse.body);

    let monthlyData: IDailyData[] = [];
    const DailyDataModel: mongoose.Model<IDailyData> = mongoose.model<IDailyData>('DailyData');

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

function getMoon(url: string): string | null {
    var regex = /http:\/\/namazvakti\.diyanet\.gov\.tr\/images\/(.*?)\.gif/;
    var match = url.match(regex);
    if (match) {
        return match[1];
    }
    return null;
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

    const highestDate: IDailyData | null = result.sort((a: any, b: any) => b.date - a.date)[0];

    return highestDate.date;
}


async function getAccessTokenByDiyanet(): Promise<string> {
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

    const loginResponse: request.Response = await requestPromise(loginOptions);
    const loginBody = JSON.parse(loginResponse.body);

    return loginBody.data.accessToken;
}

schedulerJob();
