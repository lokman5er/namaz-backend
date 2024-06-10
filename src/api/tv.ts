import express, {Request, response, Response} from 'express';
import DailyData from "../model/dailyData";
import User from "../model/user";
import {IDailyData, ITermsAccepted, IUser} from "../interfaces";
import {handleError, sendMessageToTelegramGroup} from "../utils";
import {fetchMonthlyData} from "../util/diyanetUtil";
import {CURRENT_TV_VERSION, TV_TERMS_AND_CONDITIONS_VERSION} from "../constants/constants";
import {IncomingHttpHeaders} from "http";
import TermsAccepted from "../model/termsAccepted";

const router = express.Router();

router.get("/daily-data", async (req: Request, res: Response): Promise<void> => {
    if (checkTvVersion(req.headers, res)) return;

    const username = req.headers.username;
    const cityId = req.headers.cityid as string;

    let urlPara;

    if (username && username !== "") {
        const user: IUser | null = await User.findOne({
            username
        });

        if (!user) {
            res.status(404).send("No user found with username: " + username);
            return;
        }

        urlPara = user.urlPara;
    } else if (cityId && cityId !== "-1") {
        urlPara = cityId;
    } else {
        return;
    }

    await fetchMonthlyData(parseInt(urlPara));

    const today: string = new Date().toISOString().slice(0, 10);

    try {
        const result: IDailyData[] = await DailyData.find({
            urlPara,
            date: {$gte: today}
        }).sort({date: 1});

        res.status(200).json(result);
    } catch (error) {
        const serverLogMessage = "Error while trying to get daily data for username: " + username;

        handleError(res, error, serverLogMessage);
    }
});

router.get("/check-username", async (req: Request, res: Response): Promise<void> => {
    if (checkTvVersion(req.headers, res)) return;

    const username = req.headers.username;

    if (!username) {
        res.status(400).send("try harder ;)");
        return;
    }

    try {
        const user: IUser | null = await User.findOne({
            username
        });

        if (!user) {
            res.status(404).send("No user found with username: " + username);
            return;
        }

        res.status(200).send("User found");
    } catch (error) {
        const serverLogMessage = "Error while trying to find user with username: " + username;

        handleError(res, error, serverLogMessage);
    }
});

router.get("/terms-accepted", async (req: Request, res: Response): Promise<void> => {
    if (checkTvVersion(req.headers, res)) return;

    const deviceId = req.headers.deviceid;

    if (!deviceId) {
        res.status(400).send("try harder ;)");
        return;
    }

    try {
        const result: ITermsAccepted | null = await TermsAccepted.findOne({deviceId});

        if (!result) {
            res.status(412).send("Terms not accepted by deviceId: " + deviceId);
            return;
        }

        res.status(200).send("Terms already accepted by deviceId: " + deviceId);
    } catch (error) {
        const serverLogMessage = "Error while trying to find termsAccepted for deviceId " + deviceId;

        handleError(res, error, serverLogMessage);
    }
});

router.post("/accept-terms", async (req: Request, res: Response): Promise<void> => {
    if (checkTvVersion(req.headers, res)) return;

    const {deviceId} = req.body;

    if (!deviceId) {
        res.status(400).send("try harder ;)");
        return;
    }

    try {
        const result: ITermsAccepted | null = await TermsAccepted.findOne({deviceId});

        if (result) {
            res.status(409).send("Terms already accepted by deviceId: " + deviceId);
            return;
        }

        await TermsAccepted.create({
            deviceId,
            termsVersion: TV_TERMS_AND_CONDITIONS_VERSION
        });

        res.status(200).send("Terms accepted by deviceId: " + deviceId);
    } catch (error) {
        const serverLogMessage = "Error while trying to create termsAccepted for deviceId " + deviceId;

        handleError(res, error, serverLogMessage);
    }
});

router.get("/user-content", async (req: Request, res: Response): Promise<void> => {
    if (checkTvVersion(req.headers, res)) return;

    const username = req.headers.username;

    if (!username) {
        res.status(400).send("try harder ;)");
        return;
    }

    try {
        const user: IUser | null = await User.findOne({
            username
        });

        if (!user) {
            res.status(404).send("No user found with username: " + username);
            return;
        }

        const result = {
            cumaPrayingTime: "13:45",
            fajrPrayingTime: "03:12",
            content: {
                type: "announcement",
                de: "das hier ist eine Mitteilung auf DEr ist eine Mitteilung auf DEr ist eine Mitteilung auf DE",
                tr: "das hier ist eine Mittelung auf TRelung auf TRelung auf TRelung auf TRelung auf TRelung auf TR",
                ar: "Das hier ist eine Mitteilung auf ARitteilung auf ARitteilung auf ARitteilung auf ARitteilung auf ARitteilung auf AR"
            }
        }

        const result2 = {
            cumaPrayingTime: "12:45",
            fajrPrayingTime: "05:12",
            content: {
                type: "verse",
                sura: 6,
                startVerse: 12,
                endVerse: 15
            }
        }

        res.status(200).send({});
    } catch (error) {
        const serverLogMessage = "Error while trying to find userContent with username: " + username;

        handleError(res, error, serverLogMessage);
    }
});

router.post('/log-error', async (req: Request, res: Response): Promise<void> => {
    console.log('Error received from client:', req.body);
    await sendMessageToTelegramGroup(req.body);
    res.status(204).send();
});

export default router;


function checkTvVersion (headers: IncomingHttpHeaders, res: Response): boolean {
    const appVersion = headers['app-version'];

    if (appVersion !== CURRENT_TV_VERSION) {
        res.status(426).send({data: "App-Version is outdated, please update to newest version."});
        return true;
    }
    return false;
}

